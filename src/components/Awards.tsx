import { ArrowDownRight, GraduationCap } from 'lucide-react'
import Glass from './Glass'
import SectionHead from './SectionHead'
import { certifications, honors, publications } from '../data/site'
import { scrollToSection } from '../lib/motion'

export default function Awards() {
  return (
    <section id="awards" className="section" aria-labelledby="awards-heading">
      <SectionHead id="awards-heading" eyebrow="Recognition" title="Awards & Certifications" />

      <div className="honors">
        {honors.map((honor, i) => {
          const paper = publications.find((pub) => pub.id === honor.paper)
          return (
            <Glass key={honor.title} className={`honor tone-${honor.kind}`} delay={(i % 2) * 0.08}>
              <span className="honor-icon" aria-hidden="true"><span className="pac-mini pac-lg" /></span>
              <div className="honor-body">
                <p className="mono-note">{honor.event}</p>
                <h3 className="honor-title">{honor.title}</h3>
                {paper && (
                  <button className="honor-paper" onClick={() => scrollToSection(paper.id)}>
                    <span className="honor-paper-label">{paper.status === 'presented' ? 'Upcoming paper' : 'Paper'}</span>
                    <span className="honor-paper-title">{paper.title}</span>
                    <ArrowDownRight size={14} className="honor-paper-arrow" />
                  </button>
                )}
              </div>
            </Glass>
          )
        })}
      </div>

      <div className="certs">
        <div className="pub-group-head">
          <h3 className="pub-group-title">Certifications</h3>
          <span className="pub-count">{certifications.length}</span>
        </div>
        <ul className="cert-list">
          {certifications.map((cert) => (
            <li key={cert.title} className="cert">
              <GraduationCap size={18} className="cert-icon" aria-hidden="true" />
              <span className="cert-title">{cert.title}</span>
              <span className="cert-issuer">{cert.issuer}</span>
              <time className="mono-note cert-date">{cert.date}</time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
