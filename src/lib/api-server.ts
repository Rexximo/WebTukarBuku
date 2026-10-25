import { cookies } from "next/headers";
import { ApiClientError } from "./api-client";

const API_URL = process.env.API_URL ?? "http://localhost:4000";
const COOKIE_NAME = process.env.COOKIE_NAME ?? "tb_token";

async function parse<T>(response: Response): Promise<T> {
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

export async function serverGet<T>(
  path: string,
  options?: { revalidate?: number }
): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  const response = await fetch(`${API_URL}/api${path}`, {
    headers: token ? { cookie: `${COOKIE_NAME}=${token}` } : undefined,
    ...(options?.revalidate !== undefined
      ? { next: { revalidate: options.revalidate } }
      : { cache: "no-store" }),
  });

  return parse<T>(response);
}

export async function publicGet<T>(
  path: string,
  revalidate = 60
): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    next: { revalidate },
  });
  return parse<T>(response);
}
