import bcrypt from "bcryptjs";
import { BookModel } from "../models/book.model.js";
import { SwapRequestModel } from "../models/swap-request.model.js";
import { UserModel } from "../models/user.model.js";

const BOOKS = [
  {
    slug: "laut-bercerita",
    title: "Laut Bercerita",
    author: "Nadira Putri",
    genre: "Fiksi",
    condition: "baik",
    description:
      "Sebuah kisah tentang persahabatan, keberanian, dan ingatan yang terus hidup. Ikuti perjalanan para tokoh menemukan harapan di tengah masa yang sulit.",
    publisher: "Pustaka Samudra",
    year: 2021,
    status: "dipesan",
    source: "admin",
    createdAt: "2025-05-12",
  },
  {
    slug: "hening-yang-tumbuh",
    title: "Hening yang Tumbuh",
    author: "R. Aditya",
    genre: "Pengembangan diri",
    condition: "seperti_baru",
    description:
      "Kumpulan esai reflektif tentang menemukan ketenangan di tengah hidup yang bergerak cepat, ditulis dengan bahasa yang hangat dan menenangkan.",
    publisher: "Ruang Hening",
    year: 2022,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-05-10",
  },
  {
    slug: "jeda-di-antara",
    title: "Jeda di Antara",
    author: "S. Kirana",
    genre: "Puisi",
    condition: "baik",
    description:
      "Kumpulan puisi tentang jeda kecil dalam hidup: menunggu hujan, perjalanan pulang, dan percakapan yang tak sempat selesai.",
    publisher: "Bulan Purnama",
    year: 2020,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-05-08",
  },
  {
    slug: "hari-hari-yang-baik",
    title: "Hari-hari yang Baik",
    author: "Alma Senja",
    genre: "Fiksi",
    condition: "baik",
    description:
      "Novel kehidupan tentang keluarga kecil yang belajar mensyukuri hal-hal sederhana, dari makan malam bersama hingga perjalanan pagi ke sekolah.",
    publisher: "Langit Cerah",
    year: 2019,
    status: "sudah_ditukar",
    source: "admin",
    createdAt: "2025-05-02",
  },
  {
    slug: "atlas-langit",
    title: "Atlas Langit",
    author: "Bima Satria",
    genre: "Perjalanan",
    condition: "layak_baca",
    description:
      "Catatan perjalanan menelusuri kota-kota kecil Indonesia, lengkap dengan sketsa langit dan cerita orang-orang yang ditemui di jalan.",
    publisher: "Jejak Rimba",
    year: 2018,
    status: "dipesan",
    source: "admin",
    createdAt: "2025-04-21",
  },
  {
    slug: "kota-dalam-ingatan",
    title: "Kota dalam Ingatan",
    author: "Rara Mahes",
    genre: "Fiksi",
    condition: "baik",
    description:
      "Seorang arsitek kembali ke kota masa kecilnya dan menemukan bahwa ingatan tidak pernah berbohong tentang rumah yang pernah kita tinggali.",
    publisher: "Peta Kata",
    year: 2023,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-04-14",
  },
  {
    slug: "tumbuh-perlahan",
    title: "Tumbuh Perlahan",
    author: "Nala Widjaja",
    genre: "Pengembangan diri",
    condition: "seperti_baru",
    description:
      "Panduan lembut untuk belajar sabar terhadap proses diri sendiri, dengan latihan kecil yang bisa dilakukan setiap hari.",
    publisher: "Akar Kata",
    year: 2024,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-04-02",
  },
  {
    slug: "rumah-untuk-pulang",
    title: "Rumah untuk Pulang",
    author: "D. Pramudya",
    genre: "Fiksi",
    condition: "baik",
    description:
      "Novel tentang perantau yang pulang kampung dan menyadari bahwa rumah bukan sekadar bangunan, melainkan orang-orang di dalamnya.",
    publisher: "Samudra Biru",
    year: 2017,
    status: "sudah_ditukar",
    source: "swap",
    createdAt: "2025-03-18",
  },
  {
    slug: "kebun-kecil",
    title: "Kebun Kecil",
    author: "Sinta Laras",
    genre: "Esai",
    condition: "baik",
    description:
      "Esai-esai tentang merawat kebun kecil di halaman rumah, dan pelajaran kesabaran yang tumbuh bersama tanaman.",
    publisher: "Daun Hijau",
    year: 2021,
    status: "tersedia",
    source: "swap",
    createdAt: "2025-03-07",
  },
  {
    slug: "sejarah-yang-dekat",
    title: "Sejarah yang Dekat",
    author: "Arif Nugraha",
    genre: "Sejarah",
    condition: "layak_baca",
    description:
      "Kisah sejarah Indonesia yang dituturkan lewat kisah keluarga biasa, membuat peristiwa besar terasa dekat dan nyata.",
    publisher: "Cakrawala",
    year: 2016,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-02-25",
  },
  {
    slug: "pagi-di-ujung-jalan",
    title: "Pagi di Ujung Jalan",
    author: "Maya Pertiwi",
    genre: "Fiksi",
    condition: "baik",
    description:
      "Cerita tentang pedagang sarapan pagi yang menjadi saksi bisu ribuan kisah warga kota, dari perpisahan hingga pertemuan pertama.",
    publisher: "Fajar Pustaka",
    year: 2022,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-02-11",
  },
  {
    slug: "surat-untuk-esok",
    title: "Surat untuk Esok",
    author: "K. Anindya",
    genre: "Fiksi",
    condition: "seperti_baru",
    description:
      "Kumpulan cerita pendek tentang surat-surat yang tak pernah dikirim, dan harapan yang tetap dijaga sampai esok datang.",
    publisher: "Kertas Putih",
    year: 2023,
    status: "tersedia",
    source: "admin",
    createdAt: "2025-01-28",
  },
] as const;

