"use client"

import { useState, useEffect, useRef } from "react"
import { Github, Linkedin, Instagram, ExternalLink, ArrowUpRight, ChevronUp, Menu, X } from "lucide-react"
import MarkdownsPeekViewer from './markdowns-peek-viewer'
import { useFreshData } from '@/hooks/use-fresh-data'

export default function PortfolioClient({ data: initialData }: { data: any }) {
  const [data, setData] = useState(initialData);
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [displayedPhotos, setDisplayedPhotos] = useState<any[]>([])
  const [photoTransition, setPhotoTransition] = useState(true)
  const [shuffledProjects, setShuffledProjects] = useState<any[]>([])
  const [mobileHeroPhoto, setMobileHeroPhoto] = useState<any>(null)
  const [mobilePhotoTransition, setMobilePhotoTransition] = useState(true)
  const [activeWorkIndex, setActiveWorkIndex] = useState(0)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const workScrollRef = useRef<HTMLDivElement>(null)
  const projectScrollRef = useRef<HTMLDivElement>(null)

  // Fetch fresh data from GitHub after component mounts
  useFreshData(setData)

    const {
    personalInfo,
    socialLinks,
    photos,
    projects,
    workExperience,
    navigation,
    contactInfo,
    loadingScreen,
    sections
  } = data;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const checkFonts = async () => {
      if ('fonts' in document) {
        await document.fonts.ready
        setFontsLoaded(true)
      } else {
        // Fallback for browsers without document.fonts
        setTimeout(() => setFontsLoaded(true), 1000)
      }
    }
    
    checkFonts()
  }, [])

  // Scroll to hash section after page loads (from 404 redirect)
  useEffect(() => {
    if (!fontsLoaded) return

    const hash = window.location.hash
    if (hash) {
      // Wait a bit for content to render
      setTimeout(() => {
        const elementId = hash.replace('#', '')
        const element = document.getElementById(elementId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [fontsLoaded])

  // Initialize and rotate photos
  useEffect(() => {
    if (!photos || photos.length === 0) return;
    
    // Initialize with first 4 photos
    if (displayedPhotos.length === 0) {
      setDisplayedPhotos(photos.slice(0, 4));
      return;
    }
    
    // Rotate photos every 5 seconds
    const interval = setInterval(() => {
      setPhotoTransition(false);
      
      setTimeout(() => {
        setDisplayedPhotos(prevPhotos => {
          const allPhotos = [...photos];
          const newPhotos = [];
          
          // Get 4 random photos that are different from current ones
          while (newPhotos.length < 4 && allPhotos.length > 0) {
            const randomIndex = Math.floor(Math.random() * allPhotos.length);
            newPhotos.push(allPhotos.splice(randomIndex, 1)[0]);
          }
          
          return newPhotos;
        });
        setPhotoTransition(true);
      }, 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [photos, displayedPhotos.length])

  // Shuffle projects only once on mount
  useEffect(() => {
    if (!projects || projects.length === 0) return;
    
    // Shuffle projects array using Fisher-Yates algorithm
    const shuffled = [...projects];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    setShuffledProjects(shuffled);
  }, [projects])

  // Mobile hero photo rotation
  useEffect(() => {
    if (!photos || photos.length === 0) return;
    
    // Initialize with first photo
    if (!mobileHeroPhoto) {
      setMobileHeroPhoto(photos[0]);
      return;
    }
    
    // Rotate photo every 5 seconds
    const interval = setInterval(() => {
      setMobilePhotoTransition(false);
      
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * photos.length);
        setMobileHeroPhoto(photos[randomIndex]);
        setMobilePhotoTransition(true);
      }, 300);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [photos, mobileHeroPhoto])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const scrollToWorkItem = (index: number) => {
    const container = workScrollRef.current
    if (!container) return
    
    const items = container.querySelectorAll('a')
    const item = items[index]
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  const scrollToProjectItem = (index: number) => {
    const container = projectScrollRef.current
    if (!container) return
    
    const items = container.querySelectorAll('a')
    const item = items[index]
    if (item) {
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }

  // Track active work item on scroll
  useEffect(() => {
    const container = workScrollRef.current
    if (!container) return

    const handleScroll = () => {
      const items = container.querySelectorAll('a')
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      items.forEach((item: Element, index: number) => {
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.left + itemRect.width / 2
        const distance = Math.abs(itemCenter - containerCenter)
        
        if (distance < itemRect.width / 2) {
          setActiveWorkIndex(index)
        }
      })
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [workExperience])

  // Track active project item on scroll
  useEffect(() => {
    const container = projectScrollRef.current
    if (!container) return

    const handleScroll = () => {
      const items = container.querySelectorAll('a')
      const containerRect = container.getBoundingClientRect()
      const containerCenter = containerRect.left + containerRect.width / 2

      items.forEach((item: Element, index: number) => {
        const itemRect = item.getBoundingClientRect()
        const itemCenter = itemRect.left + itemRect.width / 2
        const distance = Math.abs(itemCenter - containerCenter)
        
        if (distance < itemRect.width / 2) {
          setActiveProjectIndex(index)
        }
      })
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [shuffledProjects])

  if (!fontsLoaded) {
    return (
      <div className="min-h-screen bg-[#F3F3F7] flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold mb-4">{loadingScreen.title}</div>
          <div className="w-24 h-0.5 bg-gray-300 mx-auto mb-2"></div>
          <div className="text-sm font-medium text-gray-600">{loadingScreen.text}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F3F7] text-[#1C1B22] relative">


      {/* Header */}
      <header id="header" className="holo-header p-4 md:p-8 border-b-2 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-xl md:text-2xl font-black tracking-tight relative hover:opacity-80 transition-opacity">
            {personalInfo.title}
            <div className="absolute -bottom-1 left-0 w-full h-0.5 holo-gradient"></div>
          </a>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            {navigation.map((item: any) => (
              <a key={item.name} href={item.href} className="relative group text-gray-700 hover:text-[#1C1B22] transition-colors duration-200">
                {item.name}
                <div className="absolute -bottom-1 left-0 w-full h-px bg-gray-300 group-hover:bg-[#1C1B22] transition-all duration-200"></div>
              </a>
            ))}
          </nav>
          <button 
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[#F3F3F7] z-50 md:hidden">
          <div className="flex justify-between items-center p-4 border-b-2 border-[#1C1B22]">
            <a href="/" className="text-xl font-black tracking-tight">
              {personalInfo.title}
            </a>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col p-4 space-y-4">
            {navigation.map((item: any) => (
              <a 
                key={item.name} 
                href={item.href} 
                className="text-lg font-medium py-2 border-b border-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Hero */}
      <section id="hero" className="holo-hero px-4 py-8 md:px-8 md:py-36 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-6 md:space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h1 className="text-[2.75rem] sm:text-5xl md:text-8xl font-black leading-none mb-4 md:mb-6 tracking-tighter relative">
                  {sections?.hero?.title?.first}
                  <br />
                  <span className="holo-text">{sections?.hero?.title?.second}</span>
                </h1>
              </div>

                 {/* Mobile hero photo - rotating */}
                 <a
                   href={socialLinks.instagram.url}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="lg:hidden relative cursor-pointer group block flex-shrink-0 w-[7.5rem] h-[7.5rem] sm:w-40 sm:h-40 md:w-80 md:h-80"
                 >
                  <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-[#667eea] group-hover:shadow-lg transition-all duration-300 w-full h-full">
                    <img
                      src={mobileHeroPhoto?.url}
                      alt={mobileHeroPhoto?.caption}
                      className={`w-full h-full object-cover transition-opacity duration-500 ${mobilePhotoTransition ? "opacity-100" : "opacity-0"}`}
                    />
                    <div className="absolute inset-0 holo-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </div>
                </a>
              </div>

              <div className="space-y-3 md:space-y-4 text-base md:text-lg leading-relaxed max-w-lg">
                 {personalInfo.bio.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="text-base md:text-lg font-semibold space-y-2">
                 {personalInfo.roles.map((role: string, index: number) => (
                  <div key={index} className="relative pl-6 flex items-center">
                    {role}
                    <div className={`absolute left-0 w-2 h-2 holo-dot${index === 0 ? '' : `-${index + 1}`}`}></div>
                  </div>
                ))}
              </div>

              <div className="flex gap-5 pt-3 md:pt-4">
                <a href={socialLinks.github.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 relative group">
                  <Github size={24} />
                  <div className="absolute -inset-2 holo-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </a>
                <a href={socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 relative group">
                  <Linkedin size={24} />
                  <div className="absolute -inset-2 holo-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </a>
                <a href={socialLinks.instagram.url} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 relative group">
                  <Instagram size={24} />
                  <div className="absolute -inset-2 holo-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </a>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="space-y-6">
              <div className="mb-6 flex justify-between items-end">
                <h3 className="text-2xl font-bold tracking-tight relative">
                  {sections?.photos?.title?.first} <span className="holo-text-life">{sections?.photos?.title?.second}</span>
                  <div className="absolute -bottom-2 left-0 w-16 h-1 holo-gradient-life"></div>
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <a
                    key={index}
                    href={socialLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative cursor-pointer group block transition-transform duration-300 hover:-translate-y-1 ${index === 1 ? "mt-8" : ""} ${index === 2 ? "-mt-8" : ""}`}
                  >
                    <div className="relative overflow-hidden rounded-lg border border-gray-200 group-hover:border-[#667eea] group-hover:shadow-lg transition-all duration-300">
                      <div className="relative w-full h-64 overflow-hidden">
                        <img
                          src={displayedPhotos[index]?.url}
                          alt={displayedPhotos[index]?.caption}
                          className={`w-full h-full object-cover transition-opacity duration-500 ${photoTransition ? "opacity-100" : "opacity-0"}`}
                        />
                      </div>
                      <div className="absolute inset-0 holo-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      
                      {/* Photo caption - minimal style */}
                      <div className={`absolute bottom-2 left-2 bg-[#F3F3F7]/90 backdrop-blur-sm text-[#1C1B22] px-2 py-1 text-[10px] font-medium rounded transition-opacity duration-500 ${photoTransition ? "opacity-100" : "opacity-0"}`}>
                        {displayedPhotos[index]?.caption}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog */}
      {sections?.blog?.enabled && sections.blog.markdownsPeek?.repo && (
        <section id="blog" className="px-4 py-12 md:px-8 md:py-24 border-t-2 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight relative">
              {sections?.blog?.title?.first} <span className="holo-text-blog">{sections?.blog?.title?.second}</span>
              <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-blog"></div>
            </h2>

            <div className="bg-[#F3F3F7] overflow-hidden border border-gray-200 rounded-lg p-6 md:p-8">
              <MarkdownsPeekViewer
                containerId={sections.blog.markdownsPeek.containerId}
                owner={sections.blog.markdownsPeek.owner}
                repo={sections.blog.markdownsPeek.repo}
                path={sections.blog.markdownsPeek.path}
                branch={sections.blog.markdownsPeek.branch}
                theme={sections.blog.markdownsPeek.theme}
                token={sections.blog.markdownsPeek.token}
                className={sections.blog.markdownsPeek.className}
                basePath={sections.blog.markdownsPeek.basePath}
              />
              <div className="relative w-100 h-1 holo-gradient-blog"></div>
              </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {sections.blog.subtitle}
              </p>
              <a
                href={`${socialLinks.github.url}/${sections.blog.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline relative group"
              >
                {sections.blog.githubButtonText}
                <ExternalLink size={16} />
                <div className="absolute -inset-2 holo-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Work Experience */}
      <section id="work" className="px-4 py-12 md:px-8 md:py-24 border-t-2 relative z-10">
        <div className="max-w-7xl mx-auto">
                      <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight relative">
            {sections?.work?.title?.first} <span className="holo-text-experience">{sections?.work?.title?.second}</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-experience"></div>
          </h2>

          {/* Mobile: Horizontal carousel */}
          <div className="md:hidden -mx-4">
            <div ref={workScrollRef} className="overflow-x-auto overflow-y-visible pb-8 snap-x snap-mandatory scroll-smooth scrollbar-hide">
              <div className="flex gap-4 pl-4 pr-4 py-2">
                 {workExperience.map((job: any, index: number) => (
                  <a 
                    key={index} 
                    href={socialLinks.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative group cursor-pointer transition-all duration-300 flex-shrink-0 w-[85vw] snap-center"
                  >
                  <div className="bg-[#fbfbfb] border-2 border-[#1C1B22]/10 group-hover:border-[#667eea] rounded-lg p-6 hover:shadow-xl transition-all duration-300 relative h-[300px]">
                  {/* Period badge - subtle */}
                  <div className="absolute -top-3 -right-3 bg-[#1C1B22]/90 text-[#F3F3F7] px-3 py-1.5 text-[10px] font-bold tracking-wider z-10 rounded shadow-md">
                    {job.period}
                  </div>
                  
                  <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6">
                    {/* Mobile: Position first with company */}
                    <div className="md:col-span-2 md:order-2">
                      {/* Position with dot and company on mobile */}
                      <div className="flex items-start gap-3 mb-2">
                        {/* Colored dot accent - inline on mobile */}
                        <div className={`w-3 h-3 mt-1.5 ${job.accent} group-hover:scale-150 transition-transform duration-300 rounded-full flex-shrink-0`}></div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold font-karrik text-[#1C1B22] leading-tight">
                            {job.position}
                          </h3>
                          {/* Company on mobile - shown inline */}
                          <div className="text-sm font-semibold text-gray-700 md:hidden mt-1">
                            {job.company}
                          </div>
                        </div>
                      </div>
                      
                      {/* Gradient separator line */}
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] mb-3 ml-6 md:ml-0 group-hover:w-24 transition-all duration-500"></div>
                      
                      {/* Description */}
                      <p className="text-xs md:text-sm leading-relaxed text-gray-600 ml-6 md:ml-0">
                        {job.description}
                      </p>
                    </div>
                    
                    {/* Left column - Company on desktop */}
                    <div className="hidden md:flex md:col-span-1 md:order-1 flex-col justify-between">
                      {/* Company name - same size as before */}
                      <div className="text-sm md:text-base font-semibold text-gray-700">
                        {job.company}
                      </div>
                    </div>
                    
                    {/* Right column - technologies */}
                    <div className="md:col-span-1 md:order-3 flex flex-col justify-between ml-6 md:ml-0">
                      <div className="text-xs font-medium text-gray-500 leading-relaxed">
                        {job.technologies}
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex items-center gap-1 text-[#1C1B22] group-hover:text-[#667eea] transition-colors mt-4 md:mt-0">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
                ))}
              </div>
            </div>
            
            {/* Scroll indicator dots */}
            <div className="flex justify-center gap-2 mt-2">
               {workExperience.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => scrollToWorkItem(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeWorkIndex === index 
                      ? 'bg-[#667eea] w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to work experience ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop: Vertical list */}
          <div className="hidden md:block space-y-6">
                 {workExperience.map((job: any, index: number) => (
              <a 
                key={index} 
                href={socialLinks.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-[#fbfbfb] border-2 border-[#1C1B22]/10 group-hover:border-[#667eea] rounded-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300 relative min-h-[220px]">
                  {/* Period badge - subtle */}
                  <div className="absolute -top-3 -right-3 bg-[#1C1B22]/90 text-[#F3F3F7] px-3 py-1.5 text-[10px] font-bold tracking-wider z-10 rounded shadow-md">
                    {job.period}
                  </div>
                  
                  <div className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-6">
                    {/* Mobile: Position first with company */}
                    <div className="md:col-span-2 md:order-2">
                      {/* Position with dot and company on mobile */}
                      <div className="flex items-start gap-3 mb-2">
                        {/* Colored dot accent - inline on mobile */}
                        <div className={`w-3 h-3 mt-1.5 ${job.accent} group-hover:scale-150 transition-transform duration-300 rounded-full flex-shrink-0`}></div>
                        
                        <div className="flex-1">
                          <h3 className="text-lg md:text-xl font-bold font-karrik text-[#1C1B22] leading-tight">
                    {job.position}
                  </h3>
                          {/* Company on mobile - shown inline */}
                          <div className="text-sm font-semibold text-gray-700 md:hidden mt-1">
                    {job.company}
                  </div>
                        </div>
                      </div>
                      
                      {/* Gradient separator line */}
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] mb-3 ml-6 md:ml-0 group-hover:w-24 transition-all duration-500"></div>
                      
                      {/* Description */}
                      <p className="text-xs md:text-sm leading-relaxed text-gray-600 ml-6 md:ml-0">
                    {job.description}
                  </p>
                    </div>
                    
                    {/* Left column - Company on desktop */}
                    <div className="hidden md:flex md:col-span-1 md:order-1 flex-col justify-between">
                      {/* Company name - same size as before */}
                      <div className="text-sm md:text-base font-semibold text-gray-700">
                        {job.company}
                      </div>
                    </div>
                    
                    {/* Right column - technologies */}
                    <div className="md:col-span-1 md:order-3 flex flex-col justify-between ml-6 md:ml-0">
                      <div className="text-xs font-medium text-gray-500 leading-relaxed">
                        {job.technologies}
                      </div>
                      
                      {/* Arrow indicator */}
                      <div className="flex items-center gap-1 text-[#1C1B22] group-hover:text-[#667eea] transition-colors mt-4 md:mt-0">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      {sections?.articles?.enabled && sections.articles.markdownsPeek?.repo && (
        <section id="articles" className="px-4 py-12 md:px-8 md:py-24 border-t-2 relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight relative">
              {sections?.articles?.title?.first} <span className="holo-text-articles">{sections?.articles?.title?.second}</span>
              <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-articles"></div>
            </h2>

            <div className="bg-[#F3F3F7] overflow-hidden border border-gray-200 rounded-lg p-6 md:p-8">
              <MarkdownsPeekViewer
                containerId={sections.articles.markdownsPeek.containerId}
                owner={sections.articles.markdownsPeek.owner}
                repo={sections.articles.markdownsPeek.repo}
                path={sections.articles.markdownsPeek.path}
                branch={sections.articles.markdownsPeek.branch}
                theme={sections.articles.markdownsPeek.theme}
                token={sections.articles.markdownsPeek.token}
                className={sections.articles.markdownsPeek.className}
                basePath={sections.articles.markdownsPeek.basePath}
              />
              <div className="relative w-100 h-1 holo-gradient-articles"></div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">
                {sections.articles.subtitle}
              </p>
              <a
                href={`${socialLinks.github.url}/${sections.articles.githubLink}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline relative group"
              >
                {sections.articles.githubButtonText}
                <ExternalLink size={16} />
                <div className="absolute -inset-2 holo-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Projects */}
      <section id="projects" className="px-8 py-16 md:py-24 border-t-2 relative z-10">
        <div className="max-w-7xl mx-auto">
                      <h2 className="text-3xl md:text-4xl font-black mb-12 tracking-tight relative">
            {sections?.projects?.title?.first} <span className="holo-text-projects">{sections?.projects?.title?.second}</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-projects"></div>
          </h2>

          {/* Mobile: Horizontal carousel */}
          <div className="md:hidden -mx-8">
            <div ref={projectScrollRef} className="overflow-x-auto overflow-y-visible pb-8 snap-x snap-mandatory scroll-smooth scrollbar-hide">
              <div className="flex gap-4 pl-8 pr-8 py-2">
                {shuffledProjects.map((project, index) => (
                  <a
                    key={index}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group relative overflow-hidden rounded-lg border-2 border-gray-200 group-hover:border-[#667eea] transition-all duration-300 h-[280px] w-[85vw] flex-shrink-0 snap-center"
                  >
                {/* Background Image */}
                {project.image && (
                  <div className="absolute inset-0">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90"></div>
                  </div>
                )}
                
                {/* Content overlay */}
                <div className="relative z-10 h-full p-5 flex flex-col">
                  {/* Top section */}
                  <div className="flex justify-between items-start mb-auto">
                    {/* Subtle quotation mark */}
                    <div className="text-white/40 text-4xl font-black leading-none select-none">"</div>
                    
                    {/* Year badge */}
                    <div className="bg-[#1C1B22]/80 backdrop-blur-sm text-[#F3F3F7] px-3 py-1 text-[9px] font-bold tracking-widest rounded border border-gray-700">
                      {project.year}
                    </div>
                  </div>
                  
                  {/* Bottom section with content */}
                  <div className="mt-auto">
                    {/* Project name */}
                    <h3 className="text-lg font-bold font-karrik mb-2 text-[#F3F3F7] leading-tight">
                      {project.name}
                    </h3>
                    
                    {/* Gradient separator */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] mb-3 group-hover:w-20 transition-all duration-300"></div>
                    
                    {/* Description */}
                    <p className="text-xs mb-3 leading-relaxed text-gray-300">
                      {project.description}
                    </p>
                    
                    {/* Tech with arrow */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                        {project.tech}
                      </div>
                      <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#667eea] transition-colors duration-300" />
                    </div>
                    
                    {/* Gradient line at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </div>
              </a>
                ))}
              </div>
            </div>
            
            {/* Scroll indicator dots */}
            <div className="flex justify-center gap-2 mt-2">
              {shuffledProjects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToProjectItem(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    activeProjectIndex === index 
                      ? 'bg-[#667eea] w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Desktop: Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shuffledProjects.map((project, index) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-hidden rounded-lg border-2 border-gray-200 group-hover:border-[#667eea] transition-all duration-300 hover:-translate-y-1 h-[280px]"
              >
                {/* Background Image */}
                {project.image && (
                  <div className="absolute inset-0">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-black/90"></div>
                  </div>
                )}
                
                {/* Content overlay */}
                <div className="relative z-10 h-full p-5 flex flex-col">
                  {/* Top section */}
                  <div className="flex justify-between items-start mb-auto">
                    {/* Subtle quotation mark */}
                    <div className="text-white/40 text-4xl font-black leading-none select-none">"</div>
                    
                    {/* Year badge */}
                    <div className="bg-[#1C1B22]/80 backdrop-blur-sm text-[#F3F3F7] px-3 py-1 text-[9px] font-bold tracking-widest rounded border border-gray-700">
                      {project.year}
                    </div>
                  </div>
                  
                  {/* Bottom section with content */}
                  <div className="mt-auto">
                    {/* Project name */}
                    <h3 className="text-lg font-bold font-karrik mb-2 text-[#F3F3F7] leading-tight">
                      {project.name}
                    </h3>
                    
                    {/* Gradient separator */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] mb-3 group-hover:w-20 transition-all duration-300"></div>
                    
                    {/* Description */}
                    <p className="text-xs mb-3 leading-relaxed text-gray-300">
                      {project.description}
                    </p>
                    
                    {/* Tech with arrow */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    {project.tech}
                      </div>
                      <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#667eea] transition-colors duration-300" />
                    </div>
                    
                    {/* Gradient line at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href={socialLinks.github.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:underline relative group"
            >
              {sections?.projects?.githubButtonText}
              <ExternalLink size={16} />
              <div className="absolute -inset-2 holo-glow opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-8 py-16 md:py-24 border-t-2 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase tracking-tighter relative">
                {sections?.contact?.title?.first} <span className="holo-text-together">{sections?.contact?.title?.second}</span>
                <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-together"></div>
              </h2>
              <p className="text-base md:text-lg leading-relaxed mb-8">
                {contactInfo.description}
              </p>
              <div className="space-y-4">
                <a href={`mailto:${personalInfo.email}`} className="block text-sm md:text-base font-medium relative group hover:underline flex items-center pl-6">
                  {personalInfo.email}
                  <div className="absolute left-0 w-2 h-2 holo-dot group-hover:scale-150 transition-transform duration-300"></div>
                </a>
                <div className="text-sm md:text-base font-medium text-gray-700 relative group flex items-center pl-6">
                  {personalInfo.location}
                  <div className="absolute left-0 w-2 h-2 holo-dot-2 group-hover:scale-150 transition-transform duration-300"></div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4 relative">
                  {sections?.socialLinks?.title?.first} <span className="holo-text-links">{sections?.socialLinks?.title?.second}</span>
                  <div className="absolute -bottom-1 left-0 w-16 h-0.5 holo-gradient-links"></div>
                </h3>
                <div className="space-y-2">
                  <a
                    href={socialLinks.github.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-bold uppercase tracking-wider hover:underline relative group flex items-center pl-6"
                  >
                    {socialLinks.github.display}
                    <div className="absolute left-0 w-2 h-2 holo-dot"></div>
                  </a>
                  <a
                    href={socialLinks.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-bold uppercase tracking-wider hover:underline relative group flex items-center pl-6"
                  >
                    {socialLinks.linkedin.display}
                    <div className="absolute left-0 w-2 h-2 holo-dot-2"></div>
                  </a>
                  <a
                    href={socialLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-bold uppercase tracking-wider hover:underline relative group flex items-center pl-6"
                  >
                    {socialLinks.instagram.display}
                    <div className="absolute left-0 w-2 h-2 holo-dot-3"></div>
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4 relative">
                  {sections?.currentStatus?.title?.first} <span className="holo-text-status">{sections?.currentStatus?.title?.second}</span>
                  <div className="absolute -bottom-1 left-0 w-16 h-0.5 holo-gradient-status"></div>
                </h3>
                <div className="text-sm font-bold uppercase tracking-wider relative flex items-center pl-6">
                  {personalInfo.status}
                  <div className="absolute left-0 w-2 h-2 holo-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="holo-footer px-8 py-16 md:py-20 border-t-2 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm font-medium text-gray-600">{contactInfo.footer.copyright}</div>
          <div className="text-sm font-medium text-gray-500">TO INFINITY AND <span className="font-bold text-[#1C1B22]">BEYOND</span></div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-[#1C1B22] text-[#F3F3F7] border-2 hover:bg-[#F3F3F7] hover:text-[#1C1B22] transition-all duration-300 z-50 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} className="group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 holo-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      )}
    </div>
  )
} 