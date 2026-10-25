"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBrand } from "@/components/brand";

const links = [
  { href: "/admin", label: "Dashboard", glyph: "▦" },
  { href: "/admin/buku", label: "Kelola Buku", glyph: "▤" },
  { href: "/admin/anggota", label: "Kelola Anggota", glyph: "♙" },
  { href: "/admin/permintaan", label: "Permintaan Penukaran", glyph: "↔" },
  { href: "/admin/galeri", label: "Kelola Galeri", glyph: "▧" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-brand">
        <AppBrand href="/admin" />
        <span className="sidebar-mobile-title">ADMINISTRATOR</span>
      </div>
      <p className="sidebar-label">MENU UTAMA</p>
      <nav className="sidebar-nav" aria-label="Navigasi admin">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "active" : undefined}
          >
            <span className="nav-glyph" aria-hidden="true">
              {link.glyph}
            </span>
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="admin-profile">
          <span className="avatar">AD</span>
          <span>
            <strong>Admin FestivalTukarBuku</strong>
            <small>Administrator</small>
          </span>
        </div>
      </div>
    </aside>
  );
}
