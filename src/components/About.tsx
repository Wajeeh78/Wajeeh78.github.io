import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'

const statement =
  "AI is our most powerful tool for solving global challenges, and I didn't wait for grad school to start building with it. As a 7th-semester CS undergraduate, I've earned four Springer-indexed publications and become the youngest author at my institution, working on deep learning, artificial intelligence and scalable systems. Next: high-impact AI for social good, with research teams worldwide."

/* Each word lights up as the statement moves through the viewport. */
function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const reduced = useReducedMotion()
  const opacity = useTransform(progress, range, [reduced ? 1 : 0.16, 1])
  return <motion.span style={{ opacity }}>{word} </motion.span>
}

export default function About() {
  const statementRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: statementRef, offset: ['start 0.85', 'end 0.45'] })
  const words = statement.split(' ')

  return (
    <section id="about" className="section" aria-label="About">
      <p className="eyebrow">About</p>
      <p ref={statementRef} className="statement" aria-label={statement}>
        <span aria-hidden="true">
          {words.map((word, i) => (
            <Word key={i} word={word} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} />
          ))}
        </span>
      </p>
    </section>
  )
}
