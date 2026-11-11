import { Fragment } from 'react'
import { motion } from 'framer-motion'
import { Award, FileText, ArrowUpRight, MapPin } from 'lucide-react'
import Glass from './Glass'
import SectionHead from './SectionHead'
import { GithubIcon, GoogleScholarIcon } from './SocialIcons'
import { me, publications, site, type Publication } from '../data/site'
import { jelly, openContact } from '../lib/motion'

const published = publications.filter((pub) => pub.status === 'published')
const presented = publications.filter((pub) => pub.status === 'presented')

function role(pub: Publication) {
  if (pub.role) return pub.role
  const at = pub.authors.indexOf(me)
  if (at === 0) return 'First author'
  if (at > 0) return 'Co-author'
  return ''
}

function Authors({ authors }: { authors: string[] }) {
  if (!authors.length) return null
  return (
    <p className="pub-authors">
      {authors.map((name, i) => (
        <Fragment key={name}>
          {i > 0 && ', '}
          {name === me ? <span className="pub-me">{name}</span> : name}
        </Fragment>
      ))}
    </p>
  )
}

function PaperCard({ pub, index }: { pub: Publication; index: number }) {
  const who = role(pub)
  return (
    <Glass id={pub.id} className={`pub pub-${pub.status}`} delay={index * 0.07}>
      <div className="pub-side">
        <span className="pub-index">{String(index + 1).padStart(2, '0')}</span>
        <p className="pub-venue">{pub.venue}</p>
        {(pub.year || pub.location) && (
          <p className="mono-note pub-meta">
            {pub.location && <MapPin size={12} />}
            {[pub.location, pub.year].filter(Boolean).join(' · ')}
          </p>
        )}
        {who && <span className={`pub-role ${who === 'First author' ? 'lead' : ''}`}>{who}</span>}
        {pub.awards.map((award) => (
          <span key={award} className="award"><Award size={13} /> {award}</span>
        ))}
      </div>

      <div className="pub-main">
        <h4 className="pub-title">{pub.title}</h4>
        <Authors authors={pub.authors} />
        {pub.detail && <p className="pub-detail">{pub.detail}</p>}
        {pub.summary && <p className="card-body pub-summary">{pub.summary}</p>}
        <div className="chips">
          {pub.tags.map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      </div>

      <div className="pub-actions">
        {pub.href && (
          <a className="btn btn-glass btn-compact" href={pub.href} target="_blank" rel="noopener noreferrer">
            Read on Springer <ArrowUpRight size={14} />
          </a>
        )}
        {pub.code && (
          <a className="btn btn-glass btn-compact" href={pub.code} target="_blank" rel="noopener noreferrer">
            <GithubIcon size={14} /> Code
          </a>
        )}
        <motion.button
          className="btn btn-glass btn-compact"
          onClick={() => openContact({ topic: 'paper', paper: pub.title })}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scaleX: 1.08, scaleY: 0.92 }}
          transition={jelly}
        >
          <FileText size={14} /> Request a copy
        </motion.button>
      </div>
    </Glass>
  )
}

function Group({ title, note, items }: { title: string; note: string; items: Publication[] }) {
  if (!items.length) return null
  return (
    <div className="pub-group">
      <div className="pub-group-head">
        <h3 className="pub-group-title">{title}</h3>
        <span className="pub-count">{items.length}</span>
        <p className="mono-note pub-group-note">{note}</p>
      </div>
      <div className="stack">
        {items.map((pub, i) => <PaperCard key={pub.id} pub={pub} index={i} />)}
      </div>
    </div>
  )
}

export default function Research() {
  return (
    <section id="research" className="section" aria-labelledby="research-heading">
      <SectionHead id="research-heading" eyebrow="Research" title="Publications & talks" />

      <p className="research-lede">
        My research spans <strong>agentic AI systems</strong>, <strong>machine learning algorithms</strong>,{' '}
        <strong>intrusion and threat detection</strong>, and <strong>unified memory architectures</strong>. I
        build intelligent systems that stay secure, efficient, and deployable beyond the data center.
      </p>

      <Group title="Publications" note="Peer-reviewed · Springer" items={published} />
      <Group title="Presented & upcoming" note="Presented at international conferences · in press" items={presented} />

      {site.links.scholar && (
        <a className="btn btn-glass section-cta" href={site.links.scholar} target="_blank" rel="noopener noreferrer">
          <GoogleScholarIcon size={15} /> Google Scholar profile
        </a>
      )}
    </section>
  )
}
