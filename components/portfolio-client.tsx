"use client"

import { useState, useEffect } from "react"
import { Github, Linkedin, Instagram, ExternalLink, ArrowUpRight, ChevronUp, Menu, X } from "lucide-react"
import MarkdownsPeekViewer from './markdowns-peek-viewer'

export default function PortfolioClient({ data: initialData }: { data: any }) {
  const [data, setData] = useState(initialData);
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [displayedPhotos, setDisplayedPhotos] = useState<any[]>([])
  const [photoTransition, setPhotoTransition] = useState(true)
  const [shuffledProjects, setShuffledProjects] = useState<any[]>([])

  // Fetch fresh data from GitHub after component mounts
  useEffect(() => {
    const fetchFreshData = async () => {
      try {
        const remoteDataUrl = `https://raw.githubusercontent.com/PeterPorzuczek/porzuczek.pl/refs/heads/main/public/portfolio-data.json?v=${new Date().getTime()}`;
        const response = await fetch(remoteDataUrl);
        if (response.ok) {
          const freshData = await response.json();
          // Update copyright year
          if (freshData?.contactInfo?.footer) {
            freshData.contactInfo.footer.copyright = `© ${new Date().getFullYear()} PIOTR PORZUCZEK`;
          }
          setData(freshData);
          console.log('Successfully fetched fresh data from GitHub.');
        } else {
          console.warn('Failed to fetch fresh data, using initial data.');
        }
      } catch (error) {
        console.warn('Error fetching fresh data, using initial data:', error);
      }
    };

    fetchFreshData();
  }, []);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

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
            {navigation.map((item) => (
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
            {navigation.map((item) => (
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
      <section id="hero" className="holo-hero px-4 py-12 md:px-8 md:py-36 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-8xl font-black leading-none mb-6 tracking-tighter relative">
                  {sections?.hero?.title?.first}
                  <br />
                  <span className="holo-text">{sections?.hero?.title?.second}</span>
                </h1>
              </div>

              <div className="space-y-4 text-base md:text-lg leading-relaxed max-w-lg">
                {personalInfo.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="text-lg font-semibold space-y-2">
                {personalInfo.roles.map((role, index) => (
                  <div key={index} className="relative pl-6 flex items-center">
                    {role}
                    <div className={`absolute left-0 w-2 h-2 holo-dot${index === 0 ? '' : `-${index + 1}`}`}></div>
                  </div>
                ))}
              </div>

              <div className="flex gap-6 pt-4">
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

          <div className="space-y-6">
            {workExperience.map((job, index) => (
              <a 
                key={index} 
                href={socialLinks.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative group cursor-pointer transition-all duration-300 hover:-translate-y-1"
              >
                <div className="bg-white border-2 border-gray-200 group-hover:border-[#667eea] rounded-lg p-6 md:p-8 hover:shadow-xl transition-all duration-300 relative">
                  {/* Period badge - subtle */}
                  <div className="absolute -top-3 -right-3 bg-[#1C1B22] text-[#F3F3F7] px-3 py-1.5 text-[10px] font-bold tracking-wider z-10 rounded shadow-md">
                    {job.period}
                  </div>
                  
                  <div className="grid md:grid-cols-4 gap-4 md:gap-6">
                    {/* Left column - visual accent */}
                    <div className="md:col-span-1 flex flex-col justify-between">
                      {/* Subtle quotation mark */}
                      <div className="text-5xl md:text-6xl font-black text-gray-100 leading-none select-none opacity-60">"</div>
                      
                      {/* Colored dot accent */}
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <div className={`w-3 h-3 ${job.accent} group-hover:scale-150 transition-transform duration-300 rounded-full`}></div>
                      </div>
                    </div>
                    
                    {/* Main content */}
                    <div className="md:col-span-2">
                      {/* Position */}
                      <h3 className="text-lg md:text-xl font-bold font-karrik mb-2 text-[#1C1B22] leading-tight">
                        {job.position}
                      </h3>
                      
                      {/* Gradient separator line */}
                      <div className="w-16 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] mb-3 group-hover:w-24 transition-all duration-500"></div>
                      
                      {/* Company */}
                      <div className="text-sm md:text-base font-semibold mb-4 text-gray-700">
                        {job.company}
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs md:text-sm leading-relaxed text-gray-600">
                        {job.description}
                      </p>
                    </div>
                    
                    {/* Right column - technologies */}
                    <div className="md:col-span-1 flex flex-col justify-between">
                      <div className="text-xs font-medium text-gray-500 leading-relaxed">
                        {job.technologies}
                      </div>
                      
                      {/* Arrow indicator - subtle */}
                      <div className="flex items-center gap-1 text-gray-400 group-hover:text-[#667eea] transition-colors mt-4 md:mt-0">
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shuffledProjects.map((project, index) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group relative overflow-visible transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  {/* Project Image */}
                  {project.image && (
                    <div className="relative w-full h-56 overflow-hidden bg-gray-900 rounded-lg border-2 border-gray-200 group-hover:border-[#667eea]">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                      />
                      
                      {/* Subtle overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40"></div>
                      
                      {/* Subtle quotation mark */}
                      <div className="absolute top-3 left-3 text-white/30 text-5xl font-black leading-none pointer-events-none select-none">"</div>
                      
                      {/* Year badge - refined */}
                      <div className="absolute top-3 right-3 bg-[#F3F3F7]/95 backdrop-blur-sm text-[#1C1B22] px-3 py-1 text-[10px] font-bold tracking-wider rounded shadow-md">
                        {project.year}
                      </div>
                      
                      {/* Gradient line at bottom on hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                    </div>
                  )}
                  
                  {/* Content Box - Refined overlapping style */}
                  <div className="bg-white border-2 border-gray-200 group-hover:border-[#667eea] p-5 -mt-6 mx-3 relative z-10 shadow-lg group-hover:shadow-xl transition-all duration-300 rounded-lg">
                    {/* Project name */}
                    <h3 className="text-base font-bold font-karrik mb-2 text-[#1C1B22] leading-tight">
                      {project.name}
                    </h3>
                    
                    {/* Gradient separator */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] mb-3 group-hover:w-20 transition-all duration-500"></div>
                    
                    {/* Description */}
                    <p className="text-xs mb-3 leading-relaxed text-gray-600">
                      {project.description}
                    </p>
                    
                    {/* Tech with arrow */}
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                        {project.tech}
                      </div>
                      <ArrowUpRight size={16} className="text-gray-400 group-hover:text-[#667eea] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                    </div>
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
                    <div className="absolute left-0 w-2 h-2 holo-dot opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  <a
                    href={socialLinks.linkedin.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-bold uppercase tracking-wider hover:underline relative group flex items-center pl-6"
                  >
                    {socialLinks.linkedin.display}
                    <div className="absolute left-0 w-2 h-2 holo-dot-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </a>
                  <a
                    href={socialLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-bold uppercase tracking-wider hover:underline relative group flex items-center pl-6"
                  >
                    {socialLinks.instagram.display}
                    <div className="absolute left-0 w-2 h-2 holo-dot-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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