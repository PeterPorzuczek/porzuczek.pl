"use client"

import { useEffect, useRef } from 'react'
import { useMarkdownsPeek } from '@/hooks/use-markdowns-peek'

interface MarkdownsPeekViewerProps {
  containerId: string
  owner: string
  repo: string
  path?: string
  branch?: string
  theme?: 'light' | 'dark'
  token?: string
  disableStyles?: boolean
  className?: string,
  loadFirstFileAutomatically?: boolean,
  hideFilesOnRoute?: boolean,
  basePath?: string,
  height?: string
}

declare global {
  interface Window {
    MarkdownsPeek: any
  }
}

export default function MarkdownsPeekViewer({
  containerId,
  owner,
  repo,
  path = '',
  branch = 'main',
  theme = 'light',
  token = '',
  disableStyles = false,
  className = '',
  loadFirstFileAutomatically = false,
  hideFilesOnRoute = false,
  basePath = '',
  height = '600px',
}: MarkdownsPeekViewerProps) {
  const { isLoaded, isLoading } = useMarkdownsPeek()
  const viewerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoaded) return

    // Initialize the viewer
    viewerRef.current = new window.MarkdownsPeek({
      containerId,
      owner,
      repo,
      path,
      branch,
      theme,
      token,
      disableStyles,
      loadFirstFileAutomatically,
      hideFilesOnRoute,
      basePath,
      height
    })

    return () => {
      if (viewerRef.current && typeof viewerRef.current.destroy === 'function') {
        viewerRef.current.destroy()
      }
    }
  }, [isLoaded, containerId, owner, repo, path, branch, theme, token, disableStyles, loadFirstFileAutomatically, hideFilesOnRoute, basePath, height])

  useEffect(() => {
    if (isLoaded && viewerRef.current && typeof viewerRef.current.setRepository === 'function') {
      viewerRef.current.setRepository(owner, repo, { path, branch })
    }
  }, [isLoaded, owner, repo, path, branch])

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center p-8`}>
        <div className="text-center">
          <p className="text-red-600">Error</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      id={containerId} 
      ref={containerRef}
      className={className}
    />
  )
} 