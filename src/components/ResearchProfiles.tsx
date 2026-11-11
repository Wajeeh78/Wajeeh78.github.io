import type { CSSProperties, ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { OrcidIcon, ResearchGateIcon, ScholarLogo } from './SocialIcons'
import { site } from '../data/site'

interface Profile {
  name: string
  blurb: string
  href: string
  brand: string
  logo: ReactNode
}

export const researchProfiles = (size = 26): Profile[] => [
  { name: 'Google Scholar', blurb: 'Papers and citations', href: site.links.scholar, brand: '#4285F4', logo: <ScholarLogo size={size} /> },
  { name: 'ResearchGate', blurb: 'Publications and research network', href: site.links.researchgate, brand: '#00CCBB', logo: <ResearchGateIcon size={size} /> },
  { name: 'ORCID', blurb: 'iD 0009-0002-2007-1562', href: site.links.orcid, brand: '#A6CE39', logo: <OrcidIcon size={size} /> },
]

const card = {
  hidden: { opacity: 0, y: 46, rotate: -4, scale: 0.92 },
  shown: (i: number) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 160, damping: 14, mass: 0.8, delay: i * 0.12 },
  }),
}

// Children need every parent state named, so they settle back after a hover.
const wiggle = {
  hidden: { rotate: 0, scale: 1 },
  shown: { rotate: 0, scale: 1 },
  hover: { rotate: [0, -16, 12, -6, 0], scale: 1.14, transition: { duration: 0.6 } },
}

const nudge = { hidden: { x: 0, y: 0 }, shown: { x: 0, y: 0 }, hover: { x: 3, y: -3 } }

/* Research profile cards. On hover the logo wiggles and a Pac-Man in the
   brand's colour eats the row of dots along the bottom of the card. */
export default function ResearchProfiles() {
  const profiles = researchProfiles()

  return (
    <div className="profiles-block">
      <p className="mono-note profiles-label">Find my research on</p>
      <div className="profiles">
        {profiles.map((profile, i) => {
          const live = Boolean(profile.href)
          const style = { '--brand': profile.brand } as CSSProperties
          const body = (
            <>
              <motion.span className="profile-logo" variants={wiggle}>{profile.logo}</motion.span>
              <span className="profile-text">
                <span className="profile-name">{profile.name}</span>
                <span className="profile-blurb">{live ? profile.blurb : 'Link coming soon'}</span>
              </span>
              {live && (
                <motion.span className="profile-arrow" variants={nudge}><ArrowUpRight size={16} /></motion.span>
              )}
              <span className="profile-track" aria-hidden="true">
                <span className="profile-dots" />
                <span className="profile-pac" />
              </span>
            </>
          )

          return live ? (
            <motion.a
              key={profile.name}
              className="glass profile"
              style={style}
              href={profile.href}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={card}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: '-8% 0px' }}
              whileHover="hover"
              whileTap={{ scale: 0.97 }}
            >
              {body}
            </motion.a>
          ) : (
            <motion.div
              key={profile.name}
              className="glass profile is-pending"
              style={style}
              custom={i}
              variants={card}
              initial="hidden"
              whileInView="shown"
              viewport={{ once: true, margin: '-8% 0px' }}
            >
              {body}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