const MEMBERS = [
  {
    name: "Amelia Putri",
    username: "amelia.putri",
    phone: "0812 3456 7890",
    address: "Jl. Melati No. 18, Bandung",
    isActive: true,
    createdAt: "2025-01-12",
  },
  {
    name: "Rizky Pratama",
    username: "rizky.pratama",
    phone: "0813 7654 3210",
    address: "Jl. Kenanga No. 4, Cimahi",
    isActive: true,
    createdAt: "2025-02-04",
  },
  {
    name: "Nadia Safitri",
    username: "nadia.safitri",
    phone: "0821 1122 3344",
    address: "Jl. Anggrek No. 27, Bandung",
    isActive: false,
    createdAt: "2025-02-18",
  },
  {
    name: "Bagas Wicaksono",
    username: "bagas.w",
    phone: "0857 9988 7766",
    address: "Jl. Cendana No. 9, Sumedang",
    isActive: true,
    createdAt: "2025-03-03",
  },
  {
    name: "Dina Maharani",
    username: "dina.maharani",
    phone: "0819 2233 4455",
    address: "Jl. Dahlia No. 2, Bandung",
    isActive: true,
    createdAt: "2025-03-19",
  },
  {
    name: "Yoga Prasetya",
    username: "yoga.prasetya",
    phone: "0812 8877 6655",
    address: "Jl. Flamboyan No. 11, Bogor",
    isActive: true,
    createdAt: "2025-04-01",
  },
] as const;

