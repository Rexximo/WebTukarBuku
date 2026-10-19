import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Nama pengguna wajib diisi."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi."),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
