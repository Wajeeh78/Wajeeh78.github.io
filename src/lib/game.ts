/* Shared Pac-Man state. The background canvas reads it every frame and the
   React overlays (game HUD, stats panel) subscribe to it. No re-renders happen
   while nobody is listening, so browsing costs nothing extra. */

export type Dir = [number, number]

export interface GameState {
  playing: boolean
  /** Seconds left on the "Ready!" countdown before play starts. */
  ready: number
  over: boolean
  score: number
  high: number
  lives: number
  level: number
  /** Score from the ambient, self-driving Pac-Man while browsing. */
  ambient: number
}

const HIGH_KEY = 'pacman-high'
const readHigh = () => {
  try {
    return Number(localStorage.getItem(HIGH_KEY)) || 0
  } catch {
    return 0
  }
}

let state: GameState = { playing: false, ready: 0, over: false, score: 0, high: readHigh(), lives: 3, level: 1, ambient: 0 }
const listeners = new Set<(s: GameState) => void>()

/** The direction the player last asked for. The canvas turns into it at the next junction. */
export const input: { want: Dir | null } = { want: null }

export const getGame = () => state

export function setGame(patch: Partial<GameState>) {
  state = { ...state, ...patch }
  if (patch.score !== undefined && state.score > state.high) {
    state.high = state.score
    try {
      localStorage.setItem(HIGH_KEY, String(state.high))
    } catch {
      /* ignore */
    }
  }
  for (const fn of listeners) fn(state)
}

export function subscribeGame(fn: (s: GameState) => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export const startGame = () => {
  input.want = null
  setGame({ playing: true, over: false, ready: 1.6, score: 0, lives: 3, level: 1 })
}
export const stopGame = () => setGame({ playing: false, over: false, ready: 0 })
export const steer = (dir: Dir) => {
  input.want = dir
}
