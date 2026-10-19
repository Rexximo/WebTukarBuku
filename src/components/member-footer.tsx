"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandIcon } from "@/components/brand";

export function MemberFooter() {
  const pathname = usePathname();

  let backHref = "/katalog";
  let backLabel = "Kembali ke katalog";

  if (pathname.startsWith("/profil")) {
    backHref = "/profil";
    backLabel = "Kembali ke profil";
  } else if (pathname.startsWith("/permintaan")) {
    backHref = "/permintaan";
    backLabel = "Kembali ke permintaan";
  }

  return (
    <footer className="member-footer">
      <span className="member-footer-brand">
        <BrandIcon className="member-footer-logo" />
        <span>FestivalTukarBuku · Saling berbagi, saling membaca.</span>
      </span>
      <Link href={backHref}>{backLabel}</Link>
    </footer>
  );
}
