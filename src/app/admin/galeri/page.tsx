import type { Metadata } from "next";
import { Alert } from "@/components/alert";
import { AdminTopbar } from "@/components/admin-topbar";
import { GalleryManager } from "@/components/gallery-manager";
import { PageHeading } from "@/components/page-heading";
import { serverGet } from "@/lib/api-server";
import type { GalleryPhotoListResponse } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kelola Galeri",
};

export default async function AdminGaleriPage() {
  let photos: GalleryPhotoListResponse["items"] = [];
  let failed = false;

  try {
    const data = await serverGet<GalleryPhotoListResponse>("/gallery");
    photos = data.items;
  } catch {
    failed = true;
  }

  return (
    <>
      <AdminTopbar
        crumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Kelola Galeri" },
        ]}
      />
      <main className="admin-main">
        <PageHeading
          eyebrow="Dokumentasi komunitas"
          title="Kelola Galeri"
          subtitle="Simpan dan kelola foto kegiatan FestivalTukarBuku untuk ditampilkan kepada pengunjung."
        />
        {failed ? (
          <Alert variant="danger" className="section-gap-sm">
            Gagal memuat galeri. Pastikan server API dan database berjalan, lalu
            muat ulang halaman ini.
          </Alert>
        ) : null}
        <GalleryManager initialPhotos={photos} />
      </main>
    </>
  );
}
