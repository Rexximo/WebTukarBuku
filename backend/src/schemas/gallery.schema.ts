import { z } from "zod";

export const galleryPhotoCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Judul foto minimal 3 karakter.")
    .max(90, "Judul foto maksimal 90 karakter."),
  caption: z
    .string()
    .trim()
    .max(320, "Keterangan maksimal 320 karakter.")
    .optional()
    .default(""),
  eventDate: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value ||
        (/^\d{4}-\d{2}-\d{2}$/.test(value) &&
          !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`))),
      "Tanggal kegiatan tidak valid."
    ),
});

export type GalleryPhotoCreateInput = z.infer<typeof galleryPhotoCreateSchema>;
