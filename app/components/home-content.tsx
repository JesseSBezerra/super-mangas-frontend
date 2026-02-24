"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import useSWR from "swr"
import type { Manga, PaginatedResponse } from "@/lib/api"
import { SearchFilters } from "@/components/search-filters"
import { MangaGrid } from "@/components/manga-grid"
import { Pagination } from "@/components/pagination"

export function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const initialSearch = searchParams.get("search") || ""
  const initialPage = parseInt(searchParams.get("page") || "0", 10)

  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [activeSearch, setActiveSearch] = useState(initialSearch)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [sortOrder, setSortOrder] = useState("id,desc")
  const [status, setStatus] = useState("")

  // Build URL using internal proxy to avoid CORS issues
  const apiUrl = activeSearch
    ? `/api/proxy/mangas/search?title=${encodeURIComponent(activeSearch)}&page=${currentPage}&size=15`
    : `/api/proxy/mangas?page=${currentPage}&size=15&sort=${sortOrder}`

  const { data, isLoading, error } = useSWR<PaginatedResponse<Manga>>(apiUrl)

  // Filter by status client-side (if API doesn't support it)
  const filteredMangas = data?.content
    ? status
      ? data.content.filter((m) => m.status === status)
      : data.content
    : []

  function handleSearch(query: string) {
    setActiveSearch(query)
    setCurrentPage(0)
    updateURL(query, 0)
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
    updateURL(activeSearch, page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleSortChange(sort: string) {
    setSortOrder(sort)
    setCurrentPage(0)
  }

  function handleStatusChange(newStatus: string) {
    setStatus(newStatus)
  }

  function updateURL(search: string, page: number) {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (page > 0) params.set("page", page.toString())
    const queryString = params.toString()
    router.push(queryString ? `/?${queryString}` : "/", { scroll: false })
  }

  // Sync search params back to state
  useEffect(() => {
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "0", 10)
    setSearchQuery(search)
    setActiveSearch(search)
    setCurrentPage(page)
  }, [searchParams])

  return (
    <main className="min-h-screen">
      <SearchFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        status={status}
        onStatusChange={handleStatusChange}
      />

      <div className="mx-auto max-w-7xl px-4 pb-8">
        {/* Section Title */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <h2 className="px-2 text-center font-serif text-2xl tracking-wider uppercase text-foreground sm:text-3xl md:text-4xl">
            {activeSearch
              ? `Resultados para "${activeSearch}"`
              : "Mangas Populares"}
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 text-center">
            <p className="text-sm text-primary">
              Erro ao carregar mangas. Verifique sua conexao com a API.
            </p>
          </div>
        )}

        {/* Manga Grid */}
        <MangaGrid mangas={filteredMangas} isLoading={isLoading} />

        {/* Pagination */}
        {data && (
          <Pagination
            currentPage={data.number}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </main>
  )
}
