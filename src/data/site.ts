/* ─── Everything you are likely to edit lives in this file ─────────── */

export const site = {
  name: 'Wajeeh Ahmed',
  location: 'Islamabad, Pakistan',

  // Public address shown on the site, and the fallback when no form key is set.
  email: 'wajeehahmed785@gmail.com',

  // Free key from https://web3forms.com. Enter your inbox there and it emails
  // you a key. Messages from the contact form are delivered to that inbox.
  // While this is empty, the form opens the visitor's email app instead.
  web3formsKey: '',

  // Put your PDF in public/cv/ and write its file name here. While this is
  // empty, the CV buttons ask visitors to request the CV through the form.
  cvFile: 'Wajeeh_Ahmed_Resume.pdf',

  // Leave a link empty to hide it everywhere on the site.
  links: {
    linkedin: 'https://www.linkedin.com/in/wajeeh-ahmed-a10a54213',
    github: 'https://github.com/Wajeeh78',
    scholar: '',
    aieys: 'https://ai-eys.com',
  },
}

/** Resolves a file in public/ so it also works under the GitHub Pages sub-path. */
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`

/* ─── Research ─────────────────────────────────────────────────────── */

/* status 'published' → listed under Publications; 'presented' → under
   Presented & upcoming. In `authors`, write your own name exactly as `me`
   so it is highlighted. Leave a field empty to hide it. */

export const me = 'Wajeeh Ahmed Ejaz Raja'

const iceti = 'Proceedings of the 3rd ICETI · Springer'
const icetiSeries = 'Information Systems Engineering and Management'

export interface Publication {
  id: string
  status: 'published' | 'presented'
  title: string
  authors: string[]
  /** Your role when the author list is not filled in, e.g. 'First author'. */
  role?: string
  /** Short label for the left column, e.g. the conference. */
  venue: string
  /** Full venue line under the title. */
  detail: string
  year: string
  location: string
  summary: string
  tags: string[]
  awards: string[]
  href: string
  code: string
}

export const publications: Publication[] = [
  {
    id: 'cicids2017-optimized',
    status: 'published',
    title: 'A Comparative Study on Optimized Models for Intrusion Detection Using CICIDS2017',
    authors: [me, 'Khadija Tariq Awan', 'Muhammad Ahmad', 'Munizah Ali', 'Malaika Adnan', 'Muhammad Shahmeer Razi'],
    venue: '3rd ICETI',
    detail: `${iceti} · ${icetiSeries} · pp. 835–849`,
    year: '',
    location: '',
    summary: 'Compared and optimized machine and deep learning models on CICIDS2017 for higher detection accuracy and efficiency, outperforming standard baselines. Built the full cleaning, training, and evaluation pipeline.',
    tags: ['Intrusion Detection', 'CICIDS2017', 'scikit-learn', 'TensorFlow'],
    awards: ['Best Paper Award', 'Best Presentation Award'],
    href: 'https://link.springer.com/chapter/10.1007/978-3-032-22426-2_48',
    code: '',
  },
  {
    id: 'uav-ciciov2024',
    status: 'published',
    title: 'Anomaly Based Intrusion Detection System for UAVs Network',
    authors: ['Malaika Adnan', 'Munizah Ali', 'Muhammad Shahmeer Razi', me],
    venue: '3rd ICETI',
    detail: `${iceti} · ${icetiSeries} · pp. 851–862`,
    year: '',
    location: '',
    summary: 'An anomaly-based IDS framework that protects UAV networks against real-time cyber threats. Handled preprocessing, feature engineering, training, and result analysis.',
    tags: ['UAV Security', 'Anomaly Detection', 'CICIoV2024'],
    awards: [],
    href: 'https://link.springer.com/chapter/10.1007/978-3-032-22426-2_49',
    code: '',
  },
  {
    id: 'uav-search-rescue',
    status: 'published',
    title: 'Lightweight Intrusion Detection System for UAV-Based Search and Rescue Operations Using Machine and Deep Learning Models',
    authors: ['Munizah Ali', 'Malik Huzaifa Arif', 'Hafiza Hina Kanwal', 'Muhammad Shahmeer Razi', 'Malaika Adnan', me],
    venue: '3rd ICETI',
    detail: `${iceti} · ${icetiSeries} · pp. 733–744`,
    year: '',
    location: '',
    summary: 'A lightweight ML/DL intrusion detection system that improves reliability and energy efficiency on resource-constrained UAVs. Handled data cleaning, training, and benchmarking.',
    tags: ['UAV Security', 'Lightweight IDS', 'Machine Learning', 'Deep Learning'],
    awards: [],
    href: 'https://link.springer.com/chapter/10.1007/978-3-032-22426-2_41',
    code: '',
  },
  {
    id: 'uav-hybrid-dl',
    status: 'published',
    title: 'A Lightweight Anomaly-Based Intrusion Detection System for UAV Networks Using Hybrid Deep Learning',
    role: 'Co-author',
    authors: [],
    venue: 'ICETI 2025',
    detail: 'Springer · accepted, to appear',
    year: '',
    location: '',
    summary: 'A hybrid deep learning model that improves UAV intrusion detection accuracy at low computational cost.',
    tags: ['UAV Networks', 'Hybrid Deep Learning', 'Anomaly Detection'],
    awards: [],
    href: '',
    code: '',
  },
  {
    id: 'cloud-ensemble-imbalance',
    status: 'presented',
    title: 'A Scalable Ensemble Framework for Handling Severe Class Imbalance in Next-Gen Cloud Intrusion Detection',
    role: 'First author',
    authors: [],
    venue: '2nd ICITIST',
    detail: 'Presented at the 2nd ICITIST Conference',
    year: '',
    location: 'Baku, Azerbaijan',
    summary: 'An XGBoost + LightGBM ensemble with SMOTE-Tomek balancing on CSE-CIC-IDS2018 that detects rare cloud attacks with a false positive rate of just 0.42%.',
    tags: ['Cloud Security', 'XGBoost / LightGBM', 'SMOTE-Tomek', 'CSE-CIC-IDS2018'],
    awards: [],
    href: '',
    code: '',
  },
  {
    id: 'icps-forensics',
    status: 'presented',
    title: 'Evaluating Deep Learning Architectures for Intrusion Detection and Forensic Analytics in Industrial Cyber Physical Systems',
    role: 'First author',
    authors: [],
    venue: '2nd ICITIST',
    detail: 'Presented at the 2nd ICITIST Conference',
    year: '',
    location: 'Baku, Azerbaijan',
    summary: 'Sequence-aware LSTM models on the GothX industrial framework that detect slow-moving anomalies across IIoT subsystems.',
    tags: ['Industrial CPS', 'LSTM', 'IIoT', 'Digital Forensics'],
    awards: [],
    href: '',
    code: '',
  },
  {
    id: 'edge-unified-memory',
    status: 'presented',
    title: 'Beyond the Data Center: Profiling AI Sequence Architectures on Edge Unified Memory',
    role: 'First author',
    authors: [],
    venue: 'COSIM',
    detail: 'Presented at the COSIM Conference, Germany',
    year: '',
    location: 'Germany',
    summary:
      'Benchmarks a State Space Model (Mamba-130M) against a Transformer (GPT-2 124M) on Apple Silicon unified memory. GPT-2 is faster at short context (68.35 vs 32.00 tokens/s) but fails at 1,024 tokens, while Mamba scales linearly past 2,000.',
    tags: ['Edge AI', 'Mamba / SSMs', 'Transformers', 'Apple Silicon'],
    awards: ['Best Poster Award'],
    href: '',
    code: 'https://github.com/Wajeeh78/edge-smm-benchmarking',
  },
]

/* ─── Awards and certifications ───────────────────────────────────────
   `paper` is the id of a publication above; the card then links to it. */

export const honors = [
  {
    title: 'Best Paper Award',
    event: '3rd ICETI',
    paper: 'cicids2017-optimized',
    kind: 'paper',
  },
  {
    title: 'Best Presentation Award',
    event: '3rd ICETI',
    paper: 'cicids2017-optimized',
    kind: 'presentation',
  },
  {
    title: 'Best Poster Award',
    event: 'COSIM Conference · Germany',
    paper: 'edge-unified-memory',
    kind: 'poster',
  },
  {
    title: 'Youngest Researcher with 4 International Publications',
    event: 'SZABIST Islamabad',
    paper: '',
    kind: 'milestone',
  },
  {
    title: 'Cisco Instructor Award',
    event: 'NAVTTC',
    paper: '',
    kind: 'instructor',
  },
] as const

export const certifications = [
  { title: 'Introduction to Cybersecurity', issuer: 'Cisco', date: 'May 2026' },
  { title: 'AI Tools', issuer: 'IBM', date: 'Sep 2025' },
  { title: 'Introduction to AI', issuer: 'Google', date: 'Aug 2025' },
  { title: 'Maximize Productivity with AI Tools', issuer: 'Google', date: 'Aug 2025' },
  { title: 'Front-End Web Development with HTML & CSS', issuer: 'UC Davis · Coursera', date: 'Jul 2025' },
]

/* ─── Work experience (newest first) ──────────────────────────────────────────────────────── */

export const experience = [
  {
    org: 'AI-EYS',
    roles: [
      {
        role: 'AI Research Assistant',
        period: 'Oct 2025 — Present',
        bullets: [
          'Conduct applied AI research and develop solutions to complex problems in the lab of Dr. Inamullah Khan.',
          'Coordinate end-to-end planning of international conferences, managing registrations, scheduling, and on-site operations for 350+ participants.',
        ],
      },
      {
        role: 'Web Developer',
        period: 'Aug 2025 — May 2026',
        bullets: [
          'Revamped the AI-EYS website, architecting and integrating an internship portal, a student portal, and an international research paper submission system.',
          'Maintain the platform and ship feature enhancements that improve user experience and functionality.',
        ],
      },
      {
        role: 'Instructor',
        period: 'Aug 2025 — Sep 2025',
        bullets: [
          "Delivered Cisco's official CCNA course to 350+ students across 5+ universities through hybrid onsite and online instruction.",
          'Prepared students for the Cisco CCNA Certified Technician certification through structured training and hands-on labs.',
        ],
      },
    ],
  },
  {
    org: 'SZABIST Islamabad',
    roles: [
      {
        role: 'Teaching Assistant',
        period: 'Jun 2026 — Aug 2026',
        bullets: [
          'Supported Mr. Salman in teaching Computer Networks & Data Communication (CNDC), helping students with networking concepts, lab work, and assignments.',
          'Helped with grading, held student help sessions, and supported course delivery and classroom management.',
        ],
      },
    ],
  },
  {
    org: 'NAVTTC',
    roles: [
      {
        role: 'Cisco Instructor (CCNA)',
        period: 'Aug 2025 — Sep 2025',
        bullets: [
          "Delivered an instructor-led Cisco CCNA course to undergraduates under NAVTTC's national skills development program.",
          'Guided students through networking fundamentals, hands-on labs, and certification requirements, achieving successful certification outcomes.',
          'Received a Certificate of Appreciation for exceptional contribution to student training.',
        ],
      },
    ],
  },
  {
    org: 'Arch Technologies',
    roles: [{ role: 'Front-End Web Developer Intern', period: 'Jul 2025 — Aug 2025', bullets: ['Built responsive front-end websites, landing pages, and client pages with HTML and CSS, working with teams to meet client requirements.'] }],
  },
  {
    org: 'YoungDev',
    roles: [{ role: 'Front-End Web Developer Intern', period: 'Jun 2025 — Sep 2025', bullets: ['Built responsive front-end websites, landing pages, and client pages with HTML and CSS, working with teams to meet client requirements.'] }],
  },
  {
    org: 'Microsoft Learn Student Ambassadors',
    roles: [{ role: 'Learn Student Ambassador', period: 'May 2024 — Jul 2024', bullets: ['Organized and led workshops and events on Microsoft technologies and career development.'] }],
  },
]
