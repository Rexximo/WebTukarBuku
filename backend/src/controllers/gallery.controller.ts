import { Types } from "mongoose";
import type { RequestHandler } from "express";
import {
  GalleryPhotoModel,
  type GalleryPhotoDocument,
} from "../models/gallery-photo.model.js";
import type { GalleryPhotoCreateInput } from "../schemas/gallery.schema.js";
import { ApiError } from "../utils/api-error.js";
import { buildUploadUrl, deleteUploadByUrl } from "../utils/files.js";
import { getParam } from "../utils/lookup.js";

function toGalleryPhotoDto(photo: GalleryPhotoDocument) {
  return {
    id: photo._id.toString(),
    title: photo.title,
    caption: photo.caption ?? "",
    imageUrl: photo.imageUrl,
    eventDate: photo.eventDate.toISOString(),
    createdAt: photo.createdAt.toISOString(),
  };
}

export const listPhotos: RequestHandler = async (_req, res) => {
  const photos = await GalleryPhotoModel.find()
    .sort({ eventDate: -1, createdAt: -1 })
    .limit(200);

  res.json({ items: photos.map(toGalleryPhotoDto) });
};

export const createPhoto: RequestHandler = async (req, res) => {
  const input = req.body as GalleryPhotoCreateInput;
  if (!req.file) {
    throw ApiError.badRequest("Pilih foto kegiatan yang akan diunggah.");
  }

  const photo = await GalleryPhotoModel.create({
    title: input.title,
    caption: input.caption ?? "",
    imageUrl: buildUploadUrl(req.file.filename),
    eventDate: input.eventDate ? new Date(input.eventDate) : new Date(),
  });

  res.status(201).json({ photo: toGalleryPhotoDto(photo) });
};

export const deletePhoto: RequestHandler = async (req, res) => {
  const id = getParam(req, "id");
  if (!Types.ObjectId.isValid(id)) {
    throw ApiError.notFound("Foto galeri tidak ditemukan.");
  }

  const photo = await GalleryPhotoModel.findById(id);
  if (!photo) {
    throw ApiError.notFound("Foto galeri tidak ditemukan.");
  }

  deleteUploadByUrl(photo.imageUrl);
  await photo.deleteOne();
  res.json({ message: "Foto kegiatan berhasil dihapus." });
};
