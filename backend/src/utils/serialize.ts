import type { BookDocument } from "../models/book.model.js";
import type { PopulatedSwapRequestDocument } from "../models/swap-request.model.js";
import type { UserDocument } from "../models/user.model.js";

export function toUserDto(user: UserDocument) {
  return {
    id: user.username,
    name: user.name,
    username: user.username,
    phone: user.phone,
    address: user.address ?? "",
    isActive: user.isActive,
    mustChangePassword: user.mustChangePassword,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export function toBookDto(book: BookDocument) {
  return {
    id: book.slug,
    title: book.title,
    author: book.author,
    genre: book.genre,
    condition: book.condition,
    description: book.description,
    publisher: book.publisher ?? "",
    year: book.year ?? null,
    coverUrl: book.coverUrl ?? "",
    status: book.status,
    source: book.source,
    createdAt: book.createdAt,
    updatedAt: book.updatedAt,
  };
}

export function toSwapRequestDto(request: PopulatedSwapRequestDocument) {
  return {
    id: request.code,
    status: request.status,
    member: toUserDto(request.member),
    requestedBook: toBookDto(request.requestedBook),
    offeredBook: {
      title: request.offeredBook.title,
      author: request.offeredBook.author,
      condition: request.offeredBook.condition,
      notes: request.offeredBook.notes ?? "",
      photoUrl: request.offeredBook.photoUrl ?? "",
    },
    rejectReason: request.rejectReason || null,
    expiresAt: request.expiresAt ?? null,
    createdAt: request.createdAt,
    completedAt: request.completedAt ?? null,
  };
}

export type UserDto = ReturnType<typeof toUserDto>;
export type BookDto = ReturnType<typeof toBookDto>;
export type SwapRequestDto = ReturnType<typeof toSwapRequestDto>;
