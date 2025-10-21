"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import MarkdownsPeekViewer from '@/components/markdowns-peek-viewer'
import { useFreshData } from '@/hooks/use-fresh-data'

export default function NotFound() {
  const [data, setData] = useState<any>(null)
  const pathname = usePathname()

  // Fetch fresh data from GitHub after component mounts
  useFreshData(setData)

  useEffect(() => {
    // Allow scrolling on body
    document.body.style.overflow = ''
    document.body.style.height = ''
  }, [])

  if (!data) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        </div>
      </div>
    )
  }

  const blogConfig = data.sections?.blog?.markdownsPeek
  const articlesConfig = data.sections?.articles?.markdownsPeek

  // Determine which section we're in based on basePath
  const isBlogPath = blogConfig?.basePath && pathname?.startsWith(`/${blogConfig.basePath}`)
  const isArticlesPath = articlesConfig?.basePath && pathname?.startsWith(`/${articlesConfig.basePath}`)
  const currentBasePath = isBlogPath ? blogConfig?.basePath : isArticlesPath ? articlesConfig?.basePath : null
  const personalInfo = data.personalInfo

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F3F7]">
      
      {/* Header - sticky at top */}
      <header className="sticky top-0 p-4 md:p-8 border-b-2 bg-[#F3F3F7] flex-shrink-0 w-full z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl md:text-2xl font-black tracking-tight hover:opacity-80 transition-opacity inline-block">
            {personalInfo?.title}
            <div className="w-full h-0.5 holo-gradient mt-1"></div>
          </a>
          
          {currentBasePath && (
            <a 
              href={`/#${currentBasePath}`}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
            >
              <ChevronLeft size={20} />
              {currentBasePath}
            </a>
          )}
        </div>
      </header>

      {/* Viewers container - takes remaining height */}
      <div className="flex-1 w-full overflow-hidden relative">
        {/* Blog viewer - show only when on blog path */}
        {isBlogPath && blogConfig && (
          <div className="w-full h-[calc(100vh-70px)] md:h-[calc(100vh-104px)]">
            <MarkdownsPeekViewer
              containerId={blogConfig.containerId}
              owner={blogConfig.owner}
              repo={blogConfig.repo}
              path={blogConfig.path || ''}
              branch={blogConfig.branch || 'main'}
              theme={blogConfig.theme || 'dark'}
              token=""
              className={blogConfig.className}
              basePath={blogConfig.basePath}
              loadFirstFileAutomatically={true}
              hideFilesOnRoute={true}
              height="100%"
            />
          </div>
        )}

        {/* Articles viewer - show only when on articles path */}
        {isArticlesPath && articlesConfig && (
          <div className="w-full h-[calc(100vh-70px)] md:h-[calc(100vh-104px)]">
            <MarkdownsPeekViewer
              containerId={articlesConfig.containerId}
              owner={articlesConfig.owner}
              repo={articlesConfig.repo}
              path={articlesConfig.path || ''}
              branch={articlesConfig.branch || 'main'}
              theme={articlesConfig.theme || 'light'}
              token=""
              className={articlesConfig.className}
              basePath={articlesConfig.basePath}
              loadFirstFileAutomatically={true}
              hideFilesOnRoute={true}
              height="100%"
            />
          </div>
        )}

        {/* 404 message when no viewer matches */}
        {!isBlogPath && !isArticlesPath && (
          <div className="w-full flex items-center justify-center h-[calc(100vh-70px)] md:h-[calc(100vh-104px)]">
            <div className="text-center">
              <h1 className="text-9xl font-black mb-8 tracking-tight text-[#1C1B22]">404</h1>
              <a 
                href="/" 
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:opacity-70 transition-opacity"
              >
                <ChevronLeft size={20} />
                BACK
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

