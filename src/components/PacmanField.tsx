import { useEffect, useRef } from 'react'

/* ─── The page background: a living Pac-Man maze on a fixed canvas ─────
   Everyone navigates with breadth-first search. Pac-Man eats the dots
   currently on screen and follows the cursor, ghosts hunt Pac-Man, and
   the maze drifts as the page scrolls. */

const GHOST_COLORS = ['#ff4d6d', '#ff8ad8', '#4de8ff', '#ffa94d']
const FRIGHTENED = '#6d7dff'
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]]

interface Actor {
  x: number
  y: number
  nx: number
  ny: number
  t: number
  dir: number[]
}

function mulberry(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let z = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296
  }
}

/* Mirrored left half, carved with a depth-first walk, then braided so there
   are no dead ends and the chase keeps flowing. cols % 4 === 1 keeps the
   centre column a wall, which is opened at intervals to join the halves. */
function buildMaze(cols: number, rows: number) {
  const rand = mulberry(1983)
  const grid = new Uint8Array(cols * rows).fill(1)
  const at = (x: number, y: number) => y * cols + x
  const mid = (cols - 1) / 2
  const inside = (x: number, y: number) => x >= 1 && x < mid && y >= 1 && y < rows - 1

  const stack: [number, number][] = [[1, 1]]
  grid[at(1, 1)] = 0
  while (stack.length) {
    const [x, y] = stack[stack.length - 1]
    const options = DIRS.filter(([dx, dy]) => inside(x + dx * 2, y + dy * 2) && grid[at(x + dx * 2, y + dy * 2)] === 1)
    if (!options.length) {
      stack.pop()
      continue
    }
    const [dx, dy] = options[Math.floor(rand() * options.length)]
    grid[at(x + dx, y + dy)] = 0
    grid[at(x + dx * 2, y + dy * 2)] = 0
    stack.push([x + dx * 2, y + dy * 2])
  }

  for (let y = 1; y < rows - 1; y += 2) {
    for (let x = 1; x < mid; x += 2) {
      const walls = DIRS.filter(([dx, dy]) => inside(x + dx * 2, y + dy * 2) && grid[at(x + dx, y + dy)] === 1)
      const open = DIRS.filter(([dx, dy]) => grid[at(x + dx, y + dy)] === 0).length
      if (walls.length && (open <= 1 || rand() < 0.16)) {
        const [dx, dy] = walls[Math.floor(rand() * walls.length)]
        grid[at(x + dx, y + dy)] = 0
      }
    }
  }

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < mid; x++) grid[at(cols - 1 - x, y)] = grid[at(x, y)]
  }
  for (let y = 1; y < rows - 1; y += 2) {
    if ((y - 1) % 8 === 0 || y === rows - 2) grid[at(mid, y)] = 0
  }
  return grid
}

function glowSprite(color: string, size: number) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, `${color}66`)
  gradient.addColorStop(1, `${color}00`)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

