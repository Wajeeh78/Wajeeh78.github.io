import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Check, Mail, MapPin, Send } from 'lucide-react'
import { LinkedinIcon, GithubIcon, OrcidIcon, ResearchGateIcon, ScholarLogo } from './SocialIcons'
import Glass from './Glass'
import CvButton from './CvButton'
import SectionHead from './SectionHead'
import { publications, site } from '../data/site'
import { CONTACT_EVENT, jelly, liquid, type ContactIntent } from '../lib/motion'

type Topic = ContactIntent['topic']
type Status = 'idle' | 'sending' | 'sent' | 'handed-off' | 'error'

const topics: { id: Topic; label: string; prompt: string }[] = [
  { id: 'hiring', label: 'Hiring', prompt: 'Tell me about the role, the team, and the timeline.' },
  { id: 'query', label: 'Query', prompt: 'What would you like to ask?' },
  { id: 'paper', label: 'Research paper', prompt: 'Anything I should know about your request? (optional)' },
  { id: 'collaboration', label: 'Collaboration', prompt: 'Tell me about the project and how we could work together.' },
  { id: 'cv', label: 'CV', prompt: 'Anything I should know about your request? (optional)' },
]

const emptyForm = { name: '', email: '', affiliation: '', message: '' }

export default function Contact() {
  const [topic, setTopic] = useState<Topic>('hiring')
  const [paper, setPaper] = useState(publications[0].title)
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const onIntent = (event: Event) => {
      const { topic: nextTopic, paper: nextPaper } = (event as CustomEvent<ContactIntent>).detail
      setTopic(nextTopic)
      if (nextPaper) setPaper(nextPaper)
      setStatus('idle')
    }
    window.addEventListener(CONTACT_EVENT, onIntent)
    return () => window.removeEventListener(CONTACT_EVENT, onIntent)
  }, [])

  const current = topics.find((item) => item.id === topic)!
  const messageRequired = topic === 'hiring' || topic === 'query' || topic === 'collaboration'
  // Only offer CV as a topic while there is no file to download directly.
  const shownTopics = site.cvFile ? topics.filter((item) => item.id !== 'cv') : topics

  const field = (key: keyof typeof emptyForm) => ({
    value: form[key],
    onChange: (event: { target: { value: string } }) => setForm({ ...form, [key]: event.target.value }),
  })

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const honeypot = new FormData(event.currentTarget).get('botcheck')
    if (honeypot) return

    const subject = `[Portfolio] ${current.label}${topic === 'paper' ? `: ${paper}` : ''} from ${form.name}`
    const body = [
      `Topic: ${current.label}`,
      topic === 'paper' ? `Paper: ${paper}` : '',
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.affiliation ? `Affiliation: ${form.affiliation}` : '',
      '',
      form.message,
    ].filter((line, i) => line || i === 5).join('\n')

    if (!site.web3formsKey) {
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      setStatus('handed-off')
      return
    }

    setStatus('sending')
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject,
          from_name: form.name,
          replyto: form.email,
          name: form.name,
          email: form.email,
          affiliation: form.affiliation,
          topic: current.label,
          paper: topic === 'paper' ? paper : '',
          message: form.message,
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.success) throw new Error(result.message)
      setForm(emptyForm)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  const socials = [
    { href: site.links.linkedin, label: 'LinkedIn', icon: <LinkedinIcon size={16} /> },
    { href: site.links.github, label: 'GitHub', icon: <GithubIcon size={16} /> },
    { href: site.links.scholar, label: 'Google Scholar', icon: <ScholarLogo size={18} /> },
    { href: site.links.researchgate, label: 'ResearchGate', icon: <ResearchGateIcon size={18} /> },
    { href: site.links.orcid, label: 'ORCID', icon: <OrcidIcon size={18} /> },
  ].filter((social) => social.href)

  const finished = status === 'sent' || status === 'handed-off'

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <SectionHead id="contact-heading" eyebrow="Contact" title="Let's work together" />

      <div className="contact">
        <div className="contact-side">
          <p className="contact-lede">
            I'm always open to research collaborations, academic opportunities, and interesting engineering problems.
          </p>
          <a className="contact-line" href={`mailto:${site.email}`}><Mail size={17} /> {site.email}</a>
          <p className="contact-line"><MapPin size={17} /> {site.location}</p>
          <div className="contact-actions">
            <CvButton />
            {socials.map((social) => (
              <a key={social.label} className="icon-btn" href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} title={social.label}>
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <Glass className="contact-form">
          <AnimatePresence mode="wait" initial={false}>
            {finished ? (
              <motion.div
                key="done"
                className="form-done"
                role="status"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={jelly}
              >
                <motion.span className="form-done-icon" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...jelly, delay: 0.1 }}>
                  <Check size={26} />
                </motion.span>
                <h3 className="card-title">{status === 'sent' ? 'Message sent' : 'Almost there'}</h3>
                <p className="card-body">
                  {status === 'sent'
                    ? "Thank you. I'll reply to your email as soon as I can."
                    : 'Your email app should have opened with the message ready. Press send there to finish.'}
                </p>
                <button className="btn btn-glass" onClick={() => setStatus('idle')}>Write another</button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <fieldset className="field-group">
                  <legend className="field-label">What is this about?</legend>
                  <LayoutGroup id="contact-topics">
                    <div className="segments">
                      {shownTopics.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={`segment ${topic === item.id ? 'active' : ''}`}
                          onClick={() => setTopic(item.id)}
                          aria-pressed={topic === item.id}
                        >
                          {topic === item.id && <motion.span layoutId="topic-droplet" className="droplet" transition={jelly} />}
                          <span className="relative">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </LayoutGroup>
                </fieldset>

                <AnimatePresence initial={false}>
                  {topic === 'paper' && (
                    <motion.label
                      className="field-group"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={liquid}
                      style={{ overflow: 'hidden' }}
                    >
                      <span className="field-label">Which paper?</span>
                      <select className="input" value={paper} onChange={(event) => setPaper(event.target.value)}>
                        {publications.map((pub) => <option key={pub.id} value={pub.title}>{pub.title}</option>)}
                      </select>
                    </motion.label>
                  )}
                </AnimatePresence>

                <div className="field-row">
                  <label className="field-group">
                    <span className="field-label">Name</span>
                    <input className="input" name="name" autoComplete="name" required {...field('name')} />
                  </label>
                  <label className="field-group">
                    <span className="field-label">Email</span>
                    <input className="input" type="email" name="email" autoComplete="email" required {...field('email')} />
                  </label>
                </div>

                <label className="field-group">
                  <span className="field-label">University or organization (optional)</span>
                  <input className="input" name="organization" autoComplete="organization" {...field('affiliation')} />
                </label>

                <label className="field-group">
                  <span className="field-label">Message</span>
                  <textarea className="input" name="message" rows={5} data-lenis-prevent placeholder={current.prompt} required={messageRequired} {...field('message')} />
                </label>

                <input className="honeypot" type="text" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                {status === 'error' && (
                  <p className="form-error" role="alert">
                    That didn't send. Please try again, or email me at <a href={`mailto:${site.email}`}>{site.email}</a>.
                  </p>
                )}

                <motion.button
                  className="btn btn-primary form-submit"
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scaleX: 1.04, scaleY: 0.94 }}
                  transition={jelly}
                >
                  <Send size={16} />
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </Glass>
      </div>
    </section>
  )
}
