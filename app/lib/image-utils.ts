import type { Manga, Page } from "@/lib/api"

/**
 * Returns the best image source for a manga cover.
 * Priority: imageBase64 (if not empty) > imageUrl
 */
export function getMangaCoverSrc(manga: Manga): string {
  if (manga.imageBase64 && manga.imageBase64.trim().length > 0) {
    if (manga.imageBase64.startsWith("data:")) {
      return manga.imageBase64
    }
    return `data:image/jpeg;base64,${manga.imageBase64}`
  }
  return manga.imageUrl || ""
}

/**
 * Returns the best image source for a chapter page.
 * Priority: imageData (if not empty) > imageUrl
 */
export function getPageImageSrc(page: Page): string {
  if (page.imageData && page.imageData.trim().length > 0) {
    if (page.imageData.startsWith("data:")) {
      return page.imageData
    }
    return `data:image/jpeg;base64,${page.imageData}`
  }
  return page.imageUrl || ""
}
