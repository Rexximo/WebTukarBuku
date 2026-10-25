import { connectDatabase, disconnectDatabase } from "../db/connect.js";
import { seedDatabase } from "./seed-data.js";

async function main(): Promise<void> {
  await connectDatabase();
  const result = await seedDatabase();
  console.log(
    `[seed] Selesai: ${result.users} pengguna, ${result.books} buku, ${result.requests} permintaan.`
  );
  console.log("[seed] Akun admin   : admin / admin12345");
  console.log("[seed] Akun anggota : amelia.putri / sementara123");
  await disconnectDatabase();
  process.exit(0);
}

main().catch((error) => {
  console.error("[seed] Gagal melakukan seed:", error);
  process.exit(1);
});
