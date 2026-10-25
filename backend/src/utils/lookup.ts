import { Types } from "mongoose";
import type { Request } from "express";
import { BookModel, type BookDocument } from "../models/book.model.js";
import {
  SwapRequestModel,
  type SwapRequestDocument,
} from "../models/swap-request.model.js";
import { UserModel, type UserDocument } from "../models/user.model.js";

export function getParam(req: Request, name: string): string {
  const value = req.params[name];
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export async function findBookByParam(
  param: string
): Promise<BookDocument | null> {
  if (Types.ObjectId.isValid(param)) {
    const byId = await BookModel.findById(param);
    if (byId) {
      return byId;
    }
  }
  return BookModel.findOne({ slug: param });
}

export async function findUserByParam(
  param: string
): Promise<UserDocument | null> {
  if (Types.ObjectId.isValid(param)) {
    const byId = await UserModel.findById(param);
    if (byId) {
      return byId;
    }
  }
  return UserModel.findOne({ username: param.toLowerCase() });
}

export async function findRequestByParam(
  param: string
): Promise<SwapRequestDocument | null> {
  if (Types.ObjectId.isValid(param)) {
    const byId = await SwapRequestModel.findById(param);
    if (byId) {
      return byId;
    }
  }
  return SwapRequestModel.findOne({ code: param.toUpperCase() });
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
