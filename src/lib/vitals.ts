/* Real performance numbers for the stats panel, read from the browser's own
   Performance APIs. Observers start as soon as this module loads (main.tsx
   imports it first), and they are buffered, so nothing from the load is missed. */

export interface Vitals {
  /** Time until the load event, in ms. */
  load: number
  fcp: number
  lcp: number
  cls: number
  /** Bytes over the network (or decoded size when served from cache). */
  bytes: number
  requests: number
  /** When the visitor arrived, for the time-on-page clock. */
  startedAt: number
}

const v: Vitals = { load: 0, fcp: 0, lcp: 0, cls: 0, bytes: 0, requests: 0, startedAt: Date.now() }

const observe = (type: string, fn: (entries: PerformanceEntryList) => void) => {
  try {
    new PerformanceObserver((list) => fn(list.getEntries())).observe({ type, buffered: true })
  } catch {
    /* not supported in this browser */
  }
}

observe('paint', (entries) => {
  for (const e of entries) if (e.name === 'first-contentful-paint') v.fcp = e.startTime
})
observe('largest-contentful-paint', (entries) => {
  const last = entries[entries.length - 1]
  if (last) v.lcp = last.startTime
})
observe('layout-shift', (entries) => {
  for (const e of entries as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
    if (!e.hadRecentInput) v.cls += e.value
  }
})

export function readVitals(): Vitals {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (nav && nav.loadEventEnd > 0) v.load = nav.loadEventEnd
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  const size = (e: PerformanceResourceTiming | PerformanceNavigationTiming) => e.transferSize || e.encodedBodySize || 0
  v.bytes = resources.reduce((sum, e) => sum + size(e), nav ? size(nav) : 0)
  v.requests = resources.length + 1
  return { ...v }
}

/** A friendly letter grade from Google's Core Web Vitals thresholds and the live frame rate. */
export function grade(x: Vitals, fps: number) {
  let points = 0
  points += x.lcp && x.lcp < 1200 ? 3 : x.lcp < 2500 ? 2 : 0
  points += x.cls < 0.05 ? 3 : x.cls < 0.1 ? 2 : 0
  points += fps >= 55 ? 3 : fps >= 45 ? 2 : fps >= 30 ? 1 : 0
  if (points >= 9) return { letter: 'A+', line: 'Faster than Pac-Man with a power pellet.' }
  if (points >= 7) return { letter: 'A', line: 'Smooth. The ghosts cannot keep up.' }
  if (points >= 5) return { letter: 'B', line: 'Pretty quick on this device.' }
  return { letter: 'C', line: 'Your device is working hard. Pac-Man is too.' }
}
