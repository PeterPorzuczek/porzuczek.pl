import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { getPortfolioData } from "@/lib/portfolio-data"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-mono",
})

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await getPortfolioData();
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: metadata.authors,
    generator: metadata.generator
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=UA-160110136-1"
        />
        <Script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-160110136-1');
            `,
          }}
        />
      </head>
      <body className={jetbrainsMono.className}>
        {children}
      </body>
    </html>
  )
}
