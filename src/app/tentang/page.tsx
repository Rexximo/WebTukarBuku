import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { publicGet } from "@/lib/api-server";
import type { GalleryPhotoListResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Tentang Komunitas",
  description:
    "Kenali komunitas FestivalTukarBuku, visi misi, kegiatan, dan galeri dokumentasi.",
};

const missions = [
  {
    number: "01",
    title: "Mempertemukan buku dan pembaca",
    description:
      "Membuka akses ke bacaan yang beragam melalui pertukaran koleksi antaranggota.",
  },
  {
    number: "02",
    title: "Menumbuhkan kebiasaan berbagi",
    description:
      "Mengajak anggota merawat buku dan meneruskan manfaatnya kepada pembaca lain.",
  },
  {
    number: "03",
    title: "Membangun ruang yang ramah",
    description:
      "Mendorong interaksi yang saling menghargai dan berangkat dari kecintaan pada membaca.",
  },
];

const activities = [
  {
    number: "01",
    symbol: "↔",
    title: "Tukar buku",
    text: "Anggota menawarkan buku yang telah selesai dibaca untuk menemukan bacaan baru melalui proses yang dikelola admin.",
    tag: "BERBAGI KOLEKSI",
  },
  {
    number: "02",
    symbol: "✳",
    title: "Berbagi rekomendasi",
    text: "Cerita tentang buku favorit membantu anggota lain menemukan bacaan yang mungkin belum pernah mereka temui.",
    tag: "BERBAGI CERITA",
  },
  {
    number: "03",
    symbol: "◎",
    title: "Temu pembaca",
    text: "Ruang untuk saling mengenal, bertukar kesan setelah membaca, dan menjaga komunitas tetap dekat.",
    tag: "BERBAGI WAKTU",
  },
];

async function getGalleryPhotos() {
  try {
    const data = await publicGet<GalleryPhotoListResponse>("/gallery", 30);
    return data.items;
  } catch {
    return null;
  }
}

function formatEventDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default async function TentangPage() {
  const photos = await getGalleryPhotos();

  return (
    <main className="about-main">
      <section className="hero about-hero shell" id="profil">
        <div className="hero-copy about-hero-copy">
          <p className="eyebrow">TENTANG KOMUNITAS</p>
          <h1>
            Satu buku berpindah,
            <br />
            <span>banyak cerita bertumbuh.</span>
          </h1>
          <p className="hero-description about-lead">
            FestivalTukarBuku adalah ruang bagi para pembaca untuk berbagi koleksi,
            menemukan bacaan baru, dan saling terhubung melalui cerita.
          </p>
          <Link className="button button-primary" href="#visi-misi">
            Kenali semangat kami <span aria-hidden="true">↓</span>
          </Link>
        </div>
        <div className="about-hero-photo">
          <Image
            src="/images/tentang-hero.jpg"
            alt="Tumpukan buku yang siap menemukan pembaca berikutnya"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 48vw"
          />
          <div className="about-hero-photo-caption">
            <span aria-hidden="true">✳</span>
            <span>BACA · BERBAGI · BERTUMBUH</span>
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="shell about-story-grid">
          <div>
            <p className="eyebrow">CERITA KAMI</p>
            <h2>
              Buku terasa lebih berarti
              <br />
              saat <span>dibaca bersama.</span>
            </h2>
          </div>
          <div className="about-story-copy">
            <p>
              Banyak buku selesai dibaca lalu tersimpan di rak. Di sisi lain,
              selalu ada pembaca yang sedang mencari cerita berikutnya. Tukar
              Buku hadir untuk mempertemukan keduanya.
            </p>
            <p>
              Melalui proses penukaran yang dikelola bersama admin, anggota
              dapat menawarkan buku yang sudah dibaca dan menemukan koleksi
              baru tanpa jual-beli.
            </p>
          </div>
        </div>
      </section>

      <section className="catalog-section about-values-section shell">
        <div className="section-heading about-section-heading">
          <div>
            <p className="eyebrow">YANG KAMI JAGA</p>
            <h2>
              Semangat di balik setiap <span>pertukaran.</span>
            </h2>
          </div>
        </div>
        <div className="about-value-grid">
          <article className="step-card about-value-card">
            <span className="about-value-number">01</span>
            <h3>Berbagi, bukan berjual-beli</h3>
            <p>
              Buku menjadi jembatan untuk saling memberi kesempatan membaca
              cerita baru.
            </p>
          </article>
          <article className="step-card about-value-card">
            <span className="about-value-number">02</span>
            <h3>Terbuka untuk pembaca</h3>
            <p>
              Setiap anggota membawa selera dan cerita yang berbeda ke dalam
              komunitas.
            </p>
          </article>
          <article className="step-card about-value-card">
            <span className="about-value-number">03</span>
            <h3>Merawat buku dan cerita</h3>
            <p>
              Satu buku dapat terus hidup melalui tangan pembaca yang
              bergantian.
            </p>
          </article>
        </div>
      </section>

      <section className="how-section about-principles-section" id="visi-misi">
        <div className="shell">
          <div className="section-heading about-section-heading">
            <div>
              <p className="eyebrow">VISI & MISI</p>
              <h2>
                Membaca lebih luas, <span>berbagi lebih dekat.</span>
              </h2>
            </div>
          </div>
          <div className="about-vision-card">
            <div className="about-vision-mark" aria-hidden="true">
              ↗
            </div>
            <div>
              <p className="eyebrow">VISI</p>
              <h3>Menjadi ruang berbagi yang membuat cerita terus bergerak.</h3>
              <p>
                Kami ingin buku tidak berhenti di satu rak atau satu pembaca,
                melainkan terus menemukan orang-orang yang membutuhkannya.
              </p>
            </div>
          </div>
          <div className="about-mission-list">
            {missions.map((mission) => (
              <article className="about-mission-item" key={mission.number}>
                <span>{mission.number}</span>
                <div>
                  <h3>{mission.title}</h3>
                  <p>{mission.description}</p>
                </div>
                <span className="about-mission-arrow" aria-hidden="true">
                  ↗
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="how-section about-activity-section" id="kegiatan">
        <div className="shell">
          <div className="section-heading about-section-heading">
            <div>
              <p className="eyebrow">RUANG UNTUK TERHUBUNG</p>
              <h2>
                Kegiatan yang dimulai dari <span>sebuah cerita.</span>
              </h2>
            </div>
            <p className="section-intro about-section-intro">
              Kegiatan FestivalTukarBuku berpusat pada buku, pembacanya, dan
              kesempatan untuk berbagi. Setiap pertemuan dapat tumbuh
              mengikuti kebutuhan komunitas.
            </p>
          </div>
          <div className="about-activity-grid">
            {activities.map((activity) => (
              <article className="step-card about-activity-card" key={activity.number}>
                <div className="about-activity-top">
                  <span>{activity.number}</span>
                  <span className="about-activity-symbol" aria-hidden="true">
                    {activity.symbol}
                  </span>
                </div>
                <p className="about-activity-tag">{activity.tag}</p>
                <h3>{activity.title}</h3>
                <p>{activity.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="catalog-section about-gallery-section shell" id="galeri">
        <div className="section-heading about-section-heading about-gallery-heading">
          <div>
            <p className="eyebrow">CATATAN KEBERSAMAAN</p>
            <h2>
              Galeri kegiatan <span>FestivalTukarBuku.</span>
            </h2>
          </div>
          <p className="section-intro about-section-intro">
            Kumpulan foto kegiatan dan momen yang dibagikan oleh komunitas.
          </p>
        </div>
        {photos === null ? (
          <div className="about-gallery-empty">
            <span aria-hidden="true">▧</span>
            <h3>Galeri belum dapat dimuat.</h3>
            <p>Silakan coba lagi beberapa saat.</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="about-gallery-empty">
            <span aria-hidden="true">▧</span>
            <h3>Foto kegiatan segera hadir.</h3>
            <p>
              Dokumentasi kegiatan akan tampil di sini setelah diunggah oleh
              admin komunitas.
            </p>
            <Link className="button button-secondary" href="/masuk">
              Masuk sebagai admin <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <div className="about-gallery-grid">
            {photos.map((photo) => (
              <article className="about-gallery-card" key={photo.id}>
                <div className="about-gallery-image">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    width={900}
                    height={650}
                    unoptimized
                  />
                </div>
                <div className="about-gallery-caption">
                  <div>
                    <time dateTime={photo.eventDate}>
                      {formatEventDate(photo.eventDate)}
                    </time>
                    <h3>{photo.title}</h3>
                  </div>
                  <span aria-hidden="true">↗</span>
                  {photo.caption ? <p>{photo.caption}</p> : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
