import { useState, useEffect } from 'react'

export function useMarkdownsPeek() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if library is already loaded
    if (typeof window !== 'undefined' && window.MarkdownsPeek) {
      setIsLoaded(true)
      return
    }

    // Load the library if not already loaded
    const loadLibrary = async () => {
      setIsLoading(true)
      
      try {
        // Load the script dynamically
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/markdowns-peek@1.0.15/dist/markdowns-peek.js'
        script.async = true
        
        script.onload = () => {
          setIsLoaded(true)
          setIsLoading(false)
        }
        
        script.onerror = () => {
          console.error('Failed to load MarkdownsPeek library')
          setIsLoading(false)
        }
        
        document.head.appendChild(script)
      } catch (error) {
        console.error('Error loading MarkdownsPeek library:', error)
        setIsLoading(false)
      }
    }

    loadLibrary()
  }, [])

  return { isLoaded, isLoading }
} 