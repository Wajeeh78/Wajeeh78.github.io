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
    scholar: 'https://scholar.google.com/citations?user=d9CfhnAAAAAJ&hl=en',
    researchgate: 'https://www.researchgate.net/profile/Wajeeh-Ejaz-Raja',
    orcid: 'https://orcid.org/0009-0002-2007-1562',
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

/* ─── Case study ───────────────────────────────────────────────────────
   Shown as interactive steps. In `architecture`, each row is one layer of
   the system; clicking a box shows its `detail`. */

export const caseStudy = {
  id: 'tax-saathi',
  title: 'Tax Saathi',
  tagline: 'A smart tax-filing assistant for Pakistani salaried workers.',
  context: 'Final Year Project · Team of 3',
  status: 'In development',
  steps: [
    {
      id: 'problem',
      label: 'Problem',
      title: 'Filing taxes should not need an agent.',
      body: 'Salaried workers in Pakistan file on the FBR IRIS portal, which expects exact figures most people cannot work out alone. Many end up paying tax agents for what is mostly data entry.',
      points: [
        'Withholding and deduction data is spread across salary and bank certificates.',
        'The IRIS portal asks for exact figures with little guidance.',
        'Paid agents add cost and hand sensitive identity data to a third party.',
      ],
    },
    {
      id: 'solution',
      label: 'Solution',
      title: 'A guided flow that produces exact IRIS figures.',
      body: "Tax Saathi walks users through their withholding and deductions, then turns that data into the exact numbers they enter on IRIS, in English and Urdu.",
      points: [
        'Bilingual guided filing in English and Urdu.',
        'A rule-based tax engine driven by versioned rule files for Tax Years 2026–2027.',
        'Planned: scanning salary and deduction certificates, and importing previous returns to cut manual entry.',
      ],
    },
    {
      id: 'architecture',
      label: 'Architecture',
      title: 'How it fits together.',
      body: 'Click a part of the system to see what it does.',
      points: [],
    },
    {
      id: 'security',
      label: 'Security',
      title: 'Built for sensitive identity data.',
      body: 'Tax data includes CNIC numbers and income, so security and consent were designed in from the start.',
      points: [
        'JWT authentication with email OTP verification, two-factor login, and password reset.',
        'Role-based access for admins and taxpayers.',
        'bcrypt password hashing and Fernet encryption of CNIC numbers at rest.',
        'Consent management, identity-data deletion, and tax-year preparation tracking.',
      ],
    },
    {
      id: 'engineering',
      label: 'Engineering',
      title: 'Engineered to be maintained.',
      body: 'The project is set up the way a production team would run it.',
      points: [
        'Tax rules live in versioned files, so a new tax year is a data change, not a code change.',
        'PostgreSQL and a Mailpit test inbox run in Docker Compose for a one-command dev setup.',
        'The backend is covered by pytest integration tests.',
      ],
    },
  ],
  architecture: [
    [
      { id: 'web', name: 'Web app', tech: 'React · TypeScript · Tailwind', detail: 'The main filing experience in the browser, with the guided English and Urdu flow.' },
      { id: 'mobile', name: 'Mobile app', tech: 'Flutter', detail: 'The same guided flow on phones, talking to the same API.' },
    ],
    [
      { id: 'api', name: 'REST API', tech: 'Python · FastAPI', detail: 'One backend for both apps. Handles accounts, filing data, and tax-year tracking, with role-based admin and taxpayer access.' },
    ],
    [
      { id: 'auth', name: 'Auth & security', tech: 'JWT · OTP · 2FA · bcrypt · Fernet', detail: 'Login with email OTP and two-factor authentication, hashed passwords, and CNIC numbers encrypted at rest.' },
      { id: 'engine', name: 'Tax engine', tech: 'Versioned rule files', detail: 'Rule-based calculation of exact IRIS figures. Each tax year (2026–2027) is its own rule file.' },
    ],
    [
      { id: 'db', name: 'Database', tech: 'PostgreSQL', detail: 'Stores users, consent records, and filing data. Identity data can be deleted on request.' },
    ],
  ],
  stack: ['Python', 'FastAPI', 'PostgreSQL', 'React', 'TypeScript', 'Tailwind CSS', 'Flutter', 'Docker', 'pytest'],
}

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
