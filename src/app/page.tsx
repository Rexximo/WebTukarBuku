import Image from "next/image";
import Link from "next/link";
import { BrandIcon, BrandName } from "@/components/brand";
import {
  coverKickerFor,
  coverTitleLines,
  coverToneFor,
  type CoverTone,
} from "@/components/book-cover";
import { publicGet } from "@/lib/api-server";
import { bookStatusMeta } from "@/lib/status";
import type { Book, Paginated } from "@/lib/types";
import "./landing.css";

const landingTones: Record<CoverTone, { className: string; art: number }> = {
  coral: { className: "cover-senja", art: 3 },
  forest: { className: "cover-hutan", art: 2 },
  lilac: { className: "cover-langit", art: 1 },
  gold: { className: "cover-kuning", art: 3 },
  blue: { className: "cover-langit", art: 1 },
  plum: { className: "cover-senja", art: 3 },
  mint: { className: "cover-hutan", art: 2 },
  sand: { className: "cover-kuning", art: 3 },
};

const fallbackFeatured: Book[] = [
  "laut-bercerita",
  "hening-yang-tumbuh",
  "jeda-di-antara",
  "hari-hari-yang-baik",
].map((id, index) => ({
  id,
  title: ["Laut Bercerita", "Hening yang Tumbuh", "Jeda di Antara", "Hari-hari yang Baik"][index],
  author: ["Nadira Putri", "R. Aditya", "S. Kirana", "Alma Senja"][index],
  genre: ["Fiksi", "Pengembangan diri", "Puisi", "Fiksi"][index],
  condition: "baik" as const,
  description: "",
  publisher: "",
  year: null,
  coverUrl: "",
  status: "tersedia" as const,
  source: "admin" as const,
  createdAt: "",
  updatedAt: "",
}));

async function getFeaturedBooks(): Promise<Book[]> {
  try {
    const data = await publicGet<Paginated<Book>>(
      "/books?status=tersedia&limit=4"
    );
    return data.items.length > 0 ? data.items : fallbackFeatured;
  } catch {
    return fallbackFeatured;
  }
}

