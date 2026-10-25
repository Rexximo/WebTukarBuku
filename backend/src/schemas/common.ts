import { z } from "zod";
import { BOOK_CONDITIONS } from "../models/book.model.js";

export function emptyToUndefined(value: unknown): unknown {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  return value;
}

export const optionalString = z.preprocess(
  emptyToUndefined,
  z.string().trim().optional()
);

export function optionalEnum<const T extends readonly [string, ...string[]]>(
  values: T
) {
  return z.preprocess(emptyToUndefined, z.enum(values).optional());
}

export const conditionSchema = z.preprocess(
  emptyToUndefined,
  z.enum(BOOK_CONDITIONS, { error: "Kondisi buku tidak valid." })
);

export const optionalYearSchema = z.preprocess(
  emptyToUndefined,
  z.coerce
    .number()
    .int("Tahun terbit harus berupa angka.")
    .min(1000, "Tahun terbit tidak valid.")
    .max(2100, "Tahun terbit tidak valid.")
    .optional()
);

export const booleanLikeSchema = z.preprocess((value) => {
  if (value === true || value === "true" || value === "on") {
    return true;
  }
  if (value === false || value === "false" || value === "off") {
    return false;
  }
  return undefined;
}, z.boolean().optional());
