import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import { BookModel, type Book } from "../models/book.model.js";
import { SwapRequestModel } from "../models/swap-request.model.js";
import type {
  BookCreateInput,
  BookListQuery,
  BookUpdateInput,
} from "../schemas/book.schema.js";
import { ApiError } from "../utils/api-error.js";
import { buildUploadUrl, deleteUploadByUrl } from "../utils/files.js";
import { escapeRegex, findBookByParam, getParam } from "../utils/lookup.js";
import { toBookDto } from "../utils/serialize.js";
import { generateUniqueBookSlug } from "../utils/slug.js";

export const listBooks: RequestHandler = async (_req, res) => {
  const query = res.locals.query as BookListQuery;

  const filter: QueryFilter<Book> = { isArchived: false };
  if (query.status) {
    filter.status = query.status;
  }
  if (query.condition) {
    filter.condition = query.condition;
  }
  if (query.genre) {
    filter.genre = query.genre;
  }
  if (query.q) {
    const regex = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [{ title: regex }, { author: regex }];
  }

  const [items, total] = await Promise.all([
    BookModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit),
    BookModel.countDocuments(filter),
  ]);

  res.json({
    items: items.map(toBookDto),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  });
};

export const listGenres: RequestHandler = async (_req, res) => {
  const genres = await BookModel.distinct("genre", { isArchived: false });
  res.json({ genres: genres.sort((a, b) => a.localeCompare(b, "id")) });
};

export const getBook: RequestHandler = async (req, res) => {
  const book = await findBookByParam(getParam(req, "id"));
  if (!book || book.isArchived) {
    throw ApiError.notFound("Buku tidak ditemukan.");
  }
  res.json({ book: toBookDto(book) });
};

export const createBook: RequestHandler = async (req, res) => {
  const input = req.body as BookCreateInput;
  if (!req.file) {
    throw ApiError.badRequest("Sampul buku wajib diunggah.");
  }

  const slug = await generateUniqueBookSlug(input.title);
  const book = await BookModel.create({
    slug,
    title: input.title,
    author: input.author,
    genre: input.genre,
    condition: input.condition,
    description: input.description,
    publisher: input.publisher ?? "",
    year: input.year,
    coverUrl: buildUploadUrl(req.file.filename),
    status: "tersedia",
    source: "admin",
  });

  res.status(201).json({ book: toBookDto(book) });
};

export const updateBook: RequestHandler = async (req, res) => {
  const book = await findBookByParam(getParam(req, "id"));
  if (!book) {
    throw ApiError.notFound("Buku tidak ditemukan.");
  }

  const input = req.body as BookUpdateInput;

  if (input.title !== undefined) book.title = input.title;
  if (input.author !== undefined) book.author = input.author;
  if (input.genre !== undefined) book.genre = input.genre;
  if (input.condition !== undefined) book.condition = input.condition;
  if (input.description !== undefined) book.description = input.description;
  if (input.publisher !== undefined) book.publisher = input.publisher ?? "";
  if (input.year !== undefined) book.year = input.year;

  if (req.file) {
    deleteUploadByUrl(book.coverUrl);
    book.coverUrl = buildUploadUrl(req.file.filename);
  }

  await book.save();
  res.json({ book: toBookDto(book) });
};

export const deleteBook: RequestHandler = async (req, res) => {
  const book = await findBookByParam(getParam(req, "id"));
  if (!book) {
    throw ApiError.notFound("Buku tidak ditemukan.");
  }

  const hasPendingRequest = await SwapRequestModel.exists({
    requestedBook: book._id,
    status: "menunggu",
  });
  if (hasPendingRequest) {
    throw ApiError.conflict(
      "Buku dengan permintaan aktif tidak dapat dihapus."
    );
  }

  const hasSwapHistory = await SwapRequestModel.exists({
    requestedBook: book._id,
  });

  if (hasSwapHistory || book.source === "swap") {
    book.isArchived = true;
    await book.save();
    res.json({
      archived: true,
      message: "Buku memiliki riwayat penukaran sehingga diarsipkan.",
    });
    return;
  }

  deleteUploadByUrl(book.coverUrl);
  await book.deleteOne();
  res.json({ archived: false, message: "Buku berhasil dihapus." });
};

