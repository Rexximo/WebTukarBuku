"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { SelectField, TextField } from "@/components/form";
import { conditionOptions } from "@/lib/status";

export interface CatalogFilters {
  q: string;
  genre: string;
  condition: string;
  status: string;
}

const statusOptions = [
  { value: "tersedia", label: "Tersedia" },
  { value: "dipesan", label: "Dipesan" },
  { value: "sudah_ditukar", label: "Sudah Ditukar" },
];

export function CatalogToolbar({
  genres,
  initial,
}: {
  genres: string[];
  initial: CatalogFilters;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState<CatalogFilters>(initial);
  const filtersRef = useRef(filters);
  const skipFirstApply = useRef(true);

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const applyFilters = useCallback(
    (next: CatalogFilters) => {
      const params = new URLSearchParams();
      if (next.q.trim()) params.set("q", next.q.trim());
      if (next.genre) params.set("genre", next.genre);
      if (next.condition) params.set("condition", next.condition);
      if (next.status) params.set("status", next.status);
      const query = params.toString();
      router.replace(query ? `/katalog?${query}` : "/katalog", {
        scroll: false,
      });
    },
    [router]
  );

  useEffect(() => {
    if (skipFirstApply.current) {
      skipFirstApply.current = false;
      return;
    }
    const timer = setTimeout(() => {
      applyFilters(filtersRef.current);
    }, 400);
    return () => clearTimeout(timer);
  }, [filters.q, applyFilters]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    applyFilters(filters);
  }

  const genreOptions = [
    ...genres.map((genre) => ({ value: genre, label: genre })),
  ];

  return (
    <form className="catalog-toolbar" onSubmit={handleSubmit}>
      <TextField
        id="search"
        name="q"
        label="Cari buku"
        fieldClass="search-field"
        placeholder="Cari judul atau penulis…"
        value={filters.q}
        onChange={(event) =>
          setFilters((current) => ({ ...current, q: event.target.value }))
        }
      />
      <SelectField
        id="genre"
        name="genre"
        label="Genre"
        placeholder="Semua Genre"
        options={genreOptions}
        value={filters.genre}
        onValueChange={(genre) =>
          setFilters((current) => ({ ...current, genre }))
        }
      />
      <SelectField
        id="condition"
        name="condition"
        label="Kondisi"
        placeholder="Semua Kondisi"
        options={conditionOptions}
        value={filters.condition}
        onValueChange={(condition) =>
          setFilters((current) => ({
            ...current,
            condition,
          }))
        }
      />
      <SelectField
        id="availability"
        name="status"
        label="Ketersediaan"
        placeholder="Semua Status"
        options={statusOptions}
        value={filters.status}
        onValueChange={(status) =>
          setFilters((current) => ({ ...current, status }))
        }
      />
      <button className="button button-primary" type="submit">
        Terapkan
      </button>
    </form>
  );
}
