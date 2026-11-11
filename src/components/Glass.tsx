import { useEffect, useRef, type RefObject } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { liquid } from '../lib/motion'

/* ─── Edge refraction ──────────────────────────────────────────────────
   Chromium can run an SVG filter on the backdrop, so there the rim of a
   panel bends what is behind it like a real lens. Each panel gets a
   displacement map drawn from its own rounded shape. Other browsers keep
   the blur, tint and highlights from .glass in index.css. */

const canRefract = () =>
  /Chrome\//.test(navigator.userAgent) &&
  !/Mobi|Android/.test(navigator.userAgent) &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

let filterId = 0

function filterHost() {
  let host = document.getElementById('glass-filters') as SVGSVGElement | null
  if (!host) {
    host = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    host.id = 'glass-filters'
    host.setAttribute('aria-hidden', 'true')
    host.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none'
    document.body.appendChild(host)
  }
  return host
}

function drawMap(width: number, height: number, radius: number, bezel: number) {
  const scale = 0.25 // the map is smooth, so quarter resolution is plenty and 4x cheaper
  const w = Math.max(2, Math.round(width * scale))
  const h = Math.max(2, Math.round(height * scale))
  const r = Math.min(radius, width / 2, height / 2) * scale
  const b = bezel * scale
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(w, h)

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = x + 0.5 - w / 2
      const py = y + 0.5 - h / 2
      const qx = Math.abs(px) - (w / 2 - r)
      const qy = Math.abs(py) - (h / 2 - r)
      const ox = Math.max(qx, 0)
      const oy = Math.max(qy, 0)
      const outer = Math.hypot(ox, oy)
      const depth = r - (outer + Math.min(Math.max(qx, qy), 0))

      let dx = 0
      let dy = 0
      if (depth < b) {
        let nx = 0
        let ny = 0
        if (outer > 0) {
          nx = ox / outer
          ny = oy / outer
        } else if (qx > qy) nx = 1
        else ny = 1
        const strength = (1 - Math.max(depth, 0) / b) ** 2
        dx = -nx * Math.sign(px) * strength
        dy = -ny * Math.sign(py) * strength
      }

      const i = (y * w + x) * 4
      img.data[i] = 128 + dx * 127
      img.data[i + 1] = 128 + dy * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

function useRefraction(ref: RefObject<HTMLElement | null>, depth: number | undefined) {
  useEffect(() => {
    const el = ref.current
    if (!el || !depth || !canRefract()) return

    const id = `glass-${++filterId}`
    const svgNs = 'http://www.w3.org/2000/svg'
    const filter = document.createElementNS(svgNs, 'filter')
    filter.id = id
    filter.setAttribute('color-interpolation-filters', 'sRGB')
    filter.setAttribute('filterUnits', 'userSpaceOnUse')
    const image = document.createElementNS(svgNs, 'feImage')
    image.setAttribute('result', 'map')
    image.setAttribute('preserveAspectRatio', 'none')
    const displace = document.createElementNS(svgNs, 'feDisplacementMap')
    displace.setAttribute('in', 'SourceGraphic')
    displace.setAttribute('in2', 'map')
    displace.setAttribute('xChannelSelector', 'R')
    displace.setAttribute('yChannelSelector', 'G')
    displace.setAttribute('scale', String(depth))
    filter.append(image, displace)
    filterHost().appendChild(filter)

    let timer = 0
    let idle = 0
    let lastSize = ''
    const apply = () => {
      const width = el.offsetWidth
      const height = el.offsetHeight
      if (!width || !height) return
      // Building the map is the costly part, so skip it when nothing changed.
      const size = `${width}x${height}`
      if (size === lastSize) return
      lastSize = size
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
      for (const node of [filter, image]) {
        node.setAttribute('x', '0')
        node.setAttribute('y', '0')
        node.setAttribute('width', String(width))
        node.setAttribute('height', String(height))
      }
      image.setAttribute('href', drawMap(width, height, radius, Math.min(26, height / 2.4)))
      el.style.backdropFilter = `blur(14px) url(#${id}) saturate(175%) brightness(1.06)`
    }
    // Build the map when the browser is idle, so it never lands in the middle of a scroll.
    const whenIdle = (fn: () => void) =>
      'requestIdleCallback' in window ? window.requestIdleCallback(fn, { timeout: 1500 }) : (setTimeout(fn, 200) as unknown as number)
    const observer = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = window.setTimeout(() => {
        idle = whenIdle(apply)
      }, 200)
    })
    observer.observe(el)
    idle = whenIdle(apply)

    return () => {
      clearTimeout(timer)
      if ('cancelIdleCallback' in window) window.cancelIdleCallback(idle)
      observer.disconnect()
      filter.remove()
      el.style.backdropFilter = ''
    }
  }, [ref, depth])
}

/* ─── Glass panel ──────────────────────────────────────────────────────
   Opacity has to animate on the panel itself. An ancestor with opacity
   below 1 cuts the panel off from what is behind it, and the blur pops. */

type GlassProps = HTMLMotionProps<'div'> & {
  /** Strength of the edge refraction in px. Keep it to a few key panels. */
  refract?: number
  reveal?: boolean
  delay?: number
}

export default function Glass({ refract, reveal = true, delay = 0, className = '', children, ...rest }: GlassProps) {
  const ref = useRef<HTMLDivElement>(null)
  useRefraction(ref, refract)

  const revealProps = reveal
    ? {
        initial: { opacity: 0, y: 56, scale: 0.965 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: '-6% 0px' },
        transition: { ...liquid, delay },
      }
    : {}

  return (
    <motion.div ref={ref} className={`glass ${className}`} {...revealProps} {...rest}>
      {children}
    </motion.div>
  )
}
