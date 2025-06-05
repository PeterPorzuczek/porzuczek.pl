import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { metadata as portfolioMetadata } from "@/lib/portfolio-data"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: portfolioMetadata.title,
  description: portfolioMetadata.description,
  keywords: portfolioMetadata.keywords,
  authors: portfolioMetadata.authors,
  generator: portfolioMetadata.generator
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={jetbrainsMono.className}>{children}</body>
    </html>
  )
}
