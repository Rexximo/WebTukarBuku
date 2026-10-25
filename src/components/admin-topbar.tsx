import { Fragment } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export interface Crumb {
  label: string;
  href?: string;
}

export function AdminTopbar({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <header className="admin-topbar">
      <div className="breadcrumbs">
        {crumbs.map((crumb, index) => (
          <Fragment key={crumb.label}>
            {index > 0 ? <span>/</span> : null}
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <strong>{crumb.label}</strong>
            )}
          </Fragment>
        ))}
      </div>
      <div className="topbar-right">
        <Link className="member-user" href="/admin/anggota">
          <span className="avatar">AD</span>
          <span>Admin FestivalTukarBuku</span>
        </Link>
        <LogoutButton />
      </div>
    </header>
  );
}
