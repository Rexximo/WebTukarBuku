import type { RequestHandler } from "express";
import { BookModel } from "../models/book.model.js";
import {
  SwapRequestModel,
  type PopulatedSwapRequestDocument,
} from "../models/swap-request.model.js";
import { UserModel } from "../models/user.model.js";
import { toSwapRequestDto } from "../utils/serialize.js";

export const getDashboardStats: RequestHandler = async (_req, res) => {
  const [
    totalBooks,
    availableBooks,
    totalMembers,
    pendingRequests,
    totalRequests,
    latestRequests,
  ] = await Promise.all([
    BookModel.countDocuments({ isArchived: false }),
    BookModel.countDocuments({ isArchived: false, status: "tersedia" }),
    UserModel.countDocuments({ role: "anggota", isActive: true }),
    SwapRequestModel.countDocuments({ status: "menunggu" }),
    SwapRequestModel.countDocuments(),
    SwapRequestModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("member")
      .populate("requestedBook"),
  ]);

  res.json({
    totalBooks,
    availableBooks,
    totalMembers,
    pendingRequests,
    totalRequests,
    latestRequests: latestRequests.map((request) =>
      toSwapRequestDto(request as unknown as PopulatedSwapRequestDocument)
    ),
  });
};
