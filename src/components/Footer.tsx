import { site } from '../data/site'

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {site.name}</span>
      <span>{site.location} · AI/ML Researcher</span>
    </footer>
  )
}
