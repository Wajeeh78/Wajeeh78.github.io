import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { liquid } from '../lib/motion'

/* A Pac-Man themed callout that points at the "Play" chip once the visitor
   nears the end of the page. Shown once per visit, never after they have played. */

const SEEN = 'play-nudge-seen'
export const PLAYED = 'pacman-played'
const NEAR_END = 0.86
const STAY_FOR = 12000

const flag = (store: Storage, key: string) => {
  try {
    return store.getItem(key) === '1'
  } catch {
    return false
  }
}

interface Spot { cx: number; bottom: number; vw: number }

export default function PlayNudge({ target, onShow }: { target: RefObject<HTMLElement | null>; onShow: () => void }) {
  const [spot, setSpot] = useState<Spot | null>(null)
  const tagRef = useRef<HTMLSpanElement>(null)
  const [tagLeft, setTagLeft] = useState(0)

  // The arrow lands on the chip's centre; the tag sits above it, kept fully on screen.
  useLayoutEffect(() => {
    if (!spot || !tagRef.current) return
    const w = tagRef.current.offsetWidth
    setTagLeft(Math.min(Math.max(spot.cx - 34, 12), spot.vw - w - 12))
  }, [spot])

  useEffect(() => {
    if (flag(sessionStorage, SEEN) || flag(localStorage, PLAYED)) return
    let hideId = 0
    const place = (): Spot | null => {
      const el = target.current
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { cx: r.left + r.width / 2, bottom: window.innerHeight - r.top + 4, vw: window.innerWidth }
    }
    const onScroll = () => {
      const progress = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight
      if (progress < NEAR_END) return
      window.removeEventListener('scroll', onScroll)
      try {
        sessionStorage.setItem(SEEN, '1')
      } catch {
        /* ignore */
      }
      setSpot(place())
      onShow()
      hideId = window.setTimeout(() => setSpot(null), STAY_FOR)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(hideId)
    }
  }, [target, onShow])

  return (
    <AnimatePresence>
      {spot && (
        <motion.div
          className="play-nudge"
          style={{ bottom: spot.bottom }}
          aria-hidden="true"
          initial={{ opacity: 0, y: 14, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96, transition: { duration: 0.2 } }}
          transition={liquid}
        >
          <motion.div className="play-nudge-bob" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
            <span ref={tagRef} className="play-nudge-tag" style={{ left: tagLeft }}>
              <span className="play-nudge-track" aria-hidden="true">
                <span className="play-nudge-pac" />
                <span className="play-nudge-dots" />
                <svg className="play-nudge-ghost" width="18" height="19" viewBox="0 0 60 64">
                  <path d="M4 30a26 26 0 0 1 52 0v30l-8.7-7-8.6 7-8.7-7-8.7 7-8.6-7L4 60Z" fill="#ff6cc8" />
                  <circle cx="20" cy="28" r="7" fill="#fff" />
                  <circle cx="40" cy="28" r="7" fill="#fff" />
                  <circle cx="17" cy="29" r="3.4" fill="#1d1d1f" />
                  <circle cx="37" cy="29" r="3.4" fill="#1d1d1f" />
                </svg>
              </span>
              <span className="play-nudge-title">If you're bored…</span>
              <span className="play-nudge-sub">I made Pac-Man for you to play</span>
            </span>
            {/* A trail of pellets curving down onto the Play chip */}
            <svg className="play-nudge-arrow" style={{ left: spot.cx - 22 }} width="44" height="40" viewBox="0 0 44 40">
              <motion.path className="pellets" d="M34 2 C 34 16, 28 26, 22 34" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }} />
              <motion.path className="head" d="M15 28 L 22 36 L 28 27" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25, delay: 0.8 }} />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
