import { useState, type CSSProperties } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import Glass from './Glass'
import SectionHead from './SectionHead'
import { caseStudy } from '../data/site'
import { jelly } from '../lib/motion'

const allNodes = caseStudy.architecture.flat()

function Architecture() {
  const [active, setActive] = useState(allNodes[2].id)
  const node = allNodes.find((item) => item.id === active)!

  return (
    <div className="case-step">
      <div className="arch-frame">
        <p className="mono-note arch-frame-label">Docker Compose</p>
        <div className="arch">
          {caseStudy.architecture.map((row, i) => (
            <div key={i}>
              {i > 0 && <div className="arch-link" aria-hidden="true"><ArrowDown size={16} /></div>}
              <div className="arch-row" style={{ '--n': row.length } as CSSProperties}>
                {row.map((item) => (
                  <button
                    key={item.id}
                    className={`arch-node ${active === item.id ? 'active' : ''}`}
                    onClick={() => setActive(item.id)}
                    aria-pressed={active === item.id}
                  >
                    <span className="arch-node-name">{item.name}</span>
                    <span className="arch-node-tech">{item.tech}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={node.id}
            className="arch-detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            aria-live="polite"
          >
            <p className="mono-note">{node.tech}</p>
            <h4>{node.name}</h4>
            <p>{node.detail}</p>
          </motion.div>
        </AnimatePresence>
        <p className="mono-note arch-hint">Tip: click any box in the diagram.</p>
      </div>
    </div>
  )
}

export default function CaseStudy() {
  const [index, setIndex] = useState(0)
  const step = caseStudy.steps[index]
  const last = caseStudy.steps.length - 1

  return (
    <section id="case-study" className="section" aria-labelledby="case-heading">
      <SectionHead id="case-heading" eyebrow="Case Study" title="From problem to product" />

      <Glass className="case">
        <header className="case-head">
          <div>
            <h3 className="case-title">{caseStudy.title}</h3>
            <p className="case-sub">{caseStudy.tagline}</p>
          </div>
          <div className="case-facts">
            <span className="case-status">{caseStudy.status}</span>
            <span className="mono-note">{caseStudy.context}</span>
          </div>
        </header>

        <LayoutGroup id="case-tabs">
          <div className="case-tabs">
            <div className="segments" role="tablist" aria-label="Case study steps">
              {caseStudy.steps.map((item, i) => (
                <button
                  key={item.id}
                  role="tab"
                  id={`case-tab-${item.id}`}
                  aria-selected={index === i}
                  aria-controls="case-panel"
                  className={`segment ${index === i ? 'active' : ''}`}
                  onClick={() => setIndex(i)}
                >
                  {index === i && <motion.span layoutId="case-droplet" className="droplet" transition={jelly} />}
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </LayoutGroup>

        <div id="case-panel" role="tabpanel" aria-labelledby={`case-tab-${step.id}`} className="case-panel">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.26, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="case-step" style={{ marginBottom: step.id === 'architecture' ? 20 : 0 }}>
                <div>
                  <p className="case-step-num">{String(index + 1).padStart(2, '0')} / {String(last + 1).padStart(2, '0')}</p>
                  <h4 className="case-step-title">{step.title}</h4>
                  <p className="case-step-body">{step.body}</p>
                </div>
                {step.points.length > 0 && (
                  <ul className="case-points">
                    {step.points.map((point) => (
                      <li key={point} className="case-point"><Check size={16} /> {point}</li>
                    ))}
                  </ul>
                )}
              </div>
              {step.id === 'architecture' && <Architecture />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="case-nav">
          <button className="btn btn-glass btn-compact" onClick={() => setIndex(index - 1)} disabled={index === 0} style={{ opacity: index === 0 ? 0.4 : 1 }}>
            <ArrowLeft size={14} /> Previous
          </button>
          <button className="btn btn-glass btn-compact" onClick={() => setIndex(index === last ? 0 : index + 1)}>
            {index === last ? 'Start over' : <>Next: {caseStudy.steps[index + 1].label}</>} <ArrowRight size={14} />
          </button>
        </div>

        <div className="case-stack">
          <p className="mono-note">Stack</p>
          <div className="chips">
            {caseStudy.stack.map((tech) => <span key={tech} className="chip">{tech}</span>)}
          </div>
        </div>
      </Glass>
    </section>
  )
}
