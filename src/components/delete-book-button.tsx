"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { apiDelete, getErrorMessage } from "@/lib/api-client";
import type { DeleteBookResponse } from "@/lib/types";

export function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    setPending(true);
    try {
      const result = await apiDelete<DeleteBookResponse>(`/books/${bookId}`);
      showToast(result.message);
      router.push("/admin/buku");
      router.refresh();
    } catch (error) {
      showToast(getErrorMessage(error), "error");
      setPending(false);
    }
  }

  return (
    <button
      className="button button-danger"
      type="button"
      onClick={handleDelete}
      disabled={pending}
    >
      Hapus buku / arsipkan
    </button>
  );
}
