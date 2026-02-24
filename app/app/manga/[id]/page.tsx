"use client"

import { use, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import useSWR from "swr"
import type { Manga, Chapter, Genre, PaginatedResponse } from "@/lib/api"
import { getMangaCoverSrc } from "@/lib/image-utils"
import { Pagination } from "@/components/pagination"

export default function MangaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const mangaId = parseInt(id, 10)
  const [chapterPage, setChapterPage] = useState(0)
  const chapterSize = 20

  const { data: manga, isLoading: mangaLoading } = useSWR<Manga>(
    `/api/proxy/mangas/${mangaId}`
  )

  const { data: genres } = useSWR<Genre[]>(
    `/api/proxy/genres/manga/${mangaId}`
  )

  const { data: chaptersData, isLoading: chaptersLoading } = useSWR<
    PaginatedResponse<Chapter>
  >(`/api/proxy/chapters/manga/${mangaId}?page=${chapterPage}&size=${chapterSize}`)

  if (mangaLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!manga) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">Manga nao encontrado</p>
        <Link
          href="/"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>
    )
  }

  const chapters = chaptersData?.content || []

  function handleChapterPageChange(page: number) {
    setChapterPage(page)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6">
      {/* Manga Info */}
      <div className="flex flex-col gap-6 sm:flex-row">
        {/* Cover */}
        <div className="mx-auto w-48 shrink-0 sm:mx-0 sm:w-56">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getMangaCoverSrc(manga)}
              alt={manga.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <h1 className="text-balance text-2xl font-bold text-foreground sm:text-3xl">
            {manga.title}
          </h1>

          {/* Genres */}
          {genres && genres.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{"Genero: "}</span>
                {genres.map((g) => g.name).join(", ")}
              </p>
            </div>
          )}

          {/* Status */}
          {manga.status && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{"Status: "}</span>
              {manga.status}
            </p>
          )}

          {/* Total Chapters */}
          {manga.totalChapters > 0 && (
            <p className="mt-1 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{"Total de Capitulos: "}</span>
              {manga.totalChapters}
            </p>
          )}

          {/* Synopsis */}
          {manga.synopsis && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {manga.synopsis}
            </p>
          )}
        </div>
      </div>

      {/* Chapters List */}
      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">Capitulos</h2>
          {chaptersData && chaptersData.totalElements > 0 && (
            <span className="text-xs text-muted-foreground">
              {chaptersData.totalElements} capitulos
            </span>
          )}
        </div>

        {chaptersLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 animate-pulse rounded-lg bg-secondary"
              />
            ))}
          </div>
        ) : chapters.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Nenhum capitulo disponivel
          </p>
        ) : (
          <>
            <div className="space-y-1.5">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/read/${chapter.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-primary/40 hover:bg-secondary"
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {chapter.chapterNumber}
                    </span>
                    <div className="flex items-center gap-3">
                      {chapter.chapterDate && (
                        <span className="text-xs text-muted-foreground">
                          {chapter.chapterDate}
                        </span>
                      )}
                      {chapter.totalPages > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {chapter.totalPages} paginas
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>

            {/* Chapter Pagination */}
            {chaptersData && chaptersData.totalPages > 1 && (
              <Pagination
                currentPage={chaptersData.number}
                totalPages={chaptersData.totalPages}
                onPageChange={handleChapterPageChange}
              />
            )}
          </>
        )}
      </section>

      {/* Back Button */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Voltar
        </Link>
      </div>
    </main>
  )
}
