import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import { LinkedinIcon, GithubIcon, GoogleScholarIcon } from './SocialIcons'
import Glass from './Glass'
import CvButton from './CvButton'
import { site } from '../data/site'
import { jelly, liquid, scrollToSection } from '../lib/motion'

function Letters({ text, className, delay }: { text: string; className?: string; delay: number }) {
  return (
    <span className={`hero-line ${className ?? ''}`} aria-hidden="true">
      {text.split('').map((letter, i) => (
        <span key={i} className="letter-mask">
          <motion.span
            className="letter"
            initial={{ y: '110%', rotate: 8 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ ...liquid, delay: delay + i * 0.045 }}
          >
            {letter}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-34%'])
  const nameScale = useTransform(scrollYProgress, [0, 1], [1, 0.86])
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -70])

  const socials = [
    { href: site.links.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={17} /> },
    { href: site.links.github, label: 'GitHub', icon: <GithubIcon size={17} /> },
    { href: site.links.scholar, label: 'Google Scholar', icon: <GoogleScholarIcon size={17} /> },
  ].filter((social) => social.href)

  return (
    <section id="hero" ref={ref} className="hero" aria-labelledby="hero-heading">
      <motion.h1 id="hero-heading" className="hero-name" aria-label={site.name} style={{ y: nameY, scale: nameScale }}>
        <Letters text="Wajeeh" delay={0.25} />
        <Letters text="Ahmed" className="serif" delay={0.5} />
      </motion.h1>

      <motion.div style={{ y: cardY }} className="hero-card-wrap">
        <Glass
          refract={24}
          reveal={false}
          className="hero-card"
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...liquid, delay: 0.95 }}
        >
          <div className="hero-card-copy">
            <p className="eyebrow">AI/ML Researcher · SZABIST Islamabad · AI-EYS</p>
            <p className="hero-lede">
              I build, test, and work on systems that defend networks, from websites to industrial systems. Award-winning
              researcher with <strong>Best Paper</strong>, <strong>Best Presentation</strong>, and{' '}
              <strong>Best Poster</strong> wins, and I'm open to research and industry roles.
            </p>
            <p className="hero-meta">
              <MapPin size={14} /> {site.location}
            </p>
          </div>
          <div className="hero-card-actions">
            <CvButton />
            <motion.button
              className="btn btn-glass"
              onClick={() => scrollToSection('contact')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scaleX: 1.08, scaleY: 0.92 }}
              transition={jelly}
            >
              Get in touch
            </motion.button>
            <div className="hero-socials">
              {socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-btn"
                  aria-label={social.label}
                  title={social.label}
                  whileHover={{ scale: 1.14, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  transition={jelly}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </Glass>
      </motion.div>

      <motion.button
        className="scroll-cue"
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <ArrowDown size={16} />
      </motion.button>
    </section>
  )
}
