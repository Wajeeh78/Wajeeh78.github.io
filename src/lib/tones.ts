/* One colour per kind of recognition, borrowed from the Pac-Man cast, used
   everywhere that recognition appears (badges, award cards, hero text). */

export type Tone = 'first' | 'paper' | 'presentation' | 'poster' | 'milestone' | 'instructor'

const byLabel: Record<string, Tone> = {
  'first author': 'first',
  'best paper award': 'paper',
  'best paper': 'paper',
  'best presentation award': 'presentation',
  'best presentation': 'presentation',
  'best poster award': 'poster',
  'best poster': 'poster',
  'cisco instructor award': 'instructor',
}

/** The tone for a badge label, or undefined for neutral labels such as "Co-author". */
export const toneFor = (label: string): Tone | undefined => byLabel[label.trim().toLowerCase()]
