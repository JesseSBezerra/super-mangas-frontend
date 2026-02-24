"use client"

import { MangaCard, MangaCardSkeleton } from "@/components/manga-card"
import type { Manga } from "@/lib/api"

interface MangaGridProps {
  mangas: Manga[]
  isLoading: boolean
}

export function MangaGrid({ mangas, isLoading }: MangaGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <MangaCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (mangas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg font-medium text-muted-foreground">
          Nenhum manga encontrado
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Tente buscar com outros termos
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {mangas.map((manga) => (
        <MangaCard key={manga.id} manga={manga} />
      ))}
    </div>
  )
}
