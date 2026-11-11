import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, X } from 'lucide-react'
import { jelly, liquid } from '../lib/motion'
import { THEME_EVENT, getTheme, setTheme } from '../lib/theme'

/* Popup that points at the theme toggle. It shows once per visit whenever the
   page opens in light mode, and closes itself after a while. */

const SEEN = 'theme-hint-seen'
const SHOW_AFTER = 1800
const STAY_FOR = 11000
const WIDTH = 330

interface Spot { cx: number; bottom: number; left: number; top: number; vw: number }

function measure(): Spot | null {
  const toggle = [...document.querySelectorAll<HTMLElement>('.theme-toggle')].find((el) => el.offsetParent)
  if (!toggle) return null
  const box = toggle.getBoundingClientRect()
  const vw = window.innerWidth
  const width = Math.min(WIDTH, vw - 32)
  const cx = box.left + box.width / 2
  const left = Math.min(Math.max(cx - width + 56, 16), vw - width - 16)
  return { cx, bottom: box.bottom, left, top: box.bottom + 46, vw }
}

// sessionStorage, so it comes back on the next visit but not on every reload in this tab.
const wasSeen = () => {
  try {
    return sessionStorage.getItem(SEEN) === '1'
  } catch {
    return false
  }
}

export default function ThemeHint() {
  const [spot, setSpot] = useState<Spot | null>(null)
  const [open, setOpen] = useState(false)

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(SEEN, '1')
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    if (wasSeen() || getTheme() !== 'light') return
    const timer = window.setTimeout(() => {
      setSpot(measure())
      setOpen(true)
    }, SHOW_AFTER)
    const onTheme = () => close()
    const onResize = () => setSpot(measure())
    window.addEventListener(THEME_EVENT, onTheme)
    window.addEventListener('resize', onResize)
    return () => {
      clearTimeout(timer)
      window.removeEventListener(THEME_EVENT, onTheme)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(close, STAY_FOR)
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const width = spot ? Math.min(WIDTH, spot.vw - 32) : WIDTH
  // The line runs from just under the toggle down to the top of the card.
  const endX = spot ? Math.min(Math.max(spot.cx - 36, spot.left + 28), spot.left + width - 28) : 0
  const path = spot
    ? `M ${spot.cx} ${spot.bottom + 6} C ${spot.cx} ${spot.bottom + 30}, ${endX} ${spot.top - 26}, ${endX} ${spot.top - 4}`
    : ''

  return (
    <AnimatePresence>
      {open && spot && (
        <motion.div className="theme-hint-layer" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <svg className="theme-hint-line" aria-hidden="true">
            <motion.path
              d={path}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.15 }}
            />
            <motion.circle
              cx={spot.cx}
              cy={spot.bottom + 6}
              r={3.5}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.6, 1] }}
              transition={{ duration: 0.5, delay: 0.95 }}
            />
          </svg>

          <motion.div
            className="theme-hint glass"
            role="dialog"
            aria-label="Theme tip"
            style={{ left: spot.left, top: spot.top, width }}
            initial={{ opacity: 0, y: 14, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={liquid}
          >
            <button className="theme-hint-close" onClick={close} aria-label="Close tip"><X size={15} /></button>
            <p className="theme-hint-text">
              {"Can't see the white theme?".split(' ').map((word, i) => (
                <span key={i}>
                  {i > 0 && ' '}
                  <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.06 }}>
                    {word}
                  </motion.span>
                </span>
              ))}
              <br />
              <motion.span className="theme-hint-strong" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }}>
                Switch it to dark. I got you!
              </motion.span>
            </p>
            <div className="theme-hint-actions">
              <motion.button
                className="btn btn-primary btn-compact"
                onClick={() => setTheme('dark')}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scaleX: 1.08, scaleY: 0.92 }}
                transition={jelly}
              >
                <Moon size={14} /> Switch to dark
              </motion.button>
              <button className="btn btn-glass btn-compact" onClick={close}>I'm good</button>
            </div>
            <motion.span
              className="theme-hint-timer"
              aria-hidden="true"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: STAY_FOR / 1000, ease: 'linear' }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
