import Link from "next/link";
import { Badge } from "@/components/badge";
import { CoverArt, coverClassName } from "@/components/book-cover";
import { bookStatusMeta, conditionLabel } from "@/lib/status";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  const status = bookStatusMeta[book.status];

  return (
    <article className="book-card">
      <Link
        className={coverClassName(book)}
        href={`/katalog/${book.id}`}
        aria-label={`Lihat ${book.title}`}
      >
        <CoverArt book={book} />
      </Link>
      <div className="book-card-info">
        <div className="book-card-meta">
          <span>{book.genre}</span>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        <h2>{book.title}</h2>
        <p>{book.author}</p>
        <span className="condition">
          Kondisi: {conditionLabel[book.condition]}
        </span>
      </div>
    </article>
  );
}
