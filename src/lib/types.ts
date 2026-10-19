export type BookStatus = "tersedia" | "dipesan" | "sudah_ditukar";

export type BookCondition = "seperti_baru" | "baik" | "layak_baca";

export type RequestStatus =
  | "menunggu"
  | "selesai"
  | "ditolak"
  | "dibatalkan"
  | "kedaluwarsa";

export type Role = "admin" | "anggota";

export type BadgeVariant = "success" | "warning" | "danger" | "neutral" | "blue";

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  address: string;
  isActive: boolean;
  mustChangePassword: boolean;
  role: Role;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  condition: BookCondition;
  description: string;
  publisher: string;
  year: number | null;
  coverUrl: string;
  status: BookStatus;
  source: "admin" | "swap";
  createdAt: string;
  updatedAt: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  eventDate: string;
  createdAt: string;
}

export interface OfferedBook {
  title: string;
  author: string;
  condition: BookCondition;
  notes: string;
  photoUrl: string;
}

export interface SwapRequest {
  id: string;
  status: RequestStatus;
  member: User;
  requestedBook: Book;
  offeredBook: OfferedBook;
  rejectReason: string | null;
  expiresAt: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalBooks: number;
  availableBooks: number;
  totalMembers: number;
  pendingRequests: number;
  totalRequests: number;
  latestRequests: SwapRequest[];
}

export interface AuthResponse {
  user: User;
}

export interface UserResponse {
  user: User;
  cancelledRequests?: number;
}

export interface BookResponse {
  book: Book;
}

export interface GalleryPhotoListResponse {
  items: GalleryPhoto[];
}

export interface GalleryPhotoResponse {
  photo: GalleryPhoto;
}

export interface RequestResponse {
  request: SwapRequest;
  createdBook?: Book;
}

export interface TemporaryPasswordResponse {
  temporaryPassword: string;
}

export interface DeleteBookResponse {
  archived: boolean;
  message: string;
}
