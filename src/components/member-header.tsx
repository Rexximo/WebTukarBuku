"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppBrand } from "@/components/brand";
import { LogoutButton } from "@/components/logout-button";
import { initials } from "@/lib/format";
import type { User } from "@/lib/types";

const links = [
  { href: "/katalog", label: "Katalog Buku", short: "Katalog" },
  { href: "/permintaan", label: "Permintaan Saya", short: "Permintaan Saya" },
  { href: "/riwayat", label: "Riwayat Penukaran", short: "Riwayat" },
];

export function MemberHeader({ user }: { user: Pick<User, "name"> }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="member-header">
      <nav className="member-nav" aria-label="Navigasi anggota">
        <AppBrand href="/" />
        <div className="member-links">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? "active" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="member-tools">
          <Link className="member-user" href="/profil">
            <span className="avatar">{initials(user.name)}</span>
            <span>{user.name}</span>
          </Link>
          <LogoutButton />
        </div>
      </nav>
      <div className="mobile-nav">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={isActive(link.href) ? "active" : undefined}
          >
            {link.short}
          </Link>
        ))}
        <Link
          href="/profil"
          className={isActive("/profil") ? "active" : undefined}
        >
          Profil
        </Link>
      </div>
    </header>
  );
}
