import { BookModel } from "../models/book.model.js";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function buildRequestCode(): string {
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TB-${time}${random}`;
}

export async function generateUniqueBookSlug(title: string): Promise<string> {
  const base = slugify(title) || "buku";
  let candidate = base;
  let counter = 2;
  while (await BookModel.exists({ slug: candidate })) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  return candidate;
}
