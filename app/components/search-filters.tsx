"use client"

import { Search, ChevronDown } from "lucide-react"

interface SearchFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onSearch: (query: string) => void
  sortOrder: string
  onSortChange: (sort: string) => void
  status: string
  onStatusChange: (status: string) => void
}

export function SearchFilters({
  searchQuery,
  onSearchChange,
  onSearch,
  sortOrder,
  onSortChange,
  status,
  onStatusChange,
}: SearchFiltersProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-5">
      {/* Search Bar */}
      <form onSubmit={handleSubmit} className="relative mb-4">
        <div className="relative overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#141414] transition-all duration-300 focus-within:border-primary/40 focus-within:shadow-[0_0_20px_rgba(220,38,38,0.1)]">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Buscar Mangas..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 w-full bg-transparent pl-12 pr-24 text-sm text-foreground placeholder:text-[#555] focus:outline-none"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_12px_rgba(220,38,38,0.3)]"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortOrder}
            onChange={(e) => onSortChange(e.target.value)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[#2a2a2a] bg-[#141414] pl-3 pr-8 text-xs font-medium text-[#ccc] transition-all focus:border-primary/40 focus:outline-none focus:ring-0 hover:border-[#444]"
          >
            <option value="id,desc">Mais Recentes</option>
            <option value="id,asc">Mais Antigos</option>
            <option value="title,asc">A - Z</option>
            <option value="title,desc">Z - A</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="h-9 cursor-pointer appearance-none rounded-lg border border-[#2a2a2a] bg-[#141414] pl-3 pr-8 text-xs font-medium text-[#ccc] transition-all focus:border-primary/40 focus:outline-none focus:ring-0 hover:border-[#444]"
          >
            <option value="">Todos Status</option>
            <option value="Em Lançamento">Em Lancamento</option>
            <option value="Completo">Completo</option>
            <option value="Pausado">Pausado</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#555]" />
        </div>
      </div>
    </div>
  )
}
