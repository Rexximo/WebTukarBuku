import bcrypt from "bcryptjs";
import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import { UserModel, type User } from "../models/user.model.js";
import type {
  UserCreateInput,
  UserListQuery,
  UserUpdateInput,
} from "../schemas/user.schema.js";
import { ApiError } from "../utils/api-error.js";
import { buildTempPassword } from "../utils/files.js";
import { escapeRegex, findUserByParam, getParam } from "../utils/lookup.js";
import { toUserDto } from "../utils/serialize.js";
import { cancelPendingRequestsForMember } from "../services/swap.service.js";

export const listUsers: RequestHandler = async (_req, res) => {
  const query = res.locals.query as UserListQuery;

  const filter: QueryFilter<User> = { role: "anggota" };
  if (query.status === "aktif") {
    filter.isActive = true;
  }
  if (query.status === "nonaktif") {
    filter.isActive = false;
  }
  if (query.q) {
    const regex = new RegExp(escapeRegex(query.q), "i");
    filter.$or = [{ name: regex }, { username: regex }];
  }

  const [items, total] = await Promise.all([
    UserModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((query.page - 1) * query.limit)
      .limit(query.limit),
    UserModel.countDocuments(filter),
  ]);

  res.json({
    items: items.map(toUserDto),
    page: query.page,
    limit: query.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / query.limit)),
  });
};

export const getUser: RequestHandler = async (req, res) => {
  const user = await findUserByParam(getParam(req, "id"));
  if (!user) {
    throw ApiError.notFound("Anggota tidak ditemukan.");
  }
  res.json({ user: toUserDto(user) });
};

export const createUser: RequestHandler = async (req, res) => {
  const input = req.body as UserCreateInput;

  const exists = await UserModel.exists({ username: input.username });
  if (exists) {
    throw ApiError.conflict("Nama pengguna sudah digunakan.");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const user = await UserModel.create({
    name: input.name,
    username: input.username,
    phone: input.phone,
    address: input.address ?? "",
    passwordHash,
    role: "anggota",
    mustChangePassword: true,
  });

  res.status(201).json({ user: toUserDto(user) });
};

export const updateUser: RequestHandler = async (req, res) => {
  const user = await findUserByParam(getParam(req, "id"));
  if (!user) {
    throw ApiError.notFound("Anggota tidak ditemukan.");
  }
  if (user.role === "admin") {
    throw ApiError.forbidden(
      "Akun admin tidak dapat diubah dari halaman ini."
    );
  }

  const input = req.body as UserUpdateInput;

  if (input.username && input.username !== user.username) {
    const exists = await UserModel.exists({
      username: input.username,
      _id: { $ne: user._id },
    });
    if (exists) {
      throw ApiError.conflict("Nama pengguna sudah digunakan.");
    }
    user.username = input.username;
  }
  if (input.name !== undefined) user.name = input.name;
  if (input.phone !== undefined) user.phone = input.phone;
  if (input.address !== undefined) user.address = input.address ?? "";

  const deactivating = input.isActive === false && user.isActive;
  if (input.isActive !== undefined) user.isActive = input.isActive;

  await user.save();

  let cancelledRequests = 0;
  if (deactivating) {
    cancelledRequests = await cancelPendingRequestsForMember(user._id);
  }

  res.json({ user: toUserDto(user), cancelledRequests });
};

export const resetPassword: RequestHandler = async (req, res) => {
  const user = await findUserByParam(getParam(req, "id"));
  if (!user) {
    throw ApiError.notFound("Anggota tidak ditemukan.");
  }
  if (user.role === "admin") {
    throw ApiError.forbidden("Kata sandi admin tidak dapat diatur ulang.");
  }

  const temporaryPassword = buildTempPassword();
  user.passwordHash = await bcrypt.hash(temporaryPassword, 10);
  user.mustChangePassword = true;
  await user.save();

  res.json({ temporaryPassword });
};

