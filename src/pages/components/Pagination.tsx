import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { type PaginationMeta } from "@/hooks/useOportunidades";

interface PaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({ meta, onPageChange, disabled }: PaginationProps) {
  const { current_page, total_pages, total_elements, size } = meta;

  if (total_pages <= 1) return null;

  // Calcula intervalo de itens exibidos
  const from = (current_page - 1) * size + 1;
  const to = Math.min(current_page * size, total_elements);

  // Gera lista de páginas com reticências
  function getPages(): (number | "…")[] {
    if (total_pages <= 7) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }

    const pages: (number | "…")[] = [1];

    if (current_page > 3) pages.push("…");

    const start = Math.max(2, current_page - 1);
    const end = Math.min(total_pages - 1, current_page + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (current_page < total_pages - 2) pages.push("…");

    pages.push(total_pages);
    return pages;
  }

  const pages = getPages();

  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      {/* Contador */}
      <p className="text-xs text-gray-400">
        Exibindo{" "}
        <span className="font-medium text-gray-600">
          {from}–{to}
        </span>{" "}
        de{" "}
        <span className="font-medium text-gray-600">{total_elements}</span>{" "}
        oportunidades
      </p>

      {/* Controles */}
      <div className="flex items-center gap-1">
        {/* Anterior */}
        <button
          onClick={() => onPageChange(current_page - 1)}
          disabled={!meta.has_previous || disabled}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            meta.has_previous && !disabled
              ? "hover:bg-gray-100 text-gray-600"
              : "text-gray-300 cursor-not-allowed"
          )}
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Números */}
        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="w-9 h-9 flex items-center justify-center text-sm text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              disabled={disabled}
              className={cn(
                "w-9 h-9 rounded-lg text-sm font-medium transition-colors",
                p === current_page
                  ? "bg-[#00488C] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
              aria-current={p === current_page ? "page" : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Próxima */}
        <button
          onClick={() => onPageChange(current_page + 1)}
          disabled={!meta.has_next || disabled}
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
            meta.has_next && !disabled
              ? "hover:bg-gray-100 text-gray-600"
              : "text-gray-300 cursor-not-allowed"
          )}
          aria-label="Próxima página"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}