export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message = "Silakan masuk terlebih dahulu."): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = "Anda tidak memiliki akses."): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = "Data tidak ditemukan."): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }
}
