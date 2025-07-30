"use client"

import { useState, useEffect } from "react"
import { Github, Linkedin, Instagram, ExternalLink, ArrowUpRight, ChevronUp } from "lucide-react"
import MarkdownsPeekViewer from './markdowns-peek-viewer'

export default function PortfolioClient({ data: initialData }: { data: any }) {
  const [data, setData] = useState(initialData);
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [fontsLoaded, setFontsLoaded] = useState(false)

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!fontsLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold uppercase tracking-wider mb-4">{loadingScreen.title}</div>
          <div className="w-24 h-0.5 bg-black mx-auto mb-2"></div>
          <div className="text-sm font-bold uppercase tracking-wider opacity-60">{loadingScreen.text}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black relative">
      {/* Subtle holographic background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 holo-orb opacity-30"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 holo-orb-2 opacity-20"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 holo-orb-3 opacity-25"></div>
      </div>

      {/* Header */}
      <header className="holo-header p-8 border-b-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a href="/" className="text-2xl font-black tracking-tight relative hover:opacity-80 transition-opacity">
            {personalInfo.title}
            <div className="absolute -bottom-1 left-0 w-full h-0.5 holo-gradient"></div>
          </a>
          <nav className="hidden md:flex gap-8 text-sm font-bold uppercase tracking-wider">
            {navigation.map((item) => (
              <a key={item.name} href={item.href} className="hover:underline relative group">
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 holo-gradient group-hover:w-full transition-all duration-300"></div>
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="holo-hero p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl md:text-8xl font-black leading-none mb-4 tracking-tighter relative">
                  {sections?.hero?.title?.first}
                  <br />
                  <span className="holo-text">{sections?.hero?.title?.second}</span>
                </h1>
              </div>

              <div className="space-y-4 text-lg leading-relaxed max-w-lg">
                {personalInfo.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="text-xl font-bold uppercase tracking-wider space-y-1">
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
              <div className="text-center">
                <h3 className="text-2xl font-black uppercase tracking-wider relative">
                  {sections?.photos?.title?.first} <span className="holo-text-life">{sections?.photos?.title?.second}</span>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 holo-gradient-life"></div>
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {photos.sort(() => Math.random() - 0.5).slice(0, 4).map((photo, index) => (
                  <a
                    key={index}
                    href={socialLinks.instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative cursor-pointer group block ${index === 1 ? "mt-8" : ""} ${index === 2 ? "-mt-8" : ""}`}
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-64 object-cover border-2 border-black transition-all duration-300"
                    />
                    <div className="absolute inset-0 holo-overlay opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    
                    {/* Photo caption */}
                    <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold relative">
                      {photo.caption}
                      <div className="absolute -bottom-0.5 left-0 w-full h-0.5 holo-gradient"></div>
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
        <section id="blog" className="p-8 border-t-2 border-black relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter relative">
              {sections?.blog?.title?.first} <span className="holo-text-blog">{sections?.blog?.title?.second}</span>
              <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-blog"></div>
            </h2>

            <div className="bg-white overflow-hidden">
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
      <section id="work" className="p-8 border-t-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter relative">
            {sections?.work?.title?.first} <span className="holo-text-experience">{sections?.work?.title?.second}</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-experience"></div>
          </h2>

          <div className="space-y-8">
            {workExperience.map((job, index) => (
              <a 
                key={index} 
                href={socialLinks.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid md:grid-cols-4 gap-4 border-b border-gray-300 pb-8 relative group cursor-pointer hover:bg-gray-50 transition-colors duration-300 block"
              >
                <div className="text-sm font-bold uppercase tracking-wider">{job.period}</div>
                <div className="md:col-span-2">
                  <h3 className="text-xl font-black mb-2 relative font-karrik flex items-center pl-6">
                    {job.position}
                    <div className={`absolute left-0 w-2 h-2 ${job.accent} group-hover:scale-150 transition-transform duration-300`}></div>
                  </h3>
                  <div className="text-sm font-bold uppercase tracking-wider mb-4 holo-text-subtle font-karrik">
                    {job.company}
                  </div>
                  <p className="text-sm leading-relaxed">
                    {job.description}
                  </p>
                </div>
                <div className="text-sm font-bold uppercase tracking-wider">{job.technologies}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      {sections?.articles?.enabled && sections.articles.markdownsPeek?.repo && (
        <section id="articles" className="p-8 border-t-2 border-black relative z-10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter relative">
              {sections?.articles?.title?.first} <span className="holo-text-articles">{sections?.articles?.title?.second}</span>
              <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-articles"></div>
            </h2>

            <div className="bg-white overflow-hidden">
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
      <section id="projects" className="p-8 border-t-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter relative">
            {sections?.projects?.title?.first} <span className="holo-text-projects">{sections?.projects?.title?.second}</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-projects"></div>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.sort(() => Math.random() - 0.5).map((project, index) => (
              <a
                key={index}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block border-2 border-black p-6 hover:bg-black hover:text-white group relative overflow-hidden ${project.accent} cursor-pointer`}
              >
                <div className="absolute inset-0 holo-project-bg opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-sm font-bold uppercase tracking-wider">{project.year}</div>
                    <div className="group-hover:text-white relative">
                      <ArrowUpRight size={20} />
                      <div className="absolute -inset-1 holo-glow opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-black mb-2 uppercase tracking-tighter font-karrik">{project.name}</h3>
                  <p className="text-sm mb-4 leading-relaxed">{project.description}</p>
                  <div className="text-xs font-bold uppercase tracking-wider relative">
                    {project.tech}
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 holo-gradient group-hover:w-full transition-all duration-500"></div>
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
      <section id="contact" className="p-8 border-t-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter relative">
                {sections?.contact?.title?.first} <span className="holo-text-together">{sections?.contact?.title?.second}</span>
                <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-together"></div>
              </h2>
              <p className="text-lg leading-relaxed mb-8">
                {contactInfo.description}
              </p>
              <div className="space-y-4">
                <a href={`mailto:${personalInfo.email}`} className="block text-sm font-bold uppercase tracking-wider relative group hover:underline flex items-center pl-6">
                  {personalInfo.email}
                  <div className="absolute left-0 w-2 h-2 holo-dot group-hover:scale-150 transition-transform duration-300"></div>
                </a>
                <div className="text-sm font-bold uppercase tracking-wider relative group flex items-center pl-6">
                  {personalInfo.location}
                  <div className="absolute left-0 w-2 h-2 holo-dot-2 group-hover:scale-150 transition-transform duration-300"></div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter relative">
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
                <h3 className="text-xl font-black mb-4 uppercase tracking-tighter relative">
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
      <footer className="p-8 border-t-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-sm font-bold uppercase tracking-wider">{contactInfo.footer.copyright}</div>
          <div className="text-sm font-bold uppercase tracking-wider holo-text-subtle">TO INFINITY AND <span className="holo-text-beyond">BEYOND</span></div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-black text-white border-2 border-black hover:bg-white hover:text-black transition-all duration-300 z-50 flex items-center justify-center group"
          aria-label="Scroll to top"
        >
          <ChevronUp size={20} className="group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute inset-0 holo-gradient opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      )}
    </div>
  )
} 