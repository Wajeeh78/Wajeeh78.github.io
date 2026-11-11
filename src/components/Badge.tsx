import { toneFor, type Tone } from '../lib/tones'

/** A pill with a small Pac-Man in the recognition's colour. Neutral labels get a plain pill. */
export default function Badge({ label, tone }: { label: string; tone?: Tone }) {
  const t = tone ?? toneFor(label)
  if (!t) return <span className="badge">{label}</span>
  return (
    <span className={`badge badge-toned tone-${t}`}>
      <span className="pac-mini" aria-hidden="true" />
      {label}
    </span>
  )
}

/** Inline text in a recognition's colour, e.g. "Best Paper" in a sentence. */
export function Mark({ children, tone }: { children: string; tone?: Tone }) {
  const t = tone ?? toneFor(children)
  return <strong className={t ? `mark tone-${t}` : undefined}>{children}</strong>
}
