import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import PacmanField from './components/PacmanField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Research from './components/Research'
import Awards from './components/Awards'
import CaseStudy from './components/CaseStudy'
import Journey from './components/Journey'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { startSmoothScroll } from './lib/motion'
import ThemeHint from './components/ThemeHint'
import StatsDock from './components/StatsDock'
import GameOverlay from './components/GameOverlay'

export default function App() {
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => startSmoothScroll(), [])

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -65% 0px' }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  // Moves the highlight on whichever glass panel is under the cursor.
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const panel = (event.target as Element | null)?.closest?.<HTMLElement>('.glass')
      if (!panel) return
      const box = panel.getBoundingClientRect()
      panel.style.setProperty('--mx', `${event.clientX - box.left}px`)
      panel.style.setProperty('--my', `${event.clientY - box.top}px`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#about">Skip to content</a>
      <PacmanField />
      <Navbar activeSection={activeSection} />
      <ThemeHint />
      <StatsDock />
      <GameOverlay />
      <main>
        <Hero />
        <About />
        <Research />
        <CaseStudy />
        <Journey />
        <Awards />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  )
}
