"use client"

import { use, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import useSWR from "swr"
import type { Chapter, Page as MangaPage } from "@/lib/api"
import { getPageImageSrc } from "@/lib/image-utils"

export default function ChapterReaderPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const chapterIdNum = parseInt(chapterId, 10)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [zoomLevel, setZoomLevel] = useState(1)

  const zoomIn = useCallback(() => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }, [])

  const zoomOut = useCallback(() => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }, [])

  const resetZoom = useCallback(() => {
    setZoomLevel(1)
  }, [])

  const { data: chapter, isLoading: chapterLoading } = useSWR<Chapter>(
    `/api/proxy/chapters/${chapterIdNum}`
  )

  const { data: pages, isLoading: pagesLoading } = useSWR<MangaPage[]>(
    `/api/proxy/pages/chapter/${chapterIdNum}/all`
  )

  const sortedPages = pages
    ? [...pages].sort((a, b) => a.pageNumber - b.pageNumber)
    : []

  const totalPages = sortedPages.length
  const currentPage = sortedPages[currentPageIndex]

  const goToPrev = useCallback(() => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const goToNext = useCallback(() => {
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1))
  }, [totalPages])

  // Reset zoom when page changes
  useEffect(() => {
    setZoomLevel(1)
  }, [currentPageIndex])

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goToPrev()
      if (e.key === "ArrowRight") goToNext()
      if (e.key === "+" || e.key === "=") zoomIn()
      if (e.key === "-") zoomOut()
      if (e.key === "0") resetZoom()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToPrev, goToNext, zoomIn, zoomOut, resetZoom])

  if (chapterLoading || pagesLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!chapter || !pages || pages.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">
          Capitulo nao encontrado
        </p>
        <Link
          href="/"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Voltar ao inicio
        </Link>
      </div>
    )
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-4">
      {/* Chapter Title */}
      <div className="mb-4 text-center">
        <h1 className="text-balance text-lg font-bold text-foreground sm:text-xl">
          {chapter.chapterNumber}
        </h1>
      </div>

      {/* Page Image with Zoom */}
      {currentPage && (
        <div
          className="relative mx-auto flex cursor-pointer items-center justify-center"
          onClick={goToNext}
          role="button"
          tabIndex={0}
          aria-label="Proxima pagina"
          onKeyDown={(e) => {
            if (e.key === "Enter") goToNext()
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getPageImageSrc(currentPage)}
            alt={`Pagina ${currentPageIndex + 1}`}
            className="h-auto max-w-full rounded-md border border-border object-contain transition-all duration-200"
            style={{
              maxHeight: `${85 * zoomLevel}vh`,
              width: zoomLevel > 1 ? `${zoomLevel * 100}%` : "auto",
            }}
          />
        </div>
      )}

      {/* Zoom Controls */}
      <div className="mt-3 flex items-center justify-center gap-2">
        <button
          onClick={zoomOut}
          disabled={zoomLevel <= 0.5}
          className="flex items-center justify-center rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Diminuir zoom"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          onClick={resetZoom}
          className="flex items-center justify-center rounded-md border border-border bg-card px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          aria-label="Resetar zoom"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={zoomIn}
          disabled={zoomLevel >= 3}
          className="flex items-center justify-center rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Aumentar zoom"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        {zoomLevel !== 1 && (
          <button
            onClick={resetZoom}
            className="ml-1 flex items-center justify-center rounded-md border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Voltar ao tamanho original"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation Controls */}
      <nav className="mt-4 flex items-center justify-center gap-4 rounded-lg bg-card px-4 py-3">
        <button
          onClick={goToPrev}
          disabled={currentPageIndex === 0}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Pagina Anterior</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            {currentPageIndex + 1}
          </span>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm font-bold text-foreground">
            {totalPages}
          </span>
        </div>

        <button
          onClick={goToNext}
          disabled={currentPageIndex >= totalPages - 1}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="hidden sm:inline">Proxima Pagina</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </nav>

      {/* Back to Manga */}
      <div className="mt-4 flex justify-center">
        <Link
          href={`/manga/${chapter.mangaId}`}
          className="rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Voltar ao manga
        </Link>
      </div>
    </main>
  )
}
