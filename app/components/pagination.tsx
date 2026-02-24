"use client"

import { ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  function getVisiblePages() {
    const pages: number[] = []
    const start = Math.max(0, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <nav
      className="flex items-center justify-center gap-1.5 py-8"
      aria-label="Paginacao"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Pagina anterior"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {visiblePages[0] > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-sm text-foreground transition-colors hover:bg-border"
          >
            1
          </button>
          {visiblePages[0] > 1 && (
            <span className="px-1 text-muted-foreground">...</span>
          )}
        </>
      )}

      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors ${
            page === currentPage
              ? "border border-primary bg-primary text-primary-foreground"
              : "border border-border bg-secondary text-foreground hover:bg-border"
          }`}
          aria-current={page === currentPage ? "page" : undefined}
        >
          {page + 1}
        </button>
      ))}

      {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 2 && (
            <span className="px-1 text-muted-foreground">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-sm text-foreground transition-colors hover:bg-border"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-border disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Proxima pagina"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
