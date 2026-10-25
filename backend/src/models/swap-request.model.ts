import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";
import { BOOK_CONDITIONS } from "./book.model.js";

export const REQUEST_STATUSES = [
  "menunggu",
  "selesai",
  "ditolak",
  "dibatalkan",
  "kedaluwarsa",
] as const;

const offeredBookSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    condition: { type: String, enum: BOOK_CONDITIONS, required: true },
    notes: { type: String, trim: true, default: "" },
    photoUrl: { type: String, default: "" },
  },
  { _id: false }
);

const swapRequestSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true },
    member: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    requestedBook: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },
    offeredBook: { type: offeredBookSchema, required: true },
    status: {
      type: String,
      enum: REQUEST_STATUSES,
      default: "menunggu",
      index: true,
    },
    rejectReason: { type: String, trim: true, default: "" },
    processedBy: { type: Schema.Types.ObjectId, ref: "User" },
    expiresAt: { type: Date, index: true },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

swapRequestSchema.index({ member: 1, status: 1 });
swapRequestSchema.index({ status: 1, expiresAt: 1 });

export type SwapRequest = InferSchemaType<typeof swapRequestSchema>;
export type SwapRequestDocument = HydratedDocument<SwapRequest> & {
  createdAt: Date;
  updatedAt: Date;
};

export interface PopulatedSwapRequest {
  member: import("./user.model.js").UserDocument;
  requestedBook: import("./book.model.js").BookDocument;
}

export type PopulatedSwapRequestDocument = SwapRequestDocument &
  PopulatedSwapRequest;

export const SwapRequestModel = model("SwapRequest", swapRequestSchema);
