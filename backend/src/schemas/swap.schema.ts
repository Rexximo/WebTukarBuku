import { z } from "zod";
import { REQUEST_STATUSES } from "../models/swap-request.model.js";
import {
  conditionSchema,
  optionalEnum,
  optionalString,
} from "./common.js";

export const swapCreateSchema = z.object({
  bookId: z.string().trim().min(1, "Buku yang ingin ditukar wajib dipilih."),
  title: z.string().trim().min(1, "Judul buku yang Anda bawa wajib diisi."),
  author: z.string().trim().min(1, "Nama penulis wajib diisi."),
  condition: conditionSchema,
  notes: optionalString,
});

export const swapRejectSchema = z.object({
  reason: z
    .string()
    .trim()
    .min(1, "Alasan penolakan wajib diisi.")
    .max(500, "Alasan penolakan maksimal 500 karakter."),
});

export const swapListQuerySchema = z.object({
  q: optionalString,
  status: optionalEnum(REQUEST_STATUSES),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const myRequestListQuerySchema = z.object({
  status: optionalEnum(REQUEST_STATUSES),
});

export type SwapCreateInput = z.infer<typeof swapCreateSchema>;
export type SwapRejectInput = z.infer<typeof swapRejectSchema>;
export type SwapListQuery = z.infer<typeof swapListQuerySchema>;
export type MyRequestListQuery = z.infer<typeof myRequestListQuerySchema>;
