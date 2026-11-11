import { motion } from 'framer-motion'
import { liquid } from '../lib/motion'

interface SectionHeadProps {
  id: string
  eyebrow: string
  title: string
}

/* The heading words rise out of a mask, one after another. The heading itself
   triggers the animation, because a masked word is clipped and never "in view". */
export default function SectionHead({ id, eyebrow, title }: SectionHeadProps) {
  return (
    <div className="section-head">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={liquid}
      >
        {eyebrow}
      </motion.p>
      <motion.h2
        id={id}
        className="section-title"
        aria-label={title}
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.06 }}
      >
        {title.split(' ').map((word, i) => (
          <span key={i} className="word-mask" aria-hidden="true">
            <motion.span
              className="word"
              variants={{ hidden: { y: '115%' }, shown: { y: 0 } }}
              transition={{ ...liquid, delay: i * 0.06 }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.h2>
    </div>
  )
}
