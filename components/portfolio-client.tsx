"use client"

import { useState, useEffect } from "react"
import { Github, Linkedin, Instagram, ExternalLink, ArrowUpRight, ChevronUp } from "lucide-react"

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
    loadingScreen
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
      <header className="p-8 border-b-2 border-black relative z-10">
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
      <section className="p-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl md:text-8xl font-black leading-none mb-4 tracking-tighter relative">
                  GLAD YOU'RE
                  <br />
                  <span className="holo-text">HERE</span>
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
                  MY <span className="holo-text-life">LIFE</span>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 holo-gradient-life"></div>
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
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

      {/* Work Experience */}
      <section id="work" className="p-8 border-t-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter relative">
            WORK <span className="holo-text-experience">EXPERIENCE</span>
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

      {/* Projects */}
      <section id="projects" className="p-8 border-t-2 border-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter relative">
            SELECTED <span className="holo-text-projects">PROJECTS</span>
            <div className="absolute -bottom-2 left-0 w-24 h-1 holo-gradient-projects"></div>
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
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
              VIEW ALL PROJECTS ON GITHUB
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
                LET'S WORK <span className="holo-text-together">TOGETHER</span>
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
                  SOCIAL <span className="holo-text-links">LINKS</span>
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
                  CURRENT <span className="holo-text-status">STATUS</span>
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