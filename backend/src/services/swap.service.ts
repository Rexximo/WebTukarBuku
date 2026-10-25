import { Types } from "mongoose";
import { BookModel } from "../models/book.model.js";
import { SwapRequestModel } from "../models/swap-request.model.js";

export async function freeBook(
  bookId: Types.ObjectId | string
): Promise<void> {
  await BookModel.updateOne(
    { _id: bookId, status: "dipesan" },
    { $set: { status: "tersedia" } }
  );
}

export async function cancelPendingRequestsForMember(
  memberId: Types.ObjectId
): Promise<number> {
  const pending = await SwapRequestModel.find({
    member: memberId,
    status: "menunggu",
  }).select("_id requestedBook");

  let cancelled = 0;
  for (const request of pending) {
    const claimed = await SwapRequestModel.findOneAndUpdate(
      { _id: request._id, status: "menunggu" },
      { $set: { status: "dibatalkan" } }
    );
    if (!claimed) {
      continue;
    }
    await freeBook(request.requestedBook as Types.ObjectId);
    cancelled += 1;
  }
  return cancelled;
}

export async function expireOverdueRequests(): Promise<number> {
  const overdue = await SwapRequestModel.find({
    status: "menunggu",
    expiresAt: { $lte: new Date() },
  }).select("_id requestedBook");

  let expired = 0;
  for (const request of overdue) {
    const claimed = await SwapRequestModel.findOneAndUpdate(
      { _id: request._id, status: "menunggu" },
      { $set: { status: "kedaluwarsa" } }
    );
    if (!claimed) {
      continue;
    }
    await freeBook(request.requestedBook as Types.ObjectId);
    expired += 1;
  }
  return expired;
}
