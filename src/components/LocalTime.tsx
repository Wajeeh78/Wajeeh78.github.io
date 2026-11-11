import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Moon, Sun, Sunrise, Sunset } from 'lucide-react'

/* Wajeeh's local time in Islamabad, with a hint about when to expect a reply.
   Updates every 30 seconds; nothing runs between ticks. */

const ZONE = 'Asia/Karachi'

function parts(date: Date) {
  const time = new Intl.DateTimeFormat('en-US', { timeZone: ZONE, hour: 'numeric', minute: '2-digit' }).format(date)
  const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: ZONE, hour: 'numeric', hourCycle: 'h23' }).format(date))
  return { time, hour }
}

/** Hours between Islamabad and the visitor, e.g. "3h ahead of you". */
function offsetLabel(date: Date) {
  const there = new Date(date.toLocaleString('en-US', { timeZone: ZONE }))
  const here = new Date(date.toLocaleString('en-US'))
  const diff = Math.round((there.getTime() - here.getTime()) / 36e5 * 2) / 2
  if (diff === 0) return 'same time as you'
  const h = Math.abs(diff)
  return `${h}h ${diff > 0 ? 'ahead of' : 'behind'} you`
}

function status(hour: number) {
  if (hour >= 9 && hour < 18) return { icon: Sun, text: 'Working hours · replies within a few hours', awake: true }
  if (hour >= 18 && hour < 23) return { icon: Sunset, text: 'Evening · usually replies the same day', awake: true }
  if (hour >= 6 && hour < 9) return { icon: Sunrise, text: 'Early morning · replies later today', awake: true }
  return { icon: Moon, text: 'Probably asleep · replies by morning', awake: false }
}

export default function LocalTime({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const { time, hour } = parts(now)
  const s = status(hour)
  const Icon = s.icon

  return (
    <span className={`local-time ${compact ? 'compact' : ''}`}>
      <motion.span
        className={`local-time-icon ${s.awake ? 'awake' : 'asleep'}`}
        animate={s.awake ? { rotate: [0, 12, 0] } : { y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <Icon size={14} />
      </motion.span>
      <span>
        <strong className="local-time-clock">{time}</strong> in Islamabad
        <span className="local-time-offset"> ({offsetLabel(now)})</span>
        {!compact && <span className="local-time-status"> · {s.text}</span>}
      </span>
    </span>
  )
}
