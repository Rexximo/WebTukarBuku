export class ApiClientError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiClientError";
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}

function buildInit(method: string, body?: unknown): RequestInit {
  if (body === undefined) {
    return { method };
  }
  if (body instanceof FormData) {
    return { method, body };
  }
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

async function request<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: "same-origin",
      ...init,
    });
  } catch {
    throw new ApiClientError(
      0,
      "Tidak dapat terhubung ke server. Periksa koneksi Anda."
    );
  }

  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new ApiClientError(
      response.status,
      (data as { message?: string } | null)?.message ??
        "Terjadi kesalahan. Silakan coba lagi."
    );
  }

  return data as T;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { method: "GET" });
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, buildInit("POST", body));
}

export function apiPatch<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, buildInit("PATCH", body));
}

export function apiDelete<T>(path: string): Promise<T> {
  return request<T>(path, { method: "DELETE" });
}