export default function PacmanField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scoreRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d', { alpha: true })
    if (!canvas || !ctx) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(pointer: coarse)').matches

    let dpr = 1, vw = 0, vh = 0, cell = 48, cols = 0, rows = 0, originX = 0
    let grid = new Uint8Array(0), dots = new Uint8Array(0), power = new Uint8Array(0)
    let prev = new Int32Array(0), queue = new Int32Array(0)
    let walls: HTMLCanvasElement | null = null
    let scrollTarget = 0, scrollY = 0, docHeight = 1
    let score = 0, frightened = 0, deadFor = 0, dotAlpha = 1, dotsLeft = 0
    let pointerTile = -1, pointerUntil = 0, sizeKey = ''
    const pac: Actor = { x: 1, y: 1, nx: 1, ny: 1, t: 0, dir: [1, 0] }
    let ghosts: (Actor & { color: string; chase: number })[] = []
    const glows = new Map<string, HTMLCanvasElement>()
    const glow = (color: string) => {
      if (!glows.has(color)) glows.set(color, glowSprite(color, 96))
      return glows.get(color)!
    }

    const idx = (x: number, y: number) => y * cols + x
    const open = (x: number, y: number) => x >= 0 && y >= 0 && x < cols && y < rows && grid[idx(x, y)] === 0

    function bfsStep(from: number, goal: (i: number) => boolean, blocked?: (i: number) => boolean) {
      prev.fill(-1)
      prev[from] = from
      let head = 0, tail = 0
      queue[tail++] = from
      while (head < tail) {
        const current = queue[head++]
        if (current !== from && goal(current)) {
          let step = current
          while (prev[step] !== from) step = prev[step]
          return step
        }
        const x = current % cols
        const y = (current - x) / cols
        for (const [dx, dy] of DIRS) {
          if (!open(x + dx, y + dy)) continue
          const next = idx(x + dx, y + dy)
          if (prev[next] !== -1 || blocked?.(next)) continue
          prev[next] = current
          queue[tail++] = next
        }
      }
      return -1
    }

    const moveTo = (actor: Actor, target: number) => {
      const x = target % cols
      const y = (target - x) / cols
      actor.dir = [x - actor.x, y - actor.y]
      actor.nx = x
      actor.ny = y
    }

    const wander = (actor: Actor) => {
      const ways = DIRS.filter(([dx, dy]) => open(actor.x + dx, actor.y + dy))
      const forward = ways.filter(([dx, dy]) => dx !== -actor.dir[0] || dy !== -actor.dir[1])
      const pool = forward.length ? forward : ways
      if (!pool.length) return
      const [dx, dy] = pool[Math.floor(Math.random() * pool.length)]
      moveTo(actor, idx(actor.x + dx, actor.y + dy))
    }

    const tileNearCentre = (x: number, y: number) => {
      const cx = Math.min(Math.max(x | 1, 1), cols - 2)
      const cy = Math.min(Math.max(y | 1, 1), rows - 2)
      return idx(cx, cy)
    }

    function refillDots() {
      dots.fill(0)
      power.fill(0)
      dotsLeft = 0
      for (let i = 0; i < grid.length; i++) {
        if (grid[i] === 0) {
          dots[i] = 1
          dotsLeft++
        }
      }
      const spots = [[3, 3], [cols - 4, 3], [3, Math.floor(vh / cell) - 3], [cols - 4, Math.floor(vh / cell) - 3], [3, rows - 4], [cols - 4, rows - 4]]
      for (const [x, y] of spots) {
        const tile = tileNearCentre(x, y)
        power[tile] = 1
        if (dots[tile]) {
          dots[tile] = 0
          dotsLeft--
        }
      }
      dotAlpha = 0
    }

    function placeActors() {
      const start = tileNearCentre(Math.floor(cols * 0.72), Math.floor(vh / cell / 2))
      pac.x = pac.nx = start % cols
      pac.y = pac.ny = (start - pac.x) / cols
      pac.t = 0
      const count = touch ? 2 : 4
      ghosts = GHOST_COLORS.slice(0, count).map((color, i) => {
        const tile = tileNearCentre(Math.floor(cols / 2) - 3 + i * 2, Math.floor(vh / cell / 2) + 6)
        const x = tile % cols
        const y = (tile - x) / cols
        return { x, y, nx: x, ny: y, t: 0, dir: [0, -1], color, chase: [0.85, 0.6, 0.4, 0.25][i] }
      })
    }

    function drawWalls() {
      const off = document.createElement('canvas')
      off.width = cols * cell * dpr
      off.height = rows * cell * dpr
      const c = off.getContext('2d')!
      c.scale(dpr, dpr)
      c.lineCap = 'round'
      c.lineJoin = 'round'
      c.beginPath()
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (grid[idx(x, y)] !== 1) continue
          const px = x * cell + cell / 2
          const py = y * cell + cell / 2
          if (x + 1 < cols && grid[idx(x + 1, y)] === 1) {
            c.moveTo(px, py)
            c.lineTo(px + cell, py)
          }
          if (y + 1 < rows && grid[idx(x, y + 1)] === 1) {
            c.moveTo(px, py)
            c.lineTo(px, py + cell)
          }
        }
      }
      c.strokeStyle = 'rgba(92, 112, 255, 0.10)'
      c.lineWidth = 9
      c.stroke()
      c.strokeStyle = 'rgba(128, 146, 255, 0.28)'
      c.lineWidth = 1.5
      c.stroke()
      walls = off
    }

    function resize() {
      vw = window.innerWidth
      vh = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, touch ? 1.25 : 1.5)
      canvas!.width = vw * dpr
      canvas!.height = vh * dpr
      docHeight = document.documentElement.scrollHeight

      // Mobile address bars change the height constantly, so only rebuild for real size changes.
      const key = `${vw}:${Math.ceil(vh / 240)}:${dpr}`
      if (key === sizeKey) return
      sizeKey = key
      cell = vw < 700 ? 40 : 52
      const need = Math.ceil(vw / cell) + 2
      cols = Math.max(9, need + ((5 - (need % 4)) % 4))
      rows = (Math.ceil((vh * 1.4) / cell) + 2) | 1
      originX = (vw - cols * cell) / 2
      grid = buildMaze(cols, rows)
      dots = new Uint8Array(grid.length)
      power = new Uint8Array(grid.length)
      prev = new Int32Array(grid.length)
      queue = new Int32Array(grid.length)
      refillDots()
      placeActors()
      drawWalls()
    }

    const visible = (i: number) => {
      const y = Math.floor(i / cols)
      const top = scrollY / cell
      return y >= top && y <= top + vh / cell
    }

    function steerPac(now: number) {
      const from = idx(pac.x, pac.y)
      const danger = (i: number) => {
        if (frightened > 0) return false
        const x = i % cols
        const y = (i - x) / cols
        return ghosts.some((g) => Math.abs(g.x - x) + Math.abs(g.y - y) <= 2)
      }
      let step = -1
      if (now < pointerUntil && pointerTile !== from) step = bfsStep(from, (i) => i === pointerTile, danger)
      if (step < 0) step = bfsStep(from, (i) => (dots[i] === 1 || power[i] === 1) && visible(i), danger)
      if (step < 0) step = bfsStep(from, (i) => dots[i] === 1 || power[i] === 1)
      if (step >= 0) moveTo(pac, step)
      else wander(pac)
    }

    function steerGhost(ghost: (typeof ghosts)[number]) {
      if (frightened <= 0 && Math.random() < ghost.chase) {
        const target = idx(pac.x, pac.y)
        const step = bfsStep(idx(ghost.x, ghost.y), (i) => i === target)
        if (step >= 0) return moveTo(ghost, step)
      }
      wander(ghost)
    }

    function advance(actor: Actor, speed: number, dt: number, steer: () => void) {
      if (actor.x === actor.nx && actor.y === actor.ny) steer()
      actor.t += speed * dt
      while (actor.t >= 1) {
        actor.t -= 1
        actor.x = actor.nx
        actor.y = actor.ny
        steer()
      }
    }

    function update(dt: number, now: number) {
      const span = Math.max(1, docHeight - vh)
      scrollTarget = (window.scrollY / span) * Math.max(0, rows * cell - vh)
      scrollY += (scrollTarget - scrollY) * (1 - Math.exp(-dt * 7))
      dotAlpha = Math.min(1, dotAlpha + dt * 1.2)
      frightened = Math.max(0, frightened - dt)

      if (deadFor > 0) {
        deadFor -= dt
        if (deadFor <= 0) placeActors()
        return
      }

      advance(pac, 4.6, dt, () => steerPac(now))
      const tile = idx(pac.x, pac.y)
      if (dots[tile]) {
        dots[tile] = 0
        dotsLeft--
        addScore(10)
      }
      if (power[tile]) {
        power[tile] = 0
        frightened = 7
        addScore(50)
      }
      if (dotsLeft <= 0) refillDots()

      const px = pac.x + (pac.nx - pac.x) * pac.t
      const py = pac.y + (pac.ny - pac.y) * pac.t
      for (const ghost of ghosts) {
        advance(ghost, frightened > 0 ? 2.5 : 3.7, dt, () => steerGhost(ghost))
        const gx = ghost.x + (ghost.nx - ghost.x) * ghost.t
        const gy = ghost.y + (ghost.ny - ghost.y) * ghost.t
        if (Math.hypot(gx - px, gy - py) < 0.62) {
          if (frightened > 0) {
            addScore(200)
            const home = tileNearCentre(Math.floor(cols / 2), Math.floor(rows / 2))
            ghost.x = ghost.nx = home % cols
            ghost.y = ghost.ny = (home - ghost.x) / cols
            ghost.t = 0
          } else {
            deadFor = 0.9
          }
        }
      }
    }

    function addScore(points: number) {
      score += points
      if (scoreRef.current) scoreRef.current.textContent = score.toLocaleString('en-US')
    }

    function drawPac(time: number) {
      const size = cell * 0.36
      const x = originX + (pac.x + (pac.nx - pac.x) * pac.t) * cell + cell / 2
      const y = (pac.y + (pac.ny - pac.y) * pac.t) * cell + cell / 2 - scrollY
      ctx!.drawImage(glow('#ffd60a'), x - cell * 1.2, y - cell * 1.2, cell * 2.4, cell * 2.4)
      const angle = Math.atan2(pac.dir[1], pac.dir[0])
      const dying = deadFor > 0 ? deadFor / 0.9 : 1
      const mouth = deadFor > 0 ? (1 - dying) * Math.PI : (Math.sin(time * 0.016) * 0.5 + 0.5) * 0.72 + 0.04
      ctx!.fillStyle = '#ffd60a'
      ctx!.beginPath()
      ctx!.moveTo(x, y)
      ctx!.arc(x, y, size, angle + mouth, angle + Math.PI * 2 - mouth)
      ctx!.closePath()
      ctx!.fill()
    }

    function drawGhost(ghost: (typeof ghosts)[number], time: number) {
      const size = cell * 0.33
      const x = originX + (ghost.x + (ghost.nx - ghost.x) * ghost.t) * cell + cell / 2
      const y = (ghost.y + (ghost.ny - ghost.y) * ghost.t) * cell + cell / 2 - scrollY
      if (y < -cell || y > vh + cell) return
      const scared = frightened > 0 && (frightened > 2 || Math.floor(time / 180) % 2 === 0)
      const color = scared ? FRIGHTENED : ghost.color
      const c = ctx!
      c.drawImage(glow(color), x - cell, y - cell, cell * 2, cell * 2)
      c.fillStyle = color
      c.beginPath()
      c.arc(x, y - size * 0.1, size, Math.PI, 0)
      const foot = y + size * 0.95
      c.lineTo(x + size, foot)
      const ripple = Math.sin(time * 0.012) * size * 0.14
      for (let i = 0; i < 3; i++) {
        const right = x + size - (i * 2 * size) / 3
        c.quadraticCurveTo(right - size / 3, foot - size * 0.32 + ripple, right - (2 * size) / 3, foot)
      }
      c.closePath()
      c.fill()
      c.fillStyle = '#fff'
      for (const side of [-1, 1]) {
        c.beginPath()
        c.arc(x + side * size * 0.38, y - size * 0.18, size * 0.26, 0, Math.PI * 2)
        c.fill()
      }
      c.fillStyle = '#11132e'
      for (const side of [-1, 1]) {
        c.beginPath()
        c.arc(x + side * size * 0.38 + ghost.dir[0] * size * 0.11, y - size * 0.18 + ghost.dir[1] * size * 0.11, size * 0.13, 0, Math.PI * 2)
        c.fill()
      }
    }

    function draw(time: number) {
      const c = ctx!
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
      c.clearRect(0, 0, vw, vh)
      if (walls) c.drawImage(walls, originX, -scrollY, cols * cell, rows * cell)

      const firstRow = Math.max(0, Math.floor(scrollY / cell))
      const lastRow = Math.min(rows - 1, Math.ceil((scrollY + vh) / cell))
      c.globalAlpha = dotAlpha * 0.5
      c.fillStyle = '#ffe9a8'
      c.beginPath()
      for (let y = firstRow; y <= lastRow; y++) {
        for (let x = 0; x < cols; x++) {
          if (!dots[idx(x, y)]) continue
          const px = originX + x * cell + cell / 2
          const py = y * cell + cell / 2 - scrollY
          c.moveTo(px + 2, py)
          c.arc(px, py, 2, 0, Math.PI * 2)
        }
      }
      c.fill()

      c.globalAlpha = dotAlpha
      const pulse = 5 + Math.sin(time * 0.005) * 1.5
      for (let y = firstRow; y <= lastRow; y++) {
        for (let x = 0; x < cols; x++) {
          if (!power[idx(x, y)]) continue
          const px = originX + x * cell + cell / 2
          const py = y * cell + cell / 2 - scrollY
          c.drawImage(glow('#ffd60a'), px - 22, py - 22, 44, 44)
          c.beginPath()
          c.arc(px, py, pulse, 0, Math.PI * 2)
          c.fill()
        }
      }
      c.globalAlpha = 1

      for (const ghost of ghosts) drawGhost(ghost, time)
      drawPac(time)
    }

    resize()
    scrollY = (window.scrollY / Math.max(1, docHeight - vh)) * Math.max(0, rows * cell - vh)

    const onResize = () => resize()
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || !cols) return
      const x = Math.floor((event.clientX - originX) / cell)
      const y = Math.floor((event.clientY + scrollY) / cell)
      pointerTile = tileNearCentre(x, y)
      pointerUntil = performance.now() + 2500
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onPointer, { passive: true })
    const pageObserver = new ResizeObserver(() => {
      docHeight = document.documentElement.scrollHeight
    })
    pageObserver.observe(document.body)

    let raf = 0, last = 0, minFrame = 0, slow = 0, frames = 0
    const started = performance.now()

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop)
      if (document.hidden) {
        last = 0
        return
      }
      if (time - last < minFrame) return
      const elapsed = last ? time - last : 16
      last = time

      // If this device cannot hold the frame rate, drop the costly glass and half the canvas rate.
      if (!minFrame && time - started > 3000) {
        frames++
        slow += elapsed
        if (frames === 120) {
          if (slow / frames > 28) {
            document.documentElement.classList.add('lite')
            minFrame = 32
          }
          frames = 0
          slow = 0
        }
      }

      update(Math.min(elapsed, 50) / 1000, performance.now())
      draw(time)
    }

    if (still) {
      dotAlpha = 1
      draw(0)
    } else {
      raf = requestAnimationFrame(loop)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onPointer)
      pageObserver.disconnect()
    }
  }, [])

  return (
    <div className="field" aria-hidden="true">
      <div className="aurora"><i /><i /><i /></div>
      <canvas ref={canvasRef} className="field-canvas" />
      <div className="field-vignette" />
      <div className="field-score">
        <span className="field-score-pac" />
        <span ref={scoreRef}>0</span>
      </div>
    </div>
  )
}