const REQUESTS = [
  {
    code: "TB-0248",
    member: "amelia.putri",
    book: "laut-bercerita",
    offered: {
      title: "Negeri 5 Menara",
      author: "Ahmad Fuadi",
      condition: "baik",
      notes: "Sampul sedikit aus di bagian sudut, halaman lengkap.",
    },
    status: "menunggu",
    createdAt: "2026-10-04",
    expiresAt: "2026-10-07",
  },
  {
    code: "TB-0247",
    member: "rizky.pratama",
    book: "atlas-langit",
    offered: {
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      condition: "seperti_baru",
      notes: "Buku masih sangat rapi, tidak ada coretan.",
    },
    status: "menunggu",
    createdAt: "2026-10-04",
    expiresAt: "2026-10-07",
  },
  {
    code: "TB-0246",
    member: "nadia.safitri",
    book: "kebun-kecil",
    offered: {
      title: "Pulang",
      author: "Leila S. Chudori",
      condition: "baik",
      notes: "",
    },
    status: "selesai",
    createdAt: "2025-05-11",
    completedAt: "2025-05-11",
  },
  {
    code: "TB-0243",
    member: "dina.maharani",
    book: "kota-dalam-ingatan",
    offered: {
      title: "Buku Rusak",
      author: "Kondisi tidak sesuai",
      condition: "layak_baca",
      notes: "",
    },
    status: "ditolak",
    rejectReason: "Kondisi buku tidak sesuai dengan yang ditawarkan.",
    createdAt: "2025-05-08",
  },
  {
    code: "TB-0239",
    member: "yoga.prasetya",
    book: "pagi-di-ujung-jalan",
    offered: {
      title: "Sebuah Seni untuk Bersikap Bodo Amat",
      author: "Mark Manson",
      condition: "baik",
      notes: "",
    },
    status: "kedaluwarsa",
    createdAt: "2025-05-03",
    expiresAt: "2025-05-06",
  },
  {
    code: "TB-0237",
    member: "bagas.w",
    book: "hening-yang-tumbuh",
    offered: {
      title: "Laskar Pelangi",
      author: "Andrea Hirata",
      condition: "baik",
      notes: "",
    },
    status: "dibatalkan",
    createdAt: "2025-04-28",
  },
  {
    code: "TB-0231",
    member: "amelia.putri",
    book: "jeda-di-antara",
    offered: {
      title: "Hujan Bulan Juni",
      author: "Sapardi Djoko Damono",
      condition: "baik",
      notes: "",
    },
    status: "selesai",
    createdAt: "2025-05-01",
    completedAt: "2025-05-04",
  },
  {
    code: "TB-0225",
    member: "amelia.putri",
    book: "rumah-untuk-pulang",
    offered: {
      title: "Pulang",
      author: "Leila S. Chudori",
      condition: "baik",
      notes: "",
    },
    status: "selesai",
    createdAt: "2025-04-15",
    completedAt: "2025-04-18",
  },
  {
    code: "TB-0212",
    member: "amelia.putri",
    book: "atlas-langit",
    offered: {
      title: "Filosofi Teras",
      author: "Henry Manampiring",
      condition: "baik",
      notes: "",
    },
    status: "selesai",
    createdAt: "2025-02-28",
    completedAt: "2025-03-02",
  },
] as const;

export interface SeedResult {
  users: number;
  books: number;
  requests: number;
}

export async function seedDatabase(): Promise<SeedResult> {
  await Promise.all([
    UserModel.deleteMany({}),
    BookModel.deleteMany({}),
    SwapRequestModel.deleteMany({}),
  ]);

  const [adminPasswordHash, memberPasswordHash] = await Promise.all([
    bcrypt.hash("admin12345", 10),
    bcrypt.hash("sementara123", 10),
  ]);

  await UserModel.create({
    name: "Admin FestivalTukarBuku",
    username: "admin",
    phone: "0812 0000 0000",
    address: "",
    role: "admin",
    isActive: true,
    mustChangePassword: false,
    passwordHash: adminPasswordHash,
  });

  const members = await UserModel.create(
    MEMBERS.map((member) => ({
      name: member.name,
      username: member.username,
      phone: member.phone,
      address: member.address,
      role: "anggota" as const,
      isActive: member.isActive,
      mustChangePassword: false,
      passwordHash: memberPasswordHash,
      createdAt: new Date(member.createdAt),
      updatedAt: new Date(member.createdAt),
    }))
  );

  const books = await BookModel.create(
    BOOKS.map((book) => ({
      slug: book.slug,
      title: book.title,
      author: book.author,
      genre: book.genre,
      condition: book.condition,
      description: book.description,
      publisher: book.publisher,
      year: book.year,
      coverUrl: "",
      status: book.status,
      source: book.source,
      createdAt: new Date(book.createdAt),
      updatedAt: new Date(book.createdAt),
    }))
  );

  const memberByUsername = new Map(members.map((member) => [member.username, member]));
  const bookBySlug = new Map(books.map((book) => [book.slug, book]));

  const requests = await SwapRequestModel.create(
    REQUESTS.map((request) => ({
      code: request.code,
      member: memberByUsername.get(request.member)?._id,
      requestedBook: bookBySlug.get(request.book)?._id,
      offeredBook: request.offered,
      status: request.status,
      rejectReason: "rejectReason" in request ? request.rejectReason : "",
      expiresAt: "expiresAt" in request ? new Date(request.expiresAt) : undefined,
      completedAt:
        "completedAt" in request ? new Date(request.completedAt) : undefined,
      createdAt: new Date(request.createdAt),
      updatedAt: new Date(request.createdAt),
    }))
  );

  return { users: members.length + 1, books: books.length, requests: requests.length };
}
