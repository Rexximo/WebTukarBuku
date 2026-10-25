import type {
  BadgeVariant,
  BookCondition,
  BookStatus,
  RequestStatus,
} from "./types";

interface StatusMeta {
  label: string;
  variant: BadgeVariant;
}

export const bookStatusMeta: Record<BookStatus, StatusMeta> = {
  tersedia: { label: "Tersedia", variant: "success" },
  dipesan: { label: "Dipesan", variant: "warning" },
  sudah_ditukar: { label: "Sudah Ditukar", variant: "neutral" },
};

export const requestStatusMeta: Record<RequestStatus, StatusMeta> = {
  menunggu: { label: "Menunggu", variant: "warning" },
  selesai: { label: "Selesai", variant: "success" },
  ditolak: { label: "Ditolak", variant: "danger" },
  dibatalkan: { label: "Dibatalkan", variant: "neutral" },
  kedaluwarsa: { label: "Kedaluwarsa", variant: "neutral" },
};

export const conditionLabel: Record<BookCondition, string> = {
  seperti_baru: "Seperti Baru",
  baik: "Baik",
  layak_baca: "Layak Baca",
};

export const conditionOptions = Object.entries(conditionLabel).map(
  ([value, label]) => ({ value, label })
);
