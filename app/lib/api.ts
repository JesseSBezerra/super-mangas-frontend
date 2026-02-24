const API_URL = process.env.NEXT_PUBLIC_API_URL || ""

export interface Manga {
  id: number
  title: string
  synopsis: string
  imageUrl: string
  imagePath: string
  imageBase64?: string | null
  mangaLink: string
  status?: string
  createdAt: string
  updatedAt: string
  genres: Genre[]
  totalChapters: number
}

export interface Genre {
  id: number
  name: string
}

export interface Chapter {
  id: number
  mangaId: number
  chapterNumber: string
  chapterLink: string
  chapterDate: string
  createdAt: string
  totalPages: number
}

export interface Page {
  id: number
  pageNumber: number
  imageUrl: string
  imageData?: string | null
  chapterId: number
}

export interface PaginatedResponse<T> {
  content: T[]
  totalPages: number
  totalElements: number
  size: number
  number: number
  first: boolean
  last: boolean
  empty: boolean
}

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
  })
  if (!res.ok) {
    throw new Error(`API error: ${res.status}`)
  }
  return res.json()
}

export function getMangas(page = 0, size = 15, sort = "id,desc") {
  const url = `${API_URL}/api/mangas?page=${page}&size=${size}&sort=${sort}`
  return fetcher<PaginatedResponse<Manga>>(url)
}

export function searchMangas(title: string, page = 0, size = 15) {
  const url = `${API_URL}/api/mangas/search?title=${encodeURIComponent(title)}&page=${page}&size=${size}`
  return fetcher<PaginatedResponse<Manga>>(url)
}

export function getMangaById(id: number) {
  const url = `${API_URL}/api/mangas/${id}`
  return fetcher<Manga>(url)
}

export function getChaptersByMangaId(mangaId: number, page = 0, size = 20) {
  const url = `${API_URL}/api/chapters/manga/${mangaId}?page=${page}&size=${size}`
  return fetcher<PaginatedResponse<Chapter>>(url)
}

export function getAllChaptersByMangaId(mangaId: number) {
  const url = `${API_URL}/api/chapters/manga/${mangaId}/all`
  return fetcher<Chapter[]>(url)
}

export function getChapterById(id: number) {
  const url = `${API_URL}/api/chapters/${id}`
  return fetcher<Chapter>(url)
}

export function getPagesByChapterId(chapterId: number, page = 0, size = 50) {
  const url = `${API_URL}/api/pages/chapter/${chapterId}?page=${page}&size=${size}`
  return fetcher<PaginatedResponse<Page>>(url)
}

export function getAllPagesByChapterId(chapterId: number) {
  const url = `${API_URL}/api/pages/chapter/${chapterId}/all`
  return fetcher<Page[]>(url)
}

export function getGenresByMangaId(mangaId: number) {
  const url = `${API_URL}/api/genres/manga/${mangaId}`
  return fetcher<Genre[]>(url)
}

export function searchMangasByGenre(genre: string) {
  const url = `${API_URL}/api/genres/search?genre=${encodeURIComponent(genre)}`
  return fetcher<Manga[]>(url)
}

export function getMetadataByMangaId(mangaId: number) {
  const url = `${API_URL}/api/metadata/manga/${mangaId}`
  return fetcher<Record<string, string>[]>(url)
}

// SWR fetcher for client-side usage - uses internal proxy to avoid CORS
export const swrFetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return res.json()
  })

export { API_URL }
