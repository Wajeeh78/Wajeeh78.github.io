import Lenis from 'lenis'

/* Shared spring so every surface on the page moves with the same weight. */
export const liquid = { type: 'spring', stiffness: 110, damping: 20, mass: 0.9 } as const
export const jelly = { type: 'spring', stiffness: 420, damping: 18, mass: 0.6 } as const

let lenis: Lenis | null = null

export function startSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
  let raf = requestAnimationFrame(function loop(time) {
    lenis?.raf(time)
    raf = requestAnimationFrame(loop)
  })
  return () => {
    cancelAnimationFrame(raf)
    lenis?.destroy()
    lenis = null
  }
}

export function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) lenis.scrollTo(target, { offset: id === 'hero' ? 0 : -24, duration: 1.4 })
  else target.scrollIntoView()
}

/* Lets a "Request this paper" button anywhere on the page fill in the form. */
export interface ContactIntent {
  topic: 'query' | 'paper' | 'collaboration' | 'cv'
  paper?: string
}

export const CONTACT_EVENT = 'contact:intent'

export function openContact(intent: ContactIntent) {
  window.dispatchEvent(new CustomEvent<ContactIntent>(CONTACT_EVENT, { detail: intent }))
  scrollToSection('contact')
}
