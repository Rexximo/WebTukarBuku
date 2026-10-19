import type { RequestHandler } from "express";
import type { Types, QueryFilter } from "mongoose";
import { BookModel, type Book } from "../models/book.model.js";
import {
  SwapRequestModel,
  type PopulatedSwapRequestDocument,
  type SwapRequest,
} from "../models/swap-request.model.js";
import { UserModel } from "../models/user.model.js";
import { env } from "../config/env.js";
import type {
  MyRequestListQuery,
  SwapCreateInput,
  SwapListQuery,
  SwapRejectInput,
} from "../schemas/swap.schema.js";
import { ApiError } from "../utils/api-error.js";
import { buildUploadUrl } from "../utils/files.js";
import { escapeRegex, findBookByParam, findRequestByParam, getParam } from "../utils/lookup.js";
import { toBookDto, toSwapRequestDto } from "../utils/serialize.js";
import { buildRequestCode, generateUniqueBookSlug } from "../utils/slug.js";
import { freeBook } from "../services/swap.service.js";

async function populateRequest(
  id: string
): Promise<PopulatedSwapRequestDocument> {
  const request = await SwapRequestModel.findById(id)
    .populate("member")
    .populate("requestedBook");
  if (!request) {
    throw ApiError.notFound("Permintaan tidak ditemukan.");
  }
  return request as unknown as PopulatedSwapRequestDocument;
}

export const createRequest: RequestHandler = async (req, res) => {
  const member = req.user;
  if (!member) {
    throw ApiError.unauthorized();
  }

  const input = req.body as SwapCreateInput;

  const activeCount = await SwapRequestModel.countDocuments({
    member: member._id,
    status: "menunggu",
  });
  if (activeCount >= env.MAX_ACTIVE_REQUESTS) {
    throw ApiError.conflict("Batas permintaan aktif tercapai.");
  }

  const book = await findBookByParam(input.bookId);
  if (!book || book.isArchived) {
    throw ApiError.notFound("Buku tidak ditemukan.");
  }
  if (book.status !== "tersedia") {
    throw ApiError.conflict("Buku ini sedang dipesan anggota lain.");
  }

  const reserved = await BookModel.findOneAndUpdate(
    { _id: book._id, status: "tersedia", isArchived: false },
    { $set: { status: "dipesan" } },
    { returnDocument: "after" }
  );
  if (!reserved) {
    throw ApiError.conflict("Buku ini sedang dipesan anggota lain.");
  }

  try {
    const expiresAt = new Date(
      Date.now() + env.REQUEST_EXPIRY_DAYS * 24 * 60 * 60 * 1000
    );
    const request = await SwapRequestModel.create({
      code: buildRequestCode(),
      member: member._id,
      requestedBook: reserved._id,
      offeredBook: {
        title: input.title,
        author: input.author,
        condition: input.condition,
        notes: input.notes ?? "",
        photoUrl: req.file ? buildUploadUrl(req.file.filename) : "",
      },
      status: "menunggu",
      expiresAt,
    });

    const populated = await populateRequest(request._id.toString());
    res.status(201).json({ request: toSwapRequestDto(populated) });
  } catch (error) {
    await freeBook(reserved._id);
    throw error;
  }
};

export const listMyRequests: RequestHandler = async (req, res) => {
  const member = req.user;
  if (!member) {
    throw ApiError.unauthorized();
  }

  const query = res.locals.query as MyRequestListQuery;
  const filter: QueryFilter<SwapRequest> = { member: member._id };
  if (query.status) {
    filter.status = query.status;
  }

  const requests = await SwapRequestModel.find(filter)
    .sort({ createdAt: -1 })
    .populate("member")
    .populate("requestedBook");

  res.json({
    items: requests.map((request) =>
      toSwapRequestDto(request as unknown as PopulatedSwapRequestDocument)
    ),
  });
};

export const listAllRequests: RequestHandler = async (_req, res) => {
  const query = res.locals.query as SwapListQuery;

  const filter: QueryFilter<SwapRequest> = {};
  if (query.status) {
    filter.status = query.status;
  }
  if (query.q) {
    const regex = new RegExp(escapeRegex(query.q), "i");
    const [memberIds, bookIds] = await Promise.all([
      UserModel.find({ name: regex }).select("_id").lean(),
      BookModel.find({ title: regex }).select("_id").lean(),
    ]);
    filter.$or = [
      { code: regex },
      { member: { $in: memberIds.map((item) => item._id) } },
      { requestedBook: { $in: bookIds.map((item) => item._id) } },
      { "offeredBook.title": regex },
    ];
  }

  const [items, total] = await Promise.all([
    SwapRequestModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit)
      .populate("member")
      .populate("requestedBook"),
    SwapRequestModel.countDocuments(filter),
  ]);

  res.json({
    items: items.map((request) =>
      toSwapRequestDto(request as unknown as PopulatedSwapRequestDocument)
    ),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  });
};

