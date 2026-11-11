import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import SectionHead from './SectionHead'
import { experience } from '../data/site'
import { liquid } from '../lib/motion'

/* A single line runs down the section and fills as you scroll. Each
   organisation is a stop on the line; extra roles there are smaller stops. */
export default function Journey() {
  const lineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: lineRef, offset: ['start 0.75', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="journey" className="section" aria-labelledby="journey-heading">
      <SectionHead id="journey-heading" eyebrow="Journey" title="Work Experience" />

      <div ref={lineRef} className="timeline work">
        <span className="timeline-track" aria-hidden="true">
          <motion.span className="timeline-fill" style={{ scaleY: fill }} />
        </span>

        <ol className="work-list">
          {experience.map((job) => (
            <motion.li
              key={job.org}
              className="work-item"
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-12% 0px' }}
              transition={liquid}
            >
              <span className="timeline-dot" aria-hidden="true" />
              <h3 className="work-org">{job.org}</h3>

              <ol className="work-roles">
                {job.roles.map((item) => (
                  <li key={item.role} className={`work-role ${job.roles.length > 1 ? 'is-sub' : ''}`}>
                    {job.roles.length > 1 && <span className="work-subdot" aria-hidden="true" />}
                    <div className="work-role-head">
                      <p className="job-role">{item.role}</p>
                      <time className="mono-note">{item.period}</time>
                    </div>
                    {item.bullets.length > 0 && (
                      <ul className="bullets">
                        {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
