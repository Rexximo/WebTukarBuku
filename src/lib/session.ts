import { redirect } from "next/navigation";
import { serverGet } from "./api-server";
import type { AuthResponse, User } from "./types";

export const MAX_ACTIVE_REQUESTS = Number(
  process.env.NEXT_PUBLIC_MAX_ACTIVE_REQUESTS ?? "2"
);

export async function getCurrentUser(): Promise<User | null> {
  try {
    const data = await serverGet<AuthResponse>("/auth/me");
    return data.user;
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/keluar");
  }
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/katalog?error=akses");
  }
  return user;
}