export const getRequest: RequestHandler = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw ApiError.unauthorized();
  }

  const request = await findRequestByParam(getParam(req, "id"));
  if (!request) {
    throw ApiError.notFound("Permintaan tidak ditemukan.");
  }
  if (user.role !== "admin" && request.member.toString() !== user.id) {
    throw ApiError.forbidden("Anda tidak memiliki akses ke permintaan ini.");
  }

  const populated = await populateRequest(request._id.toString());
  res.json({ request: toSwapRequestDto(populated) });
};

export const cancelRequest: RequestHandler = async (req, res) => {
  const member = req.user;
  if (!member) {
    throw ApiError.unauthorized();
  }

  const request = await findRequestByParam(getParam(req, "id"));
  if (!request || request.member.toString() !== member.id) {
    throw ApiError.notFound("Permintaan tidak ditemukan.");
  }

  const claimed = await SwapRequestModel.findOneAndUpdate(
    { _id: request._id, status: "menunggu" },
    { $set: { status: "dibatalkan" } },
    { returnDocument: "after" }
  );
  if (!claimed) {
    throw ApiError.conflict("Permintaan tidak dapat dibatalkan.");
  }

  await freeBook(claimed.requestedBook as Types.ObjectId);
  const populated = await populateRequest(claimed._id.toString());
  res.json({ request: toSwapRequestDto(populated) });
};

export const approveRequest: RequestHandler = async (req, res) => {
  const admin = req.user;
  if (!admin) {
    throw ApiError.unauthorized();
  }

  const request = await findRequestByParam(getParam(req, "id"));
  if (!request) {
    throw ApiError.notFound("Permintaan tidak ditemukan.");
  }

  const claimed = await SwapRequestModel.findOneAndUpdate(
    { _id: request._id, status: "menunggu" },
    {
      $set: {
        status: "selesai",
        completedAt: new Date(),
        processedBy: admin._id,
      },
    },
    { returnDocument: "after" }
  );
  if (!claimed) {
    throw ApiError.conflict("Permintaan sudah diproses sebelumnya.");
  }

  await BookModel.updateOne(
    { _id: claimed.requestedBook, status: "dipesan" },
    { $set: { status: "sudah_ditukar" } }
  );

  const member = await UserModel.findById(claimed.member);
  const slug = await generateUniqueBookSlug(claimed.offeredBook.title);
  const createdBook = await BookModel.create({
    slug,
    title: claimed.offeredBook.title,
    author: claimed.offeredBook.author,
    genre: "Lainnya",
    condition: claimed.offeredBook.condition,
    description:
      claimed.offeredBook.notes?.trim() ||
      `Buku hasil penukaran dari ${member?.name ?? "anggota"}.`,
    coverUrl: claimed.offeredBook.photoUrl ?? "",
    status: "tersedia",
    source: "swap",
    sourceSwapId: claimed._id,
  });

  const populated = await populateRequest(claimed._id.toString());
  res.json({
    request: toSwapRequestDto(populated),
    createdBook: toBookDto(createdBook),
  });
};

export const rejectRequest: RequestHandler = async (req, res) => {
  const admin = req.user;
  if (!admin) {
    throw ApiError.unauthorized();
  }

  const request = await findRequestByParam(getParam(req, "id"));
  if (!request) {
    throw ApiError.notFound("Permintaan tidak ditemukan.");
  }

  const { reason } = req.body as SwapRejectInput;

  const claimed = await SwapRequestModel.findOneAndUpdate(
    { _id: request._id, status: "menunggu" },
    {
      $set: {
        status: "ditolak",
        rejectReason: reason,
        processedBy: admin._id,
      },
    },
    { returnDocument: "after" }
  );
  if (!claimed) {
    throw ApiError.conflict("Permintaan sudah diproses sebelumnya.");
  }

  await freeBook(claimed.requestedBook as Types.ObjectId);
  const populated = await populateRequest(claimed._id.toString());
  res.json({ request: toSwapRequestDto(populated) });
};


