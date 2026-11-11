import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, X } from 'lucide-react'
import { getGame, startGame, steer, stopGame, subscribeGame, type Dir, type GameState } from '../lib/game'
import { jelly, liquid, lockScroll } from '../lib/motion'

const KEYS: Record<string, Dir> = {
  ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0],
  w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0],
  W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0],
}

const fmt = (n: number) => n.toLocaleString('en-US')

/* The HUD shown while playing. The page content fades away so the maze is the stage. */
export default function GameOverlay() {
  const [game, setGame] = useState<GameState>(getGame)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const playing = game.playing

  useEffect(() => subscribeGame(setGame), [])

  useEffect(() => {
    lockScroll(playing)
    if (!playing) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') return stopGame()
      const dir = KEYS[event.key]
      if (dir) {
        event.preventDefault()
        steer(dir)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [playing])

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchMove = (event: React.TouchEvent) => {
    const start = touchStart.current
    if (!start) return
    const t = event.touches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    steer(Math.abs(dx) > Math.abs(dy) ? [Math.sign(dx), 0] : [0, Math.sign(dy)])
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  const pad = (dir: Dir, label: string, icon: React.ReactNode, cls: string) => (
    <button className={`dpad-btn ${cls}`} aria-label={label} onPointerDown={(e) => { e.preventDefault(); steer(dir) }}>
      {icon}
    </button>
  )

  return (
    <AnimatePresence>
      {playing && (
        <motion.div
          className="game"
          role="application"
          aria-label="Pac-Man game. Use the arrow keys or swipe to steer. Press Escape to leave."
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
        >
          <motion.div className="game-hud glass" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={liquid}>
            <div className="game-stat">
              <span className="mono-note">Score</span>
              <motion.strong key={game.score} initial={{ scale: 1.25 }} animate={{ scale: 1 }} transition={jelly}>{fmt(game.score)}</motion.strong>
            </div>
            <div className="game-stat">
              <span className="mono-note">High</span>
              <strong>{fmt(game.high)}</strong>
            </div>
            <div className="game-stat">
              <span className="mono-note">Level</span>
              <strong>{game.level}</strong>
            </div>
            <div className="game-lives" aria-label={`${game.lives} lives left`}>
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="game-life" animate={{ opacity: i < game.lives ? 1 : 0.15, scale: i < game.lives ? 1 : 0.7 }} transition={jelly} />
              ))}
            </div>
            <button className="btn btn-glass btn-compact game-exit" onClick={stopGame}>
              <X size={14} /> Exit <kbd>Esc</kbd>
            </button>
          </motion.div>

          <AnimatePresence>
            {game.ready > 0 && !game.over && (
              <motion.div
                key="ready"
                className="game-banner"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={jelly}
              >
                <p className="game-ready">Ready!</p>
                <p className="mono-note">Arrow keys or WASD · swipe on touch</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {game.over && (
              <motion.div
                key="over"
                className="game-over glass"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={liquid}
              >
                <p className="eyebrow">Game over</p>
                <p className="game-over-score">{fmt(game.score)}</p>
                <p className="mono-note">
                  {game.score > 0 && game.score >= game.high ? 'New high score! 🎉' : `High score ${fmt(game.high)}`} · Level {game.level}
                </p>
                <div className="game-over-actions">
                  <motion.button className="btn btn-primary" onClick={startGame} whileTap={{ scaleX: 1.08, scaleY: 0.92 }} transition={jelly}>
                    <RotateCcw size={15} /> Play again
                  </motion.button>
                  <button className="btn btn-glass" onClick={stopGame}>Back to the site</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="dpad" aria-hidden="true">
            {pad([0, -1], 'Up', <ArrowUp size={20} />, 'up')}
            {pad([-1, 0], 'Left', <ArrowLeft size={20} />, 'left')}
            {pad([1, 0], 'Right', <ArrowRight size={20} />, 'right')}
            {pad([0, 1], 'Down', <ArrowDown size={20} />, 'down')}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
