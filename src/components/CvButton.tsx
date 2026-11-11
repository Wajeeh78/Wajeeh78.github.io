import { motion } from 'framer-motion'
import { Download, Eye } from 'lucide-react'
import { publicUrl, site } from '../data/site'
import { jelly, openContact } from '../lib/motion'

const squish = { whileHover: { scale: 1.04 }, whileTap: { scaleX: 1.08, scaleY: 0.92 }, transition: jelly }

/** Downloads the CV, or asks for it through the contact form until a file is set. */
export default function CvButton({ compact = false }: { compact?: boolean }) {
  const className = `btn btn-primary ${compact ? 'btn-compact' : ''}`

  if (!site.cvFile) {
    return (
      <motion.button className={className} onClick={() => openContact({ topic: 'cv' })} {...squish}>
        <Download size={compact ? 14 : 17} />
        {compact ? 'CV' : 'Request my CV'}
      </motion.button>
    )
  }

  const href = publicUrl(`cv/${site.cvFile}`)
  const download = (
    <motion.a className={className} href={href} download={`${site.name} CV.pdf`} {...squish}>
      <Download size={compact ? 14 : 17} />
      {compact ? 'CV' : 'Download CV'}
    </motion.a>
  )
  if (compact) return download

  // Full size: read it in a new tab, or save a copy.
  return (
    <>
      {download}
      <motion.a className="btn btn-glass" href={href} target="_blank" rel="noopener noreferrer" {...squish}>
        <Eye size={17} />
        View CV
      </motion.a>
    </>
  )
}
