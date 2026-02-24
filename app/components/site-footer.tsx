import Link from "next/link"
import Image from "next/image"

export function SiteFooter() {
  return (
    <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center gap-5">
          {/* Logo */}
          <Image
            src="/images/super-mangas-logo.png"
            alt="Super Mangas"
            width={120}
            height={42}
            className="h-8 w-auto opacity-60"
          />

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/termos"
              className="text-xs text-[#666] transition-colors hover:text-foreground"
            >
              Termos de Uso
            </Link>
            <span className="text-[#333]">|</span>
            <Link
              href="/privacidade"
              className="text-xs text-[#666] transition-colors hover:text-foreground"
            >
              Politica de Privacidade
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-[#444]">
            {"© 2024 Super Mangas. Todos os direitos reservados."}
          </p>
        </div>
      </div>
    </footer>
  )
}
