import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import { Menu, Moon, Sun, X } from 'lucide-react'
import Glass from './Glass'
import CvButton from './CvButton'
import { jelly, liquid, scrollToSection } from '../lib/motion'
import { THEME_EVENT, getTheme, setTheme, type Theme } from '../lib/theme'

const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'case-study', label: 'Case Study' },
  { id: 'journey', label: 'Experience' },
  { id: 'awards', label: 'Awards' },
  { id: 'contact', label: 'Contact' },
]

/* Scroll progress: Pac-Man eats a column of dots on the way down the page. */
function ScrollRail() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26 })
  const top = useTransform(progress, (p) => `${p * 100}%`)
  const eaten = useTransform(progress, (p) => p * 100)
  const clip = useMotionTemplate`inset(${eaten}% 0 0 0)`

  return (
    <div className="rail" aria-hidden="true">
      <motion.div className="rail-dots" style={{ clipPath: clip }} />
      <motion.div className="rail-pac" style={{ top }}>
        <span className="pac" />
      </motion.div>
    </div>
  )
}

function ThemeToggle() {
  const [theme, setLocal] = useState<Theme>(getTheme)
  useEffect(() => {
    const onChange = (event: Event) => setLocal((event as CustomEvent<Theme>).detail)
    window.addEventListener(THEME_EVENT, onChange)
    return () => window.removeEventListener(THEME_EVENT, onChange)
  }, [])
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <motion.button
      className="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      whileTap={{ scale: 0.88, rotate: -20 }}
      transition={jelly}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'inline-flex' }}
        >
          {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}

interface NavbarProps { activeSection: string }

export default function Navbar({ activeSection }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const go = (id: string) => {
    scrollToSection(id)
    setMobileOpen(false)
  }

  return (
    <>
      <header className="nav-wrap">
        <Glass refract={18} reveal={false} className="nav-pill" initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...liquid, delay: 0.2 }}>
          <nav className="nav-inner" aria-label="Main navigation">
            <button className="nav-logo" onClick={() => go('hero')} aria-label="Back to top">
              <span className="pac pac-still" />
              wajeeh
            </button>

            <ul className="nav-links">
              {navLinks.map((link) => (
                <li key={link.id}>
                  <button
                    className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                    onClick={() => go(link.id)}
                    aria-current={activeSection === link.id ? 'true' : undefined}
                  >
                    {activeSection === link.id && <motion.span layoutId="nav-droplet" className="droplet" transition={jelly} />}
                    <span className="relative">{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="nav-tools">
              <ThemeToggle />
              <div className="nav-cv"><CvButton compact /></div>
              <button
              className="nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </nav>
        </Glass>

        <AnimatePresence>
          {mobileOpen && (
            <Glass
              reveal={false}
              className="nav-sheet"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.97 }}
              transition={jelly}
            >
              <ul>
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <button className={`nav-sheet-link ${activeSection === link.id ? 'active' : ''}`} onClick={() => go(link.id)}>
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="nav-sheet-actions"><CvButton /></div>
            </Glass>
          )}
        </AnimatePresence>
      </header>
      <ScrollRail />
    </>
  )
}
