import { z } from "zod";
import { booleanLikeSchema, optionalEnum, optionalString } from "./common.js";

export const userCreateSchema = z.object({
  name: z.string().trim().min(1, "Nama lengkap wajib diisi."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Nama pengguna minimal 3 karakter.")
    .regex(
      /^[a-z0-9._-]+$/,
      "Nama pengguna hanya boleh berisi huruf, angka, titik, garis bawah, atau strip."
    ),
  phone: z.string().trim().min(6, "Nomor telepon wajib diisi."),
  address: optionalString,
  password: z.string().min(8, "Kata sandi sementara minimal 8 karakter."),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(1, "Nama lengkap wajib diisi.").optional(),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Nama pengguna minimal 3 karakter.")
    .regex(
      /^[a-z0-9._-]+$/,
      "Nama pengguna hanya boleh berisi huruf, angka, titik, garis bawah, atau strip."
    )
    .optional(),
  phone: z.string().trim().min(6, "Nomor telepon wajib diisi.").optional(),
  address: optionalString,
  isActive: booleanLikeSchema,
});

export const userListQuerySchema = z.object({
  q: optionalString,
  status: optionalEnum(["aktif", "nonaktif"] as const),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type UserCreateInput = z.infer<typeof userCreateSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
export type UserListQuery = z.infer<typeof userListQuerySchema>;
