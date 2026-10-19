import { Schema, model, type HydratedDocument, type InferSchemaType } from "mongoose";

const galleryPhotoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 90 },
    caption: { type: String, trim: true, default: "", maxlength: 320 },
    imageUrl: { type: String, required: true },
    eventDate: { type: Date, required: true, default: Date.now, index: true },
  },
  { timestamps: true }
);

export type GalleryPhoto = InferSchemaType<typeof galleryPhotoSchema>;
export type GalleryPhotoDocument = HydratedDocument<GalleryPhoto> & {
  createdAt: Date;
  updatedAt: Date;
};

export const GalleryPhotoModel = model("GalleryPhoto", galleryPhotoSchema);
