import { z } from "zod";
import { BOOK_STATUSES } from "../models/book.model.js";
import {
  conditionSchema,
  optionalEnum,
  optionalString,
  optionalYearSchema,
} from "./common.js";

export const bookCreateSchema = z.object({
  title: z.string().trim().min(1, "Judul buku wajib diisi."),
  author: z.string().trim().min(1, "Penulis wajib diisi."),
  genre: z.string().trim().min(1, "Genre wajib diisi."),
  condition: conditionSchema,
  description: z.string().trim().min(1, "Deskripsi wajib diisi."),
  publisher: optionalString,
  year: optionalYearSchema,
});

export const bookUpdateSchema = bookCreateSchema.partial();

export const bookListQuerySchema = z.object({
  q: optionalString,
  genre: optionalString,
  condition: optionalEnum(
    ["seperti_baru", "baik", "layak_baca"] as const
  ),
  status: optionalEnum(BOOK_STATUSES),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
});

export type BookCreateInput = z.infer<typeof bookCreateSchema>;
export type BookUpdateInput = z.infer<typeof bookUpdateSchema>;
export type BookListQuery = z.infer<typeof bookListQuerySchema>;
