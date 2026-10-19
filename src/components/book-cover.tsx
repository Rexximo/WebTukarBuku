import Image from "next/image";
import { Fragment, type CSSProperties } from "react";
import type { Book } from "@/lib/types";

const coverTones = [
  "coral",
  "forest",
  "lilac",
  "gold",
  "blue",
  "plum",
  "mint",
  "sand",
] as const;

export type CoverTone = (typeof coverTones)[number];

const genreKickers: Record<string, string> = {
  Fiksi: "SEBUAH NOVEL",
  Puisi: "PUISI",
  Sejarah: "SEJARAH",
  "Pengembangan diri": "PENGEMBANGAN DIRI",
  Esai: "KUMPULAN ESAI",
  Perjalanan: "CATATAN PERJALANAN",
  Lainnya: "BUKU PILIHAN",
};

export function coverToneFor(id: string): CoverTone {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) >>> 0;
  }
  return coverTones[hash % coverTones.length];
}

export function coverKickerFor(book: Book): string {
  return genreKickers[book.genre] ?? book.genre.toUpperCase();
}

export function coverTitleLines(title: string): string[] {
  const words = title.trim().split(/\s+/);
  if (words.length <= 2) {
    return words;
  }
  if (words.length === 3) {
    return [words[0], words.slice(1).join(" ")];
  }
  const middle = Math.ceil(words.length / 2);
  return [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
}

export function coverClassName(book: Book, extra?: string): string {
  return ["book-card-cover", `cover-${coverToneFor(book.id)}`, extra]
    .filter(Boolean)
    .join(" ");
}

export function tableCoverStyle(book: Book): CSSProperties | undefined {
  if (!book.coverUrl) {
    return undefined;
  }
  return {
    backgroundImage: `url(${book.coverUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}

export function CoverArt({ book, orb = true }: { book: Book; orb?: boolean }) {
  if (book.coverUrl) {
    return (
      <Image
        className="book-cover-img"
        src={book.coverUrl}
        alt={`Sampul buku ${book.title}`}
        fill
        sizes="(max-width: 767px) 45vw, 280px"
      />
    );
  }

  const lines = coverTitleLines(book.title);
  return (
    <>
      <span className="book-kicker">{coverKickerFor(book)}</span>
      <span className="book-cover-title">
        {lines.map((line, index) => (
          <Fragment key={line}>
            {index > 0 ? <br /> : null}
            {line}
          </Fragment>
        ))}
      </span>
      {orb ? <span className="book-cover-orb" /> : null}
      <span className="book-cover-author">{book.author.toUpperCase()}</span>
    </>
  );
}

export function BookCover({
  book,
  className,
  orb = true,
  style,
}: {
  book: Book;
  className?: string;
  orb?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={coverClassName(book, className)} style={style}>
      <CoverArt book={book} orb={orb} />
    </div>
  );
}
