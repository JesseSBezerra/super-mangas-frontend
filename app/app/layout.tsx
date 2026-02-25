import type { Metadata, Viewport } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SWRProvider } from "@/components/swr-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _bebasNeue = Bebas_Neue({ weight: "400", subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Super Mangas - Leia Mangas Online",
  description:
    "Leia seus mangas favoritos online gratuitamente. Catalogo atualizado com os melhores titulos.",
  verification: {
    google: "TzEpZGLTIscNQCk_Ikf7PgXmwvXIsc67xXrjNsXG9Ac",
  },
  icons: {
    icon: "/images/super-mangas.ico",
    apple: "/images/super-mangas.ico",
  },
}

export const viewport: Viewport = {
  themeColor: "#1a1a1a",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <SWRProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </SWRProvider>
        <Analytics />
      </body>
    </html>
  )
}
