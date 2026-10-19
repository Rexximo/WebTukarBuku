import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

export const BOOK_CONDITIONS = ["seperti_baru", "baik", "layak_baca"] as const;
export const BOOK_STATUSES = ["tersedia", "dipesan", "sudah_ditukar"] as const;
export const BOOK_SOURCES = ["admin", "swap"] as const;

const bookSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true, index: true },
    author: { type: String, required: true, trim: true, index: true },
    genre: { type: String, required: true, trim: true, index: true },
    condition: { type: String, enum: BOOK_CONDITIONS, required: true },
    description: { type: String, required: true, trim: true },
    publisher: { type: String, trim: true, default: "" },
    year: { type: Number, min: 1000, max: 2100 },
    coverUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: BOOK_STATUSES,
      default: "tersedia",
      index: true,
    },
    source: { type: String, enum: BOOK_SOURCES, default: "admin" },
    sourceSwapId: { type: Schema.Types.ObjectId, ref: "SwapRequest" },
    isArchived: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export type Book = InferSchemaType<typeof bookSchema>;
export type BookDocument = HydratedDocument<Book> & {
  createdAt: Date;
  updatedAt: Date;
};

export const BookModel = model("Book", bookSchema);
