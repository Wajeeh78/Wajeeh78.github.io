import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Gamepad2, X, Zap } from 'lucide-react'
import { readVitals, grade, type Vitals } from '../lib/vitals'
import { getGame, startGame, subscribeGame } from '../lib/game'
import { jelly, liquid } from '../lib/motion'
import type { Tone } from '../lib/tones'
import PlayNudge, { PLAYED } from './PlayNudge'

/* Bottom-left dock: a "loaded in" chip that opens a live stats panel, and the
   "Want to play Pac-Man?" button. The frame-rate meter only runs while the panel is open. */

const secs = (ms: number) => `${(ms / 1000).toFixed(2)}s`
const kb = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.round(b / 1024)} KB`)
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

function useFps(active: boolean) {
  const [samples, setSamples] = useState<number[]>([])
  useEffect(() => {
    if (!active) return
    let raf = 0
    let frames = 0
    let since = performance.now()
    const tick = (now: number) => {
      frames++
      if (now - since >= 500) {
        const fps = Math.min(120, Math.round((frames * 1000) / (now - since)))
        setSamples((s) => [...s.slice(-39), fps])
        frames = 0
        since = now
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [active])
  return samples
}

/** Counts up to a value, for the satisfying number roll. */
function CountUp({ to, format }: { to: number; format: (n: number) => string }) {
  const [n, setN] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 700)
      setN(to * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to])
  return <>{format(n)}</>
}

function Spark({ samples }: { samples: number[] }) {
  const w = 120
  const h = 30
  if (samples.length < 2) return <svg width={w} height={h} className="spark" aria-hidden="true" />
  const max = 70
  const pts = samples.map((s, i) => `${(i / 39) * w},${h - (Math.min(s, max) / max) * (h - 4) - 2}`).join(' ')
  return (
    <svg width={w} height={h} className="spark" aria-hidden="true">
      <polyline points={pts} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Tile({ tone, label, value, note, children, i }: { tone: Tone; label: string; value: React.ReactNode; note?: string; children?: React.ReactNode; i: number }) {
  return (
    <motion.div
      className={`stat-tile tone-${tone}`}
      initial={{ opacity: 0, y: 14, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...jelly, delay: 0.05 + i * 0.05 }}
    >
      <span className="stat-tile-label"><span className="pac-mini" /> {label}</span>
      <span className="stat-tile-value">{value}</span>
      {note && <span className="stat-tile-note">{note}</span>}
      {children}
    </motion.div>
  )
}

const NUDGE_KEY = 'stats-opened'
const opened = () => {
  try {
    return localStorage.getItem(NUDGE_KEY) === '1'
  } catch {
    return false
  }
}

/* "Stats for nerds" callout with a hand-drawn arrow pointing at the chip.
   It shows a few seconds after load, and never again once the panel has been opened. */
function Nudge({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="nudge"
          aria-hidden="true"
          initial={{ opacity: 0, y: 10, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.95, transition: { duration: 0.2 } }}
          transition={liquid}
        >
          <motion.div
            className="nudge-bob"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          >
            <span className="nudge-tag">
              <span className="nudge-title">Stats for nerds</span>
              <span className="nudge-sub">See how fast this page runs</span>
            </span>
            <svg className="nudge-arrow" width="64" height="46" viewBox="0 0 64 46">
              <motion.path
                d="M52 4 C 50 22, 36 34, 14 38"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1], delay: 0.35 }}
              />
              <motion.path
                d="M22 31 L 13 38 L 23 43"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function StatsDock() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const playRef = useRef<HTMLButtonElement>(null)
  // Only one callout at a time: the play callout takes over near the end of the page.
  const [quiet, setQuiet] = useState(false)
  const hideStatsNudge = useCallback(() => setQuiet(true), [])
  const [vitals, setVitals] = useState<Vitals>(readVitals)
  const [now, setNow] = useState(Date.now())
  const [game, setGameState] = useState(getGame)
  const samples = useFps(open)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => subscribeGame(setGameState), [])

  useEffect(() => {
    if (opened()) return
    // On desktop it waits for a few seconds and stays until the panel is opened.
    if (!window.matchMedia('(max-width: 640px)').matches) {
      const id = setTimeout(() => setNudge(true), 3200)
      return () => clearTimeout(id)
    }
    // On phones it would cover the hero buttons, so it waits until the visitor
    // scrolls past the hero, then fades out on its own after a few seconds.
    let hideId = 0
    const onScroll = () => {
      if (window.scrollY < window.innerHeight * 0.9) return
      window.removeEventListener('scroll', onScroll)
      setNudge(true)
      hideId = window.setTimeout(() => setNudge(false), 6000)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(hideId)
    }
  }, [])

  const toggle = () => {
    if (!open) {
      setNudge(false)
      try {
        localStorage.setItem(NUDGE_KEY, '1')
      } catch {
        /* ignore */
      }
    }
    setOpen(!open)
  }

  // The load event may land after first render; refresh once it has.
  useEffect(() => {
    const refresh = () => setVitals(readVitals())
    if (document.readyState === 'complete') setTimeout(refresh, 300)
    else window.addEventListener('load', () => setTimeout(refresh, 300), { once: true })
  }, [])

  useEffect(() => {
    if (!open) return
    setVitals(readVitals())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node) && !(e.target as Element).closest?.('.dock-chip')) setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onClick)
    return () => {
      clearInterval(timer)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  const fps = samples.length ? Math.round(samples.slice(-6).reduce((a, b) => a + b, 0) / Math.min(6, samples.length)) : 0
  const g = grade(vitals, fps || 60)
  const onPage = Math.max(0, Math.floor((now - vitals.startedAt) / 1000))
  const loaded = vitals.load || vitals.lcp || vitals.fcp

  const play = () => {
    setOpen(false)
    try {
      localStorage.setItem(PLAYED, '1')
    } catch {
      /* ignore */
    }
    startGame()
  }

  if (game.playing) return null

  return (
    <div className="dock">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            className="stats glass"
            role="dialog"
            aria-label="Website performance stats"
            initial={{ opacity: 0, y: 24, scale: 0.92, transformOrigin: 'bottom left' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={liquid}
          >
            <header className="stats-head">
              <motion.span className="stats-grade" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...jelly, delay: 0.15 }}>
                {g.letter}
              </motion.span>
              <div>
                <p className="eyebrow">How this page is doing</p>
                <p className="stats-line">{g.line}</p>
              </div>
              <button className="stats-close" onClick={() => setOpen(false)} aria-label="Close stats"><X size={15} /></button>
            </header>

            <div className="stats-grid">
              <Tile i={0} tone="paper" label="Loaded in" value={<CountUp to={loaded} format={secs} />} note="until the page was ready" />
              <Tile i={1} tone="poster" label="First paint" value={<CountUp to={vitals.fcp} format={(n) => `${Math.round(n)} ms`} />} note="first pixels on screen" />
              <Tile i={2} tone="presentation" label="Main content" value={<CountUp to={vitals.lcp} format={(n) => `${Math.round(n)} ms`} />} note="largest paint (LCP)" />
              <Tile i={3} tone="milestone" label="Stability" value={vitals.cls.toFixed(3)} note={vitals.cls < 0.1 ? 'nothing jumped around' : 'a little jumpy'} />
              <Tile i={4} tone="first" label="Frame rate" value={fps ? `${fps} fps` : '…'} note="live, while you scroll">
                <Spark samples={samples} />
              </Tile>
              <Tile i={5} tone="instructor" label="Page weight" value={<CountUp to={vitals.bytes} format={kb} />} note={`${vitals.requests} requests`} />
            </div>

            <footer className="stats-foot">
              <span>⏱ {clock(onPage)} on this page</span>
              <span>🟡 {game.ambient.toLocaleString('en-US')} pts eaten while you read</span>
            </footer>

            <motion.button className="btn btn-primary stats-play" onClick={play} whileHover={{ scale: 1.02 }} whileTap={{ scaleX: 1.05, scaleY: 0.94 }} transition={jelly}>
              <Gamepad2 size={16} /> Want to play Pac-Man?
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Nudge show={nudge && !open && !quiet} />
      <PlayNudge target={playRef} onShow={hideStatsNudge} />

      <div className="dock-row">
        <motion.button
          className="dock-chip glass"
          onClick={toggle}
          aria-expanded={open}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...liquid, delay: 1.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={14} className="dock-zap" />
          <span className="dock-label">{loaded ? <>Loaded in {secs(loaded)}</> : 'Page stats'}</span>
        </motion.button>
        <motion.button
          ref={playRef}
          className="dock-chip glass dock-play"
          onClick={play}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...liquid, delay: 1.55 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Play Pac-Man"
        >
          <span className="pac dock-pac" />
          <span className="dock-label">Want to play Pac-Man?</span>
        </motion.button>
      </div>
    </div>
  )
}
