"use client"

import Link from "next/link"
import Image from "next/image"
import { Search, Menu, X, Flame, Clock, Home } from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`)
      setMobileMenuOpen(false)
    }
  }

  const navItems = [
    { href: "/", label: "Inicio", icon: Home },
    { href: "/?sort=popular", label: "Populares", icon: Flame },
    { href: "/?sort=recent", label: "Recentes", icon: Clock },
  ]

  return (
    <header className="header-smoke sticky top-0 z-50 border-b border-[#1f1f1f] bg-[#0a0a0a]">
      {/* Main bar */}
      <div className="relative z-10 mx-auto flex max-w-7xl items-center gap-4 px-4 py-2.5 lg:gap-8">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/super-mangas-logo.png"
            alt="Super Mangas"
            width={180}
            height={64}
            className="h-11 w-auto drop-shadow-[0_0_12px_rgba(220,38,38,0.3)] md:h-14"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === "/"
                ? pathname === "/" && !item.href.includes("sort")
                : false

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group flex items-center gap-1.5 rounded-lg px-3 py-2 font-serif text-lg tracking-wider uppercase transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-[#999] hover:bg-[#ffffff08] hover:text-foreground"
                }`}
              >
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-[#555] group-hover:text-primary"
                  }`}
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Spacer */}
        <div className="hidden flex-1 md:block" />

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className={`relative hidden transition-all duration-300 md:block ${
            searchFocused ? "w-72 lg:w-80" : "w-52 lg:w-60"
          }`}
        >
          <div
            className={`relative overflow-hidden rounded-full border transition-all duration-300 ${
              searchFocused
                ? "border-primary/50 bg-[#1a1a1a] shadow-[0_0_16px_rgba(220,38,38,0.15)]"
                : "border-[#2a2a2a] bg-[#141414]"
            }`}
          >
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                searchFocused ? "text-primary" : "text-[#555]"
              }`}
            />
            <input
              type="text"
              placeholder="Buscar mangas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="h-9 w-full bg-transparent pl-9 pr-4 text-sm text-foreground placeholder:text-[#555] focus:outline-none"
            />
          </div>
        </form>

        {/* Mobile buttons */}
        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen)
            }}
            className="rounded-lg p-2 text-[#888] transition-colors hover:bg-[#ffffff08] hover:text-foreground"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Expanded Menu */}
      {mobileMenuOpen && (
        <div className="relative z-10 border-t border-[#1a1a1a] bg-[#0a0a0a]/95 backdrop-blur-md md:hidden">
          {/* Mobile Search */}
          <div className="px-4 pt-4 pb-2">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative overflow-hidden rounded-full border border-[#2a2a2a] bg-[#141414]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#555]" />
                <input
                  type="text"
                  placeholder="Buscar mangas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="h-10 w-full bg-transparent pl-9 pr-4 text-sm text-foreground placeholder:text-[#555] focus:outline-none"
                />
              </div>
            </form>
          </div>

          {/* Mobile Nav */}
          <nav className="flex flex-col gap-0.5 px-3 py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#ffffff08]"
                >
                  <Icon className="h-4 w-4 text-[#555] group-hover:text-primary" />
                  <span className="font-serif text-lg tracking-wider uppercase text-[#ccc] group-hover:text-foreground">
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
