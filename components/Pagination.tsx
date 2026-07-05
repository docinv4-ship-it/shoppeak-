"use client";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showTotal?: number;
  perPage?: number;
}

export default function Pagination({ currentPage, totalPages, onPageChange, showTotal, perPage = 50 }: PaginationProps) {
  const capped = Math.min(totalPages, 200);
  const pages: (number | "...")[] = [];

  if (capped <= 7) {
    for (let i = 1; i <= capped; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(capped - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < capped - 2) pages.push("...");
    pages.push(capped);
  }

  const from = (currentPage - 1) * perPage + 1;
  const to = Math.min(currentPage * perPage, showTotal || currentPage * perPage);

  return (
    <div className="flex flex-col items-center gap-3 mt-8 mb-4">
      {showTotal !== undefined && (
        <p className="text-sm text-gray-500">
          Showing {from.toLocaleString()}–{to.toLocaleString()} of {showTotal.toLocaleString()} products
        </p>
      )}

      <div className="flex items-center gap-1">
        {/* First */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="First page"
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <ChevronLeft size={15} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} className="px-2 text-gray-400 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[36px] h-9 rounded-lg border text-sm font-medium transition-colors ${
                p === currentPage
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "border-gray-200 hover:bg-orange-50 hover:border-orange-300 text-gray-700"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= capped}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={15} />
        </button>

        {/* Last */}
        <button
          onClick={() => onPageChange(capped)}
          disabled={currentPage >= capped}
          className="p-2 rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Last page"
        >
          <ChevronsRight size={15} />
        </button>
      </div>

      {/* Page jump */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Page {currentPage} of {capped.toLocaleString()}</span>
        <span>•</span>
        <span>{perPage} per page</span>
      </div>
    </div>
  );
}
