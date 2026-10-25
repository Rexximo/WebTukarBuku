import assert from "node:assert/strict";
import supertest from "supertest";

async function main(): Promise<void> {
  process.env.NODE_ENV = "test";
  process.env.USE_MEMORY_DB = "true";
  process.env.JWT_SECRET = "smoke-test-secret-key-1234567890";
  process.env.MAX_ACTIVE_REQUESTS = "2";
  process.env.REQUEST_EXPIRY_DAYS = "3";

  const { connectDatabase, disconnectDatabase } = await import(
    "../db/connect.js"
  );
  const { createApp } = await import("../app.js");
  const { seedDatabase } = await import("./seed-data.js");
  const { SwapRequestModel } = await import(
    "../models/swap-request.model.js"
  );
  const { expireOverdueRequests } = await import(
    "../services/swap.service.js"
  );

  await connectDatabase();
  await seedDatabase();

  const app = createApp();
  const api = supertest(app);
  const admin = supertest.agent(app);
  const member = supertest.agent(app);
  const other = supertest.agent(app);

  const cover = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  console.log("1. Katalog publik & proteksi endpoint admin");
  const catalog = await api.get("/api/books").expect(200);
  assert.equal(catalog.body.total, 12);
  await api.post("/api/books").field("title", "Tanpa Izin").expect(401);

  console.log("2. Login admin & CRUD buku");
  const adminLogin = await admin
    .post("/api/auth/login")
    .send({ username: "admin", password: "admin12345" })
    .expect(200);
  assert.equal(adminLogin.body.user.role, "admin");

  const createdBook = await admin
    .post("/api/books")
    .field("title", "Buku Uji Coba")
    .field("author", "Penulis Uji")
    .field("genre", "Fiksi")
    .field("condition", "baik")
    .field("description", "Buku untuk pengujian otomatis.")
    .field("publisher", "Penerbit Uji")
    .field("year", "2024")
    .attach("cover", cover, {
      filename: "cover.png",
      contentType: "image/png",
    })
    .expect(201);
  const newBookId = createdBook.body.book.id as string;
  assert.equal(createdBook.body.book.status, "tersedia");

  await admin
    .patch(`/api/books/${newBookId}`)
    .field("title", "Buku Uji Coba Edisi 2")
    .expect(200);
  const badFormat = await admin
    .post("/api/books")
    .field("title", "Format Salah")
    .field("author", "Penulis")
    .field("genre", "Fiksi")
    .field("condition", "baik")
    .field("description", "Deskripsi")
    .attach("cover", Buffer.from("bukan gambar"), {
      filename: "catatan.txt",
      contentType: "text/plain",
    })
    .expect(400);
  assert.match(badFormat.body.message as string, /Format gambar/);

  console.log("3. Manajemen anggota oleh admin");
  await admin
    .post("/api/users")
    .send({
      name: "Uji Anggota",
      username: "uji.anggota",
      phone: "08123456789",
      address: "Jl. Uji No. 1",
      password: "rahasia123",
    })
    .expect(201);
  await admin
    .post("/api/users")
    .send({
      name: "Duplikat",
      username: "uji.anggota",
      phone: "08123456789",
      password: "rahasia123",
    })
    .expect(409);
  await admin
    .post("/api/users")
    .send({
      name: "Uji Kedua",
      username: "uji.kedua",
      phone: "08129876543",
      password: "rahasia123",
    })
    .expect(201);

  console.log("4. Login anggota, wajib ganti kata sandi, dan role");
  const memberLogin = await member
    .post("/api/auth/login")
    .send({ username: "uji.anggota", password: "rahasia123" })
    .expect(200);
  assert.equal(memberLogin.body.user.mustChangePassword, true);
  await member.get("/api/users").expect(403);
  await member.get("/api/admin/stats").expect(403);

  const changed = await member
    .post("/api/auth/change-password")
    .send({ currentPassword: "rahasia123", newPassword: "rahasia456" })
    .expect(200);
  assert.equal(changed.body.user.mustChangePassword, false);

  await member
    .post("/api/auth/login")
    .send({ username: "uji.anggota", password: "rahasia456" })
    .expect(200);

  const otherLogin = await other
    .post("/api/auth/login")
    .send({ username: "uji.kedua", password: "rahasia123" })
    .expect(200);
  assert.equal(otherLogin.body.user.role, "anggota");

  console.log("5. Ajukan penukaran & reservasi buku atomik");
  const firstRequest = await member
    .post("/api/swap-requests")
    .field("bookId", "hening-yang-tumbuh")
    .field("title", "Buku Uji Ditukar")
    .field("author", "Penulis Uji")
    .field("condition", "baik")
    .field("notes", "Kondisi mulus.")
    .attach("photo", cover, {
      filename: "foto.png",
      contentType: "image/png",
    })
    .expect(201);
  const firstRequestId = firstRequest.body.request.id as string;
  assert.equal(firstRequest.body.request.status, "menunggu");

  const reservedBook = await api
    .get("/api/books/hening-yang-tumbuh")
    .expect(200);
  assert.equal(reservedBook.body.book.status, "dipesan");

  const conflict = await other
    .post("/api/swap-requests")
    .field("bookId", "hening-yang-tumbuh")
    .field("title", "Buku Lain")
    .field("author", "Penulis Lain")
    .field("condition", "baik")
    .expect(409);
  assert.match(conflict.body.message as string, /sedang dipesan/);

  console.log("6. Batas permintaan aktif & pembatalan");
  await member
    .post("/api/swap-requests")
    .field("bookId", "jeda-di-antara")
    .field("title", "Buku Kedua")
    .field("author", "Penulis Kedua")
    .field("condition", "baik")
    .expect(201);
  const limit = await member
    .post("/api/swap-requests")
    .field("bookId", "kebun-kecil")
    .field("title", "Buku Ketiga")
    .field("author", "Penulis Ketiga")
    .field("condition", "baik")
    .expect(409);
  assert.match(limit.body.message as string, /Batas permintaan aktif/);

  await member
    .post(`/api/swap-requests/${firstRequestId}/cancel`)
    .expect(200);
  const freedBook = await api
    .get("/api/books/hening-yang-tumbuh")
    .expect(200);
  assert.equal(freedBook.body.book.status, "tersedia");

  console.log("7. Admin menyetujui permintaan");
  const secondRequest = await member
    .post("/api/swap-requests")
    .field("bookId", "hening-yang-tumbuh")
    .field("title", "Buku Uji Ditukar")
    .field("author", "Penulis Uji")
    .field("condition", "baik")
    .expect(201);
  const secondRequestId = secondRequest.body.request.id as string;

  const approved = await admin
    .post(`/api/swap-requests/${secondRequestId}/approve`)
    .expect(200);
  assert.equal(approved.body.request.status, "selesai");
  assert.equal(approved.body.createdBook.title, "Buku Uji Ditukar");
  assert.equal(approved.body.createdBook.status, "tersedia");

  const swappedBook = await api
    .get("/api/books/hening-yang-tumbuh")
    .expect(200);
  assert.equal(swappedBook.body.book.status, "sudah_ditukar");

  const offeredInCatalog = await api
    .get("/api/books")
    .query({ q: "Buku Uji Ditukar" })
    .expect(200);
  assert.equal(offeredInCatalog.body.total, 1);

  await admin
    .post(`/api/swap-requests/${secondRequestId}/approve`)
    .expect(409);

  console.log("8. Admin menolak permintaan dengan alasan");
  const toReject = await member
    .post("/api/swap-requests")
    .field("bookId", "kebun-kecil")
    .field("title", "Buku Ditolak")
    .field("author", "Penulis")
    .field("condition", "baik")
    .expect(201);
  const toRejectId = toReject.body.request.id as string;
  await admin
    .post(`/api/swap-requests/${toRejectId}/reject`)
    .send({ reason: "" })
    .expect(400);
  await admin
    .post(`/api/swap-requests/${toRejectId}/reject`)
    .send({ reason: "Kondisi buku tidak sesuai." })
    .expect(200);
  const rejectedBook = await api.get("/api/books/kebun-kecil").expect(200);
  assert.equal(rejectedBook.body.book.status, "tersedia");

  console.log("9. Kedaluwarsa otomatis setelah batas waktu");
  const toExpire = await member
    .post("/api/swap-requests")
    .field("bookId", "sejarah-yang-dekat")
    .field("title", "Buku Kedaluwarsa")
    .field("author", "Penulis")
    .field("condition", "baik")
    .expect(201);
  const toExpireId = toExpire.body.request.id as string;
  await SwapRequestModel.updateOne(
    { code: toExpireId },
    { $set: { expiresAt: new Date(Date.now() - 60_000) } }
  );
  const expiredCount = await expireOverdueRequests();
  assert.ok(expiredCount >= 1);
  const expiredBook = await api
    .get("/api/books/sejarah-yang-dekat")
    .expect(200);
  assert.equal(expiredBook.body.book.status, "tersedia");
  const expiredList = await member
    .get("/api/swap-requests/mine")
    .query({ status: "kedaluwarsa" })
    .expect(200);
  assert.ok(
    expiredList.body.items.some(
      (item: { id: string }) => item.id === toExpireId
    )
  );

  console.log("10. Menonaktifkan anggota membatalkan permintaan aktif");
  await member
    .post("/api/swap-requests")
    .field("bookId", "surat-untuk-esok")
    .field("title", "Buku Nonaktif")
    .field("author", "Penulis")
    .field("condition", "baik")
    .expect(201);
  const deactivate = await admin
    .patch("/api/users/uji.anggota")
    .send({ isActive: false })
    .expect(200);
  assert.ok((deactivate.body.cancelledRequests as number) >= 1);
  const freedAfterDeactivate = await api
    .get("/api/books/surat-untuk-esok")
    .expect(200);
  assert.equal(freedAfterDeactivate.body.book.status, "tersedia");
  await member.get("/api/auth/me").expect(403);

  console.log("11. Riwayat anggota & dashboard admin");
  const history = await api
    .post("/api/auth/login")
    .send({ username: "amelia.putri", password: "sementara123" })
    .expect(200);
  assert.equal(history.body.user.role, "anggota");
  const myHistory = await supertest(app)
    .get("/api/swap-requests/mine")
    .expect(401);

  const stats = await admin.get("/api/admin/stats").expect(200);
  assert.ok(stats.body.totalBooks >= 13);
  assert.ok(Array.isArray(stats.body.latestRequests));
  assert.equal(myHistory.status, 401);

  console.log("12. Logout menghapus sesi");
  await admin.post("/api/auth/logout").expect(200);
  await admin.get("/api/admin/stats").expect(401);

  await disconnectDatabase();
  console.log("\nSMOKE TEST LULUS: semua alur backend berjalan sesuai PRD.");
  process.exit(0);
}

main().catch((error) => {
  console.error("\nSMOKE TEST GAGAL:", error);
  process.exit(1);
});
