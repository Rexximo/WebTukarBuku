import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  total,
  label,
  firstItem,
  lastItem,
  makeHref,
}: {
  page: number;
  totalPages: number;
  total: number;
  label: string;
  firstItem: number;
  lastItem: number;
  makeHref: (page: number) => string;
}) {
  const windowStart = Math.max(1, Math.min(page - 2, totalPages - 4));
  const windowEnd = Math.min(totalPages, windowStart + 4);
  const pages: number[] = [];
  for (let current = windowStart; current <= windowEnd; current += 1) {
    pages.push(current);
  }

  return (
    <nav className="pagination" aria-label={`Halaman ${label}`}>
      <span>
        Menampilkan {firstItem}–{lastItem} dari {total} {label}
      </span>
      <span className="pagination-links">
        {page > 1 ? (
          <Link href={makeHref(page - 1)} aria-label="Halaman sebelumnya">
            ‹
          </Link>
        ) : (
          <span aria-hidden="true">‹</span>
        )}
        {pages.map((current) =>
          current === page ? (
            <Link key={current} href={makeHref(current)} aria-current="page">
              {current}
            </Link>
          ) : (
            <Link key={current} href={makeHref(current)}>
              {current}
            </Link>
          )
        )}
        {page < totalPages ? (
          <Link href={makeHref(page + 1)} aria-label="Halaman berikutnya">
            ›
          </Link>
        ) : (
          <span aria-hidden="true">›</span>
        )}
      </span>
    </nav>
  );
}