function CoverTitle({ lines }: { lines: string[] }) {
  return (
    <span className="cover-title">
      {lines.map((line, index) => (
        <span key={line}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </span>
  );
}

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();

  return (
    <div className="landing">
      <header className="site-header">
        <nav className="nav shell" aria-label="Navigasi utama">
          <a className="brand" href="#beranda" aria-label="FestivalTukarBuku, beranda">
            <BrandIcon className="brand-mark" />
            <span>
              <BrandName />
            </span>
          </a>

          <div className="nav-links">
            <a className="nav-link active" href="#beranda">
              Beranda
            </a>
            <Link className="nav-link" href="/tentang#profil">
              Tentang
            </Link>
            <Link className="nav-link" href="/keanggotaan">
              Keanggotaan
            </Link>
          </div>

          <Link className="button button-small button-outline" href="/masuk">
            Masuk <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero shell" id="beranda" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot"></span> Baca lebih banyak,
              bersama-sama
            </p>
            <h1 id="hero-title">
              Tukar bukumu,
              <br />
              temukan <span>cerita baru.</span>
            </h1>
            <p className="hero-description">
              Punya buku yang sudah selesai dibaca? Biarkan ceritanya berlanjut
              di tangan pembaca berikutnya. Tukar buku favoritmu, tanpa biaya.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#katalog">
                Jelajahi Katalog <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href="#cara-kerja">
                Kenali cara kerjanya <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="note-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 3.5 19 6v5.3c0 4.1-2.8 7.2-7 9.2-4.2-2-7-5.1-7-9.2V6l7-2.5Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="m9 12 2 2 4-4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>
                <strong>Tanpa biaya, tanpa ribet.</strong>
                <br />
                Penukaran dilakukan langsung melalui admin.
              </span>
            </div>
          </div>

          <div className="hero-art" aria-label="Ilustrasi beberapa buku pilihan">
            <div className="art-orbit orbit-one"></div>
            <div className="art-orbit orbit-two"></div>
            <div className="art-spark spark-one" aria-hidden="true">
              ✳
            </div>
            <div className="art-spark spark-two" aria-hidden="true">
              ✳
            </div>
            <div className="art-caption caption-top">
              <span className="caption-icon">✦</span> Cerita selalu menemukan
              jalan
            </div>
            <div
              className="hero-book hero-book-back book-cover cover-senja"
              aria-hidden="true"
            >
              <span className="cover-kicker">SEBUAH NOVEL</span>
              <CoverTitle lines={["Laut", "bercerita"]} />
              <span className="cover-art">
                <i></i>
                <i></i>
                <i></i>
              </span>
              <span className="cover-author">NADIRA PUTRI</span>
            </div>
            <div
              className="hero-book hero-book-front book-cover cover-hutan"
              aria-hidden="true"
            >
              <span className="cover-kicker">KUMPULAN ESAI</span>
              <CoverTitle lines={["Hening", "yang tumbuh"]} />
              <span className="cover-art">
                <i></i>
                <i></i>
              </span>
              <span className="cover-author">R. ADITYA</span>
            </div>
            <div
              className="hero-book hero-book-small book-cover cover-langit"
              aria-hidden="true"
            >
              <span className="cover-kicker">PUISI</span>
              <CoverTitle lines={["Jeda", "di antara"]} />
              <span className="cover-art">
                <i></i>
              </span>
              <span className="cover-author">S. KIRANA</span>
            </div>
            <div className="art-sticker">
              <span>100%</span>
              <small>
                berbagi
                <br />
                cerita
              </small>
            </div>
            <div className="art-caption caption-bottom">
              <span className="caption-check">✓</span> Buku baik, cerita baru
            </div>
          </div>
          <div className="hero-bottomline">
            <span>RUANG KECIL UNTUK CERITA BESAR</span>
            <span>01 — 04</span>
          </div>
        </section>

        <section
          className="how-section"
          id="cara-kerja"
          aria-labelledby="how-title"
        >
          <div className="shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Mudah dimulai, menyenangkan dijalani</p>
                <h2 id="how-title">
                  Satu buku darimu,
                  <br />
                  <span>banyak cerita baru.</span>
                </h2>
              </div>
              <p className="section-intro">
                Tak perlu transaksi atau proses yang rumit. Cukup temukan buku
                yang kamu suka, lalu tukarkan dengan buku yang sudah kamu baca.
              </p>
            </div>

            <div className="steps-grid">
              <article className="step-card">
                <div className="step-top">
                  <span className="step-number">01</span>
                  <span
                    className="step-icon icon-search"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 32 32" fill="none">
                      <circle
                        cx="14"
                        cy="14"
                        r="8"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="m20 20 6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.5 14h7M14 10.5v7"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
                <h3>Temukan buku</h3>
                <p>
                  Jelajahi katalog dan temukan bacaan yang membuatmu penasaran.
                </p>
                <span className="step-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
              <article className="step-card">
                <div className="step-top">
                  <span className="step-number">02</span>
                  <span className="step-icon icon-swap" aria-hidden="true">
                    <svg viewBox="0 0 32 32" fill="none">
                      <path
                        d="M7 11h17l-4-4M25 21H8l4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M24 11a8 8 0 0 1 1 10M8 21a8 8 0 0 1-1-10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>
                <h3>Ajukan penukaran</h3>
                <p>
                  Pilih buku yang ingin kamu tukar dan ceritakan buku yang akan
                  dibawa.
                </p>
                <span className="step-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
              <article className="step-card">
                <div className="step-top">
                  <span className="step-number">03</span>
                  <span className="step-icon icon-story" aria-hidden="true">
                    <svg viewBox="0 0 32 32" fill="none">
                      <path
                        d="M6 9c4-.8 7.4.2 10 2.5V25c-2.6-2.3-6-3.3-10-2.5V9ZM26 9c-4-.8-7.4.2-10 2.5V25c2.6-2.3 6-3.3 10-2.5V9Z"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 11.5V25"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  </span>
                </div>
                <h3>Bertemu &amp; bertukar</h3>
                <p>
                  Datang ke admin membawa bukumu. Pulang dengan cerita yang
                  baru.
                </p>
                <span className="step-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            </div>
          </div>
        </section>

        <section
          className="catalog-section shell"
          id="katalog"
          aria-labelledby="catalog-title"
        >
          <div className="catalog-heading">
            <div>
              <p className="eyebrow">Pilihan untuk memulai</p>
              <h2 id="catalog-title">
                Mungkin ini <span>buku berikutnya.</span>
              </h2>
            </div>
            <Link className="text-link catalog-link" href="/katalog">
              Lihat katalog lengkap <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="book-grid">
            {featuredBooks.map((book) => {
              const status = bookStatusMeta[book.status];
              const tone = landingTones[coverToneFor(book.id)];
              return (
                <article className="book-card" key={book.id}>
                  <Link
                    className={`book-cover ${tone.className} card-cover`}
                    href={`/katalog/${book.id}`}
                    aria-label={`Lihat detail ${book.title}`}
                  >
                    {book.coverUrl ? (
                      <Image
                        className="book-cover-img"
                        src={book.coverUrl}
                        alt={`Sampul buku ${book.title}`}
                        fill
                        sizes="(max-width: 767px) 45vw, 280px"
                      />
                    ) : (
                      <>
                        <span className="cover-kicker">
                          {coverKickerFor(book)}
                        </span>
                        <CoverTitle lines={coverTitleLines(book.title)} />
                        <span className="cover-art">
                          {Array.from({ length: tone.art }, (_, index) => (
                            <i key={index}></i>
                          ))}
                        </span>
                        <span className="cover-author">
                          {book.author.toUpperCase()}
                        </span>
                      </>
                    )}
                  </Link>
                  <div className="book-info">
                    <div className="book-meta">
                      <span>{book.genre}</span>
                      {book.status === "tersedia" ? (
                        <span className="availability">
                          <i></i>Tersedia
                        </span>
                      ) : (
                        <span>{status.label}</span>
                      )}
                    </div>
                    <h3>{book.title}</h3>
                    <p>{book.author}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="catalog-footnote">
            <span aria-hidden="true">✳</span> Setiap buku punya satu salinan
            fisik. Ketersediaan dapat berubah.
          </p>
        </section>

        <section className="join-section shell" aria-labelledby="join-title">
          <div className="join-panel">
            <div className="join-decoration" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <b>↗</b>
            </div>
            <div className="join-copy">
              <p className="eyebrow eyebrow-light">
                Cerita berikutnya bisa dimulai darimu
              </p>
              <h2 id="join-title">
                Punya buku untuk
                <br />
                dibagikan?
              </h2>
              <p>
                Keanggotaan dimulai dengan percakapan sederhana. Datang langsung
                ke admin untuk mendaftar dan mulai bertukar cerita.
              </p>
              <Link className="button button-white" href="/keanggotaan">
                Daftar sebagai anggota <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="join-side-note">
              <span className="join-line"></span>
              <span>
                BUKAN JUAL-BELI.
                <br />
                INI SOAL BERBAGI.
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-main">
          <div className="footer-brand-block">
            <a className="brand footer-brand" href="#beranda">
              <BrandIcon className="brand-mark" />
              <span>
                <BrandName />
              </span>
            </a>
            <p>
              Lebih sedikit buku yang berdebu.
              <br />
              Lebih banyak cerita yang hidup.
            </p>
          </div>
          <div className="footer-links">
            <span className="footer-label">JELAJAHI</span>
            <a href="#cara-kerja">Cara Kerja</a>
            <a href="#katalog">Katalog Buku</a>
            <Link href="/tentang">Tentang Komunitas</Link>
            <Link href="/tentang#galeri">Galeri Kegiatan</Link>
            <Link href="/keanggotaan">Keanggotaan</Link>
            <Link href="/masuk">Masuk Anggota</Link>
          </div>
          <div className="footer-note">
            <span className="footer-label">TENTANG PENUKARAN</span>
            <p>
              Semua penukaran dilakukan secara langsung melalui admin. Tidak ada
              biaya, jual-beli, ataupun pengiriman.
            </p>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>FestivalTukarBuku. Saling berbagi, saling membaca.</span>
          <a href="#beranda">Kembali ke atas ↑</a>
        </div>
      </footer>
    </div>
  );
}
