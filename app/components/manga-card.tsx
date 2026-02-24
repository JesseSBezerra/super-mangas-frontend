"use client"

import Link from "next/link"
import type { Manga } from "@/lib/api"
import { getMangaCoverSrc } from "@/lib/image-utils"

interface MangaCardProps {
  manga: Manga
}

export function MangaCard({ manga }: MangaCardProps) {
  const coverSrc = getMangaCoverSrc(manga)

  return (
    <Link
      href={`/manga/${manga.id}`}
      className="group relative block overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={coverSrc}
          alt={manga.title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {/* Title overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2">
          <h3 className="line-clamp-2 text-xs font-bold text-white sm:text-sm">
            {manga.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

export function MangaCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="relative aspect-[3/4] w-full animate-pulse bg-secondary" />
    </div>
  )
}
