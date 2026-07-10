/* ============================================================================
 *  OBSERVATORY — your content lives here.
 *  ----------------------------------------------------------------------------
 *  This is the ONLY file you need to edit to manage your portfolio.
 *
 *  • PROFILE        → your name + tagline (shown on the intro card).
 *  • CONSTELLATIONS → four "sky regions", one per part of your life.
 *      Each has `entries` (the stars) and `edges` (which stars connect to
 *      draw the constellation's shape).
 *
 *  To add a star: copy an entry object, give it a unique `id`, and place it
 *  with `pos` (x/y offset from the constellation's center — roughly -220..220).
 *  Then, if you want it linked into the shape, add an [from, to] pair to
 *  `edges` using the two entries' array indices (0 = first entry, etc.).
 *
 *  `magnitude` (0.4–1) controls a star's size/brightness — make your marquee
 *  work brighter. `catalogId` is the little call-sign shown in the UI.
 * ========================================================================== */

export type EntryKind =
  | "project"
  | "achievement"
  | "scholarship"
  | "experience"
  | "writing";

export interface Entry {
  id: string;
  title: string; // the ROLE / name of the thing — e.g. "Managing Editor"
  org?: string; // the organization / publication — e.g. "Trinity Business Review"
  catalogId: string; // e.g. "OPS-01" — short call-sign
  kind: EntryKind;
  year: string;
  magnitude: number; // 0.4 (faint) .. 1 (brilliant)
  summary: string; // one-line, shown under the title
  highlights?: string[]; // action-verb bullet points, shown in the panel
  details?: string; // fallback prose if you'd rather not use bullets
  tags?: string[];
  links?: { label: string; href: string }[];
  pos: { x: number; y: number }; // offset from the constellation center
}

export interface Constellation {
  id: string;
  name: string; // "Opus"
  epithet: string; // "The Builder"
  section: string; // human label — "Projects"
  hueVar: string; // CSS var name from globals.css
  hue: string; // hex, for canvas drawing
  blurb: string;
  center: { x: number; y: number }; // world position of the cluster
  mobileCenter?: { x: number; y: number }; // position on portrait (phone) screens
  focusZoom?: number; // camera zoom when flying to this cluster (default 1.15)
  nameOffset?: number; // how far above the centre to draw the name (default 210)
  entries: Entry[];
  edges: [number, number][]; // connections between entry indices
}

export const PROFILE = {
  name: "Rachel Ranjith",
  tagline:
    "Rachel Ranjith is a Computer Science student at Trinity College Dublin who builds AI and quantitative systems and writes about technology and policy. Explore her projects, research, honours, experience, and writing, charted as an interactive night sky.",
  intro:
    "Every light here is something I made, earned, lived, or wrote. Wander the sky, zoom into any cluster, or use Navigate to jump straight to something.",
  email: "rachel.ranjith@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/rachel-ranjith" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rachel-ranjith/" },
    { label: "Email", href: "mailto:rachel.ranjith@gmail.com" },
  ],
};

export const CONSTELLATIONS: Constellation[] = [
  {
    id: "opus",
    name: "Opus",
    epithet: "The Builder",
    section: "Projects",
    hueVar: "--opus",
    hue: "#ffcf8b",
    blurb: "Systems I've built — from market-microstructure engines to multi-agent AI.",
    center: { x: -120, y: -760 },
    mobileCenter: { x: -350, y: -1450 },
    nameOffset: 175,
    entries: [
      {
        id: "opus-lob",
        title: "Limit Order Book Simulator",
        org: "Personal project",
        catalogId: "OPS-01",
        kind: "project",
        year: "Jun 2025",
        magnitude: 1,
        summary:
          "A high-performance order-matching engine, benchmarked on real market data.",
        highlights: [
          "Processes 1.95M messages/second at 0.51µs latency on real AAPL market data",
          "Implements price–time priority matching with partial fills using SortedDict (O(log n) inserts, O(1) top-of-book)",
          "Profiling-driven optimization delivered a 65% speedup from v1 to v2",
          "Validated with 32 unit tests against 118K+ LOBSTER-format messages",
        ],
        tags: ["Python", "Market Microstructure", "Performance"],
        links: [
          { label: "GitHub", href: "https://github.com/rachel-ranjith/Limit-Order-Book-Simulator" },
        ],
        pos: { x: -160, y: -110 },
      },
      {
        id: "opus-arbitrage",
        title: "Arbitrage Signal Trader",
        org: "Personal project",
        catalogId: "OPS-02",
        kind: "project",
        year: "Sep 2025",
        magnitude: 0.85,
        summary:
          "A statistical-arbitrage system trading mean-reverting spreads of cointegrated pairs.",
        highlights: [
          "Validates tradeable pairs with Augmented Dickey–Fuller / Engle–Granger cointegration tests, filtered by mean-reversion half-life",
          "Generates z-score entry/exit signals (±2σ entry, ±3σ stop) on the normalized spread",
          "Models realistic transaction costs — bid–ask spread and market impact — in an event-driven backtester",
          "Backtested 2022–24: UPS/FDX returned $2,067 net P&L over 16 trades (0.49 Sharpe)",
        ],
        tags: ["Python", "Quant", "Backtesting"],
        links: [
          { label: "GitHub", href: "https://github.com/rachel-ranjith/Arbitrage-Signal-Trader" },
        ],
        pos: { x: -220, y: 60 },
      },
      {
        id: "opus-factor",
        title: "Factor Return Predictor",
        org: "Personal project",
        catalogId: "OPS-03",
        kind: "project",
        year: "Feb 2026",
        magnitude: 0.8,
        summary:
          "An ML system predicting stock returns from engineered factors, with leakage-free validation.",
        highlights: [
          "Engineered 17 features across momentum, volatility, volume, and technicals (RSI, MACD, Bollinger Bands)",
          "Used 12-month rolling walk-forward windows with 1-month test periods to prevent lookahead bias",
          "Compared Ridge, Lasso, and OLS with coefficient-stability tracking across 50 liquid US stocks",
          "Honestly documents regime dependence — strong signal in 2021–22 (IC peak +0.65) that decayed by 2023–24",
        ],
        tags: ["Python", "Machine Learning", "Quant"],
        links: [
          { label: "GitHub", href: "https://github.com/rachel-ranjith/Factor-Return-Predictor" },
        ],
        pos: { x: -80, y: 150 },
      },
      {
        id: "opus-watchwise",
        title: "WatchWise",
        org: "Claude Builder Club Hackathon",
        catalogId: "OPS-04",
        kind: "project",
        year: "Apr 2026",
        magnitude: 0.9,
        summary:
          "A neuroscience-grounded tool scoring how overstimulating a video is for a child.",
        highlights: [
          "Paste a YouTube link → get a 0–100 score across five dimensions (pacing, sensory load, educational value, manipulation, dopamine cycling)",
          "Multi-signal pipeline (yt-dlp, ffmpeg, librosa) feeds a multi-agent Claude system of five specialists plus a judge",
          "Age-adjusted thresholds and Google-Takeout watch-history analysis",
          "Results stream in real time as each agent finishes; won Grand Prize + the Neuroscience track",
        ],
        tags: ["AI", "Multi-agent", "FastAPI", "React"],
        links: [{ label: "GitHub", href: "https://github.com/srivassi/WatchWise" }],
        pos: { x: 130, y: -140 },
      },
      {
        id: "opus-findaway",
        title: "FindAway",
        org: "HackIreland",
        catalogId: "OPS-05",
        kind: "project",
        year: "Feb 2025",
        magnitude: 0.72,
        summary:
          "Streamlines the international-student journey from choosing a course to travel logistics.",
        highlights: [
          "Guides users from picking a country, university, and course through to visa and travel requirements",
          "Full-stack build — a React frontend on a Python (Flask) API",
          "Placed runner-up in the OpenAI track",
        ],
        tags: ["React", "Flask", "AI"],
        links: [
          { label: "GitHub", href: "https://github.com/rachel-ranjith/HackIreland-Group-34" },
        ],
        pos: { x: 225, y: 0 },
      },
      {
        id: "opus-stockataka",
        title: "Stockataka",
        org: "SULU Hackathon",
        catalogId: "OPS-06",
        kind: "project",
        year: "Nov 2024",
        magnitude: 0.68,
        summary: "Teaches kids markets by mapping Pokémon stats to real stocks.",
        highlights: [
          "Maps Pokémon stats to company stocks (sector→type, attack→price) for playful financial literacy",
          "Explains Moving Averages and RSI with Pokémon-themed analogies",
          "Chained the Pokémon API with a technical-analysis API; 2nd place at the SULU Full-Stack-athon",
        ],
        tags: ["EdTech", "APIs", "Python"],
        links: [{ label: "GitHub", href: "https://github.com/rachel-ranjith/Stockataka" }],
        pos: { x: 160, y: 150 },
      },
      {
        id: "opus-qshield",
        title: "Q-Shield",
        org: "Solana × Quantum Hackathon",
        catalogId: "OPS-07",
        kind: "project",
        year: "2026",
        magnitude: 0.82,
        summary:
          "A crypto-agile Solana smart account with hardware-rooted post-quantum key migration.",
        highlights: [
          "Migrates a Solana account's signing algorithm on-chain — Ed25519 → Falcon-512 (NIST post-quantum) — without changing its address",
          "A Raspberry Pi hardware wallet signs with both algorithms during migration, proving control of the old key before activating the new",
          "The on-chain smart account delegates verification to swappable verifier programs, so new algorithms drop in without touching account logic",
          "Team of 3 — Solana programs (Rust + Anchor), Pi wallet (Python + liboqs), browser wallet (React + TypeScript)",
        ],
        tags: ["Solana", "Rust", "Post-Quantum", "Hardware"],
        // Repo is private — no public link.
        pos: { x: 20, y: 30 },
      },
    ],
    // Two lobes — quant/personal builds (left) and hackathon projects (right) —
    // stitched through Q-Shield in the middle.
    edges: [
      [0, 1],
      [1, 2],
      [2, 0],
      [0, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 2],
      [6, 3],
    ],
  },
  {
    id: "lumen",
    name: "Lumen",
    epithet: "The Scholar",
    section: "Honors",
    hueVar: "--lumen",
    hue: "#8fd0ff",
    blurb: "Scholarships, awards, and hackathon wins.",
    center: { x: 1180, y: -520 },
    mobileCenter: { x: 400, y: -720 },
    entries: [
      {
        id: "lumen-laidlaw",
        title: "Laidlaw Scholarship",
        org: "Laidlaw Foundation · Trinity College Dublin",
        catalogId: "LUM-01",
        kind: "scholarship",
        year: "Apr 2025 — Present",
        magnitude: 1,
        summary:
          "18-month leadership & research scholarship — behavioural AI-detection research.",
        highlights: [
          "Awarded the Laidlaw Undergraduate Leadership & Research Scholarship — an 18-month programme",
          "Research project: 'Generative AI Era — Behavioural Detection of AI-Generated Content in Academic Writing'",
          "A new approach to AI detection: identifying GenAI use from how a student writes rather than what they write, using behavioural data",
          "Building a proof-of-concept for a more ethical, accurate, and transparent alternative to current detection tools, supervised by Hitesh Tewari & Dave Lewis",
        ],
        tags: ["Research", "Leadership", "Scholarship"],
        pos: { x: -150, y: -150 },
      },
      {
        id: "lumen-global-excellence",
        title: "Global Excellence Scholarship",
        org: "Trinity College Dublin",
        catalogId: "LUM-02",
        kind: "scholarship",
        year: "2023/24",
        magnitude: 0.9,
        summary: "Merit scholarship for exceptional international students.",
        highlights: [
          "Awarded to exceptional incoming international (non-EU) undergraduates",
          "Granted on academic achievement and potential to contribute to Trinity",
          "Applied as a reduction on year-one tuition fees",
        ],
        tags: ["Merit", "International", "Scholarship"],
        pos: { x: -230, y: 15 },
      },
      {
        id: "lumen-claude-builder",
        title: "Grand Prize & Neuroscience Track",
        org: "Claude Builder Club Hackathon",
        catalogId: "LUM-03",
        kind: "achievement",
        year: "Apr 2026",
        magnitude: 0.92,
        summary: "Won Grand Prize and the Neuroscience track with WatchWise.",
        highlights: [
          "Built WatchWise — paste a video link, get an age-adjusted cognitive-load score grounded in research",
          "Engineered a multi-signal analysis pipeline feeding a multi-agent AI system",
          "Designed five specialist agents (behavioural neuroscience, child development, consumer psychology, cognitive load, sensory integration) plus a judge agent to synthesise the score",
          "Took both the Neuroscience track and the overall Grand Prize",
        ],
        tags: ["AI", "Multi-agent", "Neuroscience"],
        pos: { x: 140, y: -125 },
      },
      {
        id: "lumen-hackireland",
        title: "OpenAI Track Runner-Up",
        org: "HackIreland",
        catalogId: "LUM-04",
        kind: "achievement",
        year: "Feb 2025",
        magnitude: 0.76,
        summary: "Runner-up in the OpenAI track with FindAway.",
        highlights: [
          "Built FindAway to streamline the international-student journey end-to-end",
          "Guided users from choosing a country, university, and course through to travel requirements",
          "Placed runner-up in the OpenAI track",
        ],
        tags: ["AI", "Product", "Hackathon"],
        pos: { x: 240, y: 20 },
      },
      {
        id: "lumen-sulu",
        title: "2nd Place",
        org: "SULU Hackathon",
        catalogId: "LUM-05",
        kind: "achievement",
        year: "Nov 2024",
        magnitude: 0.7,
        summary: "2nd place — building edtech from two chained APIs.",
        highlights: [
          "Theme: innovative use of two of the sponsor's APIs",
          "Combined the Pokémon API and a stock-market API into a playful edtech tool",
          "Taught kids the basics of portfolio-building through game-like mechanics",
          "Placed 2nd overall",
        ],
        tags: ["EdTech", "APIs", "Hackathon"],
        pos: { x: 165, y: 160 },
      },
      {
        id: "lumen-hist-essay",
        title: "Grand Prize — Essay Competition",
        org: "The Hist · On That Point",
        catalogId: "LUM-06",
        kind: "achievement",
        year: "Nov 2025",
        magnitude: 0.74,
        summary: "Won an open-motion essay competition (€100 prize).",
        highlights: [
          "Grand Prize winner of the essay competition run by the Hist's Robinson Subcommittee with its publication, On That Point",
          "Wrote 'THB Pro-Natalism is a Tool for Social Control' on a free-choice motion",
          "Awarded a €100 prize",
        ],
        tags: ["Writing", "Essay", "The Hist"],
        pos: { x: 5, y: 45 },
      },
      {
        id: "lumen-best-head-mentor",
        title: "Best Head Mentor",
        org: "Student2Student (S2S)",
        catalogId: "LUM-07",
        kind: "achievement",
        year: "2026",
        magnitude: 0.78,
        summary: "Recognised as S2S's outstanding Head Mentor.",
        highlights: [
          "Named Best Head Mentor across the S2S programme for 2026",
          "Recognised for leading the CS, Engineering & MIDFY mentoring team",
        ],
        tags: ["Leadership", "Mentoring", "Award"],
        pos: { x: -175, y: 175 },
      },
      {
        id: "lumen-best-jh-mentor",
        title: "Best Joint Honors Mentor",
        org: "Student2Student (S2S)",
        catalogId: "LUM-08",
        kind: "achievement",
        year: "2025",
        magnitude: 0.72,
        summary: "Recognised as S2S's outstanding Joint Honors mentor.",
        highlights: [
          "Named Best Joint Honors Mentor in the S2S programme for 2025",
          "Awarded for one-to-one support of Joint Honors first-years",
        ],
        tags: ["Mentoring", "Award"],
        pos: { x: -25, y: 205 },
      },
    ],
    // Two lobes — scholarships/mentoring (left) and hackathons (right) —
    // bridged through the essay prize.
    edges: [
      [0, 1],
      [1, 6],
      [6, 7],
      [0, 5],
      [5, 7],
      [5, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ],
  },
  {
    id: "vireo",
    name: "Vireo",
    epithet: "The Voyager",
    section: "Experience",
    hueVar: "--vireo",
    hue: "#c9a0ff",
    blurb: "Internships, roles, and selective programmes — the working path.",
    center: { x: -680, y: 560 },
    mobileCenter: { x: 380, y: 720 },
    nameOffset: 250,
    entries: [
      {
        id: "vireo-pinterest",
        title: "Software Engineer Intern",
        org: "Pinterest",
        catalogId: "VIR-01",
        kind: "experience",
        year: "May 2026 — Present",
        magnitude: 1,
        summary:
          "Building a metrics root-cause-analysis agent for the Data Governance team.",
        highlights: [
          "Building a metrics RCA agent that runs different investigation strategies to diagnose metric anomalies",
          "Designing the agent's reasoning to trace anomalies across the data-governance pipeline",
          "Working to make key-metric monitoring faster and more reliable at scale",
        ],
        tags: ["AI Agents", "Data", "Python"],
        pos: { x: 10, y: -185 },
      },
      {
        id: "vireo-microsoft",
        title: "AI Reliability Project Lead",
        org: "Microsoft × Trinity College Dublin",
        catalogId: "VIR-02",
        kind: "experience",
        year: "Jan 2026 — Present",
        magnitude: 0.9,
        summary: "Leading a team of 8 evaluating and improving AI agent reliability.",
        highlights: [
          "Lead a team of 8, with Microsoft, to evaluate and improve AI agent reliability",
          "Design systematic testing frameworks measuring consistency across diverse task scenarios",
          "Synthesize findings into actionable recommendations for Microsoft stakeholders",
          "Present progress in weekly Agile syncs",
        ],
        tags: ["AI", "Leadership", "Research"],
        pos: { x: -150, y: -95 },
      },
      {
        id: "vireo-guidewire",
        title: "Backend Developer",
        org: "Guidewire × Trinity College Dublin",
        catalogId: "VIR-03",
        kind: "experience",
        year: "Jan 2025 — May 2025",
        magnitude: 0.72,
        summary: "Built the backend for a client project-management dashboard.",
        highlights: [
          "Implemented backend functionality in Python (Django) and SQL",
          "Integrated data models and APIs for a client-facing project-management dashboard",
          "Worked in an Agile team to validate data integrity and automate reporting",
        ],
        tags: ["Python", "Django", "SQL"],
        pos: { x: 140, y: -95 },
      },
      {
        id: "vireo-demonstrator",
        title: "Module Demonstrator",
        org: "Trinity College Dublin",
        catalogId: "VIR-04",
        kind: "experience",
        year: "Sep 2025 — Present",
        magnitude: 0.65,
        summary: "Teaching assistant for Introduction to Computing I (ARM Assembly).",
        highlights: [
          "Demonstrate weekly labs for Introduction to Computing I to classes of 70+ first-years",
          "Guide students through ARM Assembly problem-solving, reinforcing lecture content",
          "Provide one-on-one lab support to improve understanding and engagement",
        ],
        tags: ["Teaching", "ARM Assembly"],
        pos: { x: 205, y: 55 },
      },
      {
        id: "vireo-paramount",
        title: "Data Privacy Intern",
        org: "Paramount Computer Systems",
        catalogId: "VIR-06",
        kind: "experience",
        year: "Jun 2025 — Aug 2025",
        magnitude: 0.75,
        summary: "Enterprise GDPR compliance — ROPA and DPIAs across business units.",
        highlights: [
          "Conducted enterprise-wide Records of Processing Activities (ROPA) and Data Protection Impact Assessments (DPIAs)",
          "Liaised across business units to ensure GDPR and regional data-law compliance",
          "Standardized documentation and reporting workflows for scalable privacy governance",
          "Supported senior consultants in drafting compliance recommendations for stakeholders",
        ],
        tags: ["GDPR", "Privacy", "Compliance"],
        pos: { x: -70, y: 60 },
      },
      {
        id: "vireo-novazen",
        title: "Software & Web Development Intern",
        org: "Novazen Solutions",
        catalogId: "VIR-07",
        kind: "experience",
        year: "Jun 2024 — Aug 2024",
        magnitude: 0.66,
        summary: "Built the company website end-to-end, plus SEO and infrastructure.",
        highlights: [
          "Designed and built the company's official website from the ground up with responsive design",
          "Implemented SEO strategies and analytics to improve visibility and search performance",
          "Managed domain registration, DNS configuration, and email infrastructure",
          "Aligned web design with company identity and marketing objectives",
        ],
        tags: ["Web Dev", "SEO"],
        pos: { x: -215, y: 55 },
      },
      {
        id: "vireo-getmax",
        title: "Summer Intern",
        org: "GetMax.ae",
        catalogId: "VIR-08",
        kind: "experience",
        year: "Jul 2022 — Aug 2022",
        magnitude: 0.55,
        summary: "Cross-functional startup internship across IT, marketing & social.",
        highlights: [
          "Collaborated across IT, marketing, and social media to deliver integrated business support",
          "Developed and tested websites and databases, troubleshooting for reliability",
          "Created LinkedIn and Instagram content, boosting engagement and visibility",
          "Optimized cold-calling workflows using Microsoft Office tools",
        ],
        tags: ["Startup", "Full-stack"],
        pos: { x: -120, y: 195 },
      },
      {
        id: "vireo-bloomberg",
        title: "Women in Tech Lab",
        org: "Bloomberg",
        catalogId: "VIR-09",
        kind: "experience",
        year: "Apr 2026",
        magnitude: 0.72,
        summary:
          "Selected for a 3-day programme building an open-source Python project with Bloomberg engineers.",
        highlights: [
          "Selected for a 3-day in-person programme building an open-source Python project alongside Bloomberg engineers",
          "Completed a live coding exercise and technical sessions",
          "Engaged with Bloomberg's EMEA communities through a panel, networking lunch, office tours, and a Terminal demo",
        ],
        tags: ["Selective", "Python"],
        pos: { x: 300, y: -35 },
      },
      {
        id: "vireo-sig",
        title: "Technology Discovery Programme",
        org: "Susquehanna International Group (SIG)",
        catalogId: "VIR-10",
        kind: "experience",
        year: "Apr 2026",
        magnitude: 0.72,
        summary:
          "Selected for a 2-day programme at SIG's European HQ — trading, technology, and coding challenges.",
        highlights: [
          "Selected for a 2-day in-person programme at SIG's European headquarters",
          "Covered trading and technology overviews, coding challenges, and problem-solving sessions",
          "Shadowed SIG's trading and technology teams through a live trading demo and games sessions",
          "Networked with representatives from across the business",
        ],
        tags: ["Selective", "Quant", "Trading"],
        pos: { x: 385, y: 45 },
      },
      {
        id: "vireo-amazon",
        title: "Spring Technology Insights",
        org: "Amazon",
        catalogId: "VIR-11",
        kind: "experience",
        year: "Apr 2025",
        magnitude: 0.7,
        summary:
          "Full-day on-site technical programme — earned an SDE Internship offer on interview performance.",
        highlights: [
          "Selected for a full-day on-site programme combining technical and competency-based interview workshops",
          "Completed a live 1-hour SDE internship interview during the event",
          "Earned an SDE Internship offer based on interview performance",
        ],
        tags: ["Selective", "SWE"],
        pos: { x: 335, y: 140 },
      },
    ],
    // Irregular loop with a tail (current roles up top, first internship trailing),
    // plus a branch off the Demonstrator into the selective spring programmes.
    edges: [
      [0, 1],
      [0, 2],
      [1, 5],
      [5, 4],
      [4, 3],
      [3, 2],
      [4, 6],
      [3, 7],
      [7, 8],
      [8, 9],
    ],
  },
  {
    id: "cantus",
    name: "Cantus",
    epithet: "The Writer",
    section: "Writing",
    hueVar: "--cantus",
    hue: "#9ef0c3",
    blurb: "Articles and essays — a river of writing, newest to oldest.",
    center: { x: 1180, y: 470 },
    mobileCenter: { x: -350, y: 1450 },
    focusZoom: 0.8, // wide framing so the whole river fits
    nameOffset: 350,
    entries: [
      {
        id: "cantus-tedx",
        title: "Change 101: Four Female Laidlaw Scholars on Trinity's TEDx Stage",
        org: "Trinity News",
        catalogId: "CAN-01",
        kind: "writing",
        year: "Mar 2026",
        magnitude: 0.72,
        summary:
          "A lineup of professors, PhDs, and industry leaders shared the TEDx stage with four female undergraduate Laidlaw Scholars.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2026/03/change-101-how-four-female-undergrad-laidlaw-scholars-ended-up-on-trinitys-tedx-stage/",
          },
        ],
        tags: ["Feature", "Trinity"],
        pos: { x: 0, y: -290 },
      },
      {
        id: "cantus-au-ban",
        title: "Australia Banned Social Media for Kids Under 16: Could It Happen Here?",
        org: "Trinity News",
        catalogId: "CAN-02",
        kind: "writing",
        year: "Feb 2026",
        magnitude: 0.8,
        summary:
          "As Australia's world-first ban reshapes the child-safety debate, Ireland faces pressure over how far to go.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2026/02/australia-banned-social-media-for-kids-under-16-could-it-happen-here/",
          },
        ],
        tags: ["Policy", "Tech"],
        pos: { x: 86, y: -224 },
      },
      {
        id: "cantus-ents",
        title: "ENTS Race: Danila Kitaev on Connecting the Student Community",
        org: "Trinity News",
        catalogId: "CAN-03",
        kind: "writing",
        year: "Feb 2026",
        magnitude: 0.58,
        summary:
          "An interview with Ents candidate Danila Kitaev on his vision for a collaborative, student-centred committee.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2026/02/ents-race-danila-kitaev-believes-ents-is-a-platform-for-our-entire-student-community-to-connect-and-grow/",
          },
        ],
        tags: ["Interview"],
        pos: { x: 107, y: -158 },
      },
      {
        id: "cantus-memory-chips",
        title: "AI's Appetite for Memory Chips Is About to Hit Your Wallet",
        org: "Trinity News",
        catalogId: "CAN-04",
        kind: "writing",
        year: "Feb 2026",
        magnitude: 0.85,
        summary:
          "As AI data centres consume unprecedented RAM, consumers face rising prices for everyday electronics.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2026/02/ais-appetite-for-memory-chips-is-about-to-hit-your-wallet/",
          },
        ],
        tags: ["AI", "Economics"],
        pos: { x: 47, y: -92 },
      },
      {
        id: "cantus-female-ai",
        title: "Trinity Study Exposes Exploitation of Female-Labelled AI Agents",
        org: "Trinity News",
        catalogId: "CAN-05",
        kind: "writing",
        year: "Dec 2025",
        magnitude: 0.85,
        summary:
          "Trinity research finds people exploit female-labelled AI agents more than human counterparts — gender bias transferring into human–machine interaction.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2025/12/trinity-study-exposes-exploitation-of-female-labelled-ai-agents/",
          },
        ],
        tags: ["AI", "Research", "Gender"],
        pos: { x: -49, y: -26 },
      },
      {
        id: "cantus-data-centre",
        title: "Ireland's Hidden Cost of Being Europe's Data Centre Capital",
        org: "Trinity News",
        catalogId: "CAN-06",
        kind: "writing",
        year: "Nov 2025",
        magnitude: 0.9,
        summary:
          "Ireland's data centres now consume more electricity than urban homes — colliding with its legally binding climate targets.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2025/11/irelands-hidden-cost-of-being-europes-data-centre-capital/",
          },
        ],
        tags: ["Energy", "Ireland", "Tech"],
        pos: { x: -108, y: 40 },
      },
      {
        id: "cantus-chat-control",
        title: "Ireland Backs Controversial EU Chat Surveillance Law",
        org: "Trinity News",
        catalogId: "CAN-07",
        kind: "writing",
        year: "Oct 2025",
        magnitude: 0.8,
        summary:
          "Ireland's backing of the EU's Chat Control law underscores the dilemma: child safety versus mass surveillance.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2025/10/ireland-backs-controversial-eu-chat-surveillance-law/",
          },
        ],
        tags: ["Privacy", "EU Policy"],
        pos: { x: -85, y: 106 },
      },
      {
        id: "cantus-x-state",
        title: "X vs the Irish State in the Age of Online Safety",
        org: "Trinity News",
        catalogId: "CAN-08",
        kind: "writing",
        year: "Aug 2025",
        magnitude: 0.75,
        summary:
          "Ireland's Online Safety Code puts X's age-verification systems — and the future of platform accountability — under the microscope.",
        links: [
          {
            label: "Read",
            href: "https://www.trinitynews.ie/2025/08/x-vs-the-irish-state-in-the-age-of-online-safety/",
          },
        ],
        tags: ["Regulation", "Tech"],
        pos: { x: 2, y: 172 },
      },
      {
        id: "cantus-deepseek",
        title: "DeepSeek vs ChatGPT: Reshaping Nvidia and the US–China AI Rivalry",
        org: "Trinity Business Review",
        catalogId: "CAN-09",
        kind: "writing",
        year: "Feb 2025",
        magnitude: 0.9,
        summary:
          "How China's DeepSeek challenges ChatGPT — reshaping Nvidia and the global AI landscape. Co-authored.",
        links: [
          {
            label: "Read",
            href: "https://tbr.ie/2025/02/28/deepseek-vs-chatgpt-reshaping-nvidia-the-us-china-tech-rivalry-and-the-global-ai-landscape/",
          },
        ],
        tags: ["AI", "Markets", "Co-authored"],
        pos: { x: 87, y: 238 },
      },
      {
        id: "cantus-crypto",
        title: "The Crypto Ecosystem: How Blockchain & DeFi Are Reshaping Finance",
        org: "Trinity Business Review",
        catalogId: "CAN-10",
        kind: "writing",
        year: "Jan 2025",
        magnitude: 0.72,
        summary:
          "How blockchain, DeFi, and emerging tech are decentralising global finance.",
        links: [
          {
            label: "Read",
            href: "https://tbr.ie/2025/01/24/the-crypto-ecosystem-how-blockchain-defi-and-emerging-tech-are-reshaping-finance/",
          },
        ],
        tags: ["Finance", "Blockchain"],
        pos: { x: 107, y: 304 },
      },
    ],
    // A flowing river — each piece links to the next, newest (top) to oldest.
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 8],
      [8, 9],
    ],
  },
  {
    id: "sodalis",
    name: "Sodalis",
    epithet: "The Convener",
    section: "Societies",
    hueVar: "--sodalis",
    hue: "#f4a3c8",
    blurb: "Societies, committees, mentoring, and events I've helped build.",
    center: { x: -1350, y: -120 },
    mobileCenter: { x: -380, y: 0 },
    focusZoom: 1.0, // wider framing for a large, three-lobe constellation
    entries: [
      {
        id: "sodalis-s2s-head",
        title: "Head Mentor",
        org: "Student2Student (S2S)",
        catalogId: "SOD-01",
        kind: "experience",
        year: "Apr 2025 — Apr 2026",
        magnitude: 1,
        summary: "Led first-year peer mentoring across CS, Engineering & MIDFY.",
        highlights: [
          "Led a team of student mentors supporting first-years in Computer Science, Engineering & MIDFY",
          "Organized mentor training and coordinated mentor–mentee pairings",
          "Served as the primary escalation point for academic and personal concerns, enabling early intervention",
          "Fostered a culture of inclusion, belonging, and student wellbeing",
        ],
        tags: ["Leadership", "Mentoring", "Trinity College Dublin"],
        pos: { x: -150, y: -140 },
      },
      {
        id: "sodalis-s2s-trainer",
        title: "Mentor Trainer",
        org: "Student2Student (S2S)",
        catalogId: "SOD-02",
        kind: "experience",
        year: "2025 & 2026",
        magnitude: 0.8,
        summary: "Trained each new cohort of S2S mentors (paid role).",
        highlights: [
          "Delivered the S2S mentor-training programme with a co-trainer across 4-hour sessions",
          "Facilitated group discussions and activities for newly recruited mentors",
          "Drew on prior mentoring experience to set realistic expectations",
          "Selected to return for a second training cycle",
        ],
        tags: ["Facilitation", "Training"],
        pos: { x: -260, y: -50 },
      },
      {
        id: "sodalis-s2s-mentor",
        title: "Student Mentor",
        org: "Student2Student (S2S)",
        catalogId: "SOD-03",
        kind: "experience",
        year: "Sep 2024 — Apr 2026",
        magnitude: 0.7,
        summary: "One-to-one mentoring for incoming students.",
        highlights: [
          "Mentored incoming students one-to-one through the transition to university",
          "Guided mentees on academic challenges, campus resources, and social integration",
          "Contributed to the wider peer-support network promoting wellbeing and belonging",
        ],
        tags: ["Mentoring", "Peer Support"],
        pos: { x: -300, y: 90 },
      },
      {
        id: "sodalis-s2s-stem",
        title: "STEM Representative",
        org: "Student2Student (S2S)",
        catalogId: "SOD-04",
        kind: "experience",
        year: "Mar 2025 — Apr 2026",
        magnitude: 0.72,
        summary: "Represented STEM students on the S2S committee.",
        highlights: [
          "Voiced STEM students' concerns and ideas to improve inclusivity and support",
          "Connected STEM societies with the wider S2S network to expand outreach",
          "Helped plan targeted events and resources for technical disciplines",
        ],
        tags: ["Committee", "STEM", "Advocacy"],
        pos: { x: -160, y: 70 },
      },
      {
        id: "sodalis-equality-stem",
        title: "Tech Representative",
        org: "Equality in STEM Society",
        catalogId: "SOD-05",
        kind: "experience",
        year: "Mar 2025 — Apr 2026",
        magnitude: 0.72,
        summary: "Ran the society's website and digital platforms.",
        highlights: [
          "Maintained and optimized the society's website and digital infrastructure",
          "Drove event promotion and outreach online, growing visibility and engagement",
          "Advanced diversity, equity & inclusion initiatives across STEM",
        ],
        tags: ["Web", "DEI", "Committee"],
        pos: { x: -30, y: 120 },
      },
      {
        id: "sodalis-tn-editor",
        title: "Deputy SciTech Editor",
        org: "Trinity News",
        catalogId: "SOD-06",
        kind: "experience",
        year: "Jun 2025 — Apr 2026",
        magnitude: 0.86,
        summary: "Ran the Science & Technology desk.",
        highlights: [
          "Commissioned and edited student-written articles for the SciTech section",
          "Built editorial workflows ensuring clarity, accuracy, and accessibility",
          "Covered the intersection of technology, policy, and society",
          "Mentored junior writers to strengthen their reporting",
        ],
        tags: ["Editorial", "Journalism"],
        pos: { x: 150, y: -90 },
      },
      {
        id: "sodalis-tn-writer",
        title: "Contributing Writer",
        org: "Trinity News",
        catalogId: "SOD-07",
        kind: "experience",
        year: "Sep 2024 — Jun 2025",
        magnitude: 0.6,
        summary: "Reported on science & technology before joining the desk.",
        highlights: [
          "Pitched and wrote SciTech articles for Ireland's largest student newspaper",
          "Translated complex research into accessible, engaging features",
          "Built the portfolio that led to the Deputy SciTech Editor role",
        ],
        tags: ["Writing", "Journalism"],
        pos: { x: 280, y: -160 },
      },
      {
        id: "sodalis-tbr-editor",
        title: "Managing Editor",
        org: "Trinity Business Review",
        catalogId: "SOD-08",
        kind: "experience",
        year: "Apr 2025 — Apr 2026",
        magnitude: 0.9,
        summary: "Directed Ireland's leading student-run business journal.",
        highlights: [
          "Directed editorial operations end-to-end for TBR",
          "Coordinated a team of section editors and writers",
          "Oversaw the article pipeline from pitch to publication",
          "Standardized editing processes and timelines for consistent quality",
          "Grew TBR's profile through cross-campus partnerships and outreach",
        ],
        tags: ["Editorial", "Leadership"],
        pos: { x: 210, y: 80 },
      },
      {
        id: "sodalis-tbr-writer",
        title: "Contributing Writer",
        org: "Trinity Business Review",
        catalogId: "SOD-09",
        kind: "experience",
        year: "Nov 2023 — Apr 2025",
        magnitude: 0.6,
        summary: "Wrote for TBR before stepping up to lead it.",
        highlights: [
          "Pitched and authored articles across business and finance topics",
          "Collaborated with editors through revision to publication",
          "Progressed to Managing Editor after two years contributing",
        ],
        tags: ["Writing", "Business"],
        pos: { x: 310, y: 10 },
      },
      {
        id: "sodalis-global-ambassador",
        title: "Global Ambassador",
        org: "Global Room, Trinity College Dublin",
        catalogId: "SOD-10",
        kind: "experience",
        year: "Aug 2025 — Present",
        magnitude: 0.65,
        summary: "First point of contact for international students; multicultural events.",
        highlights: [
          "Serve as a first point of contact for international students on academics, campus life, and cultural adjustment",
          "Support the planning, promotion, and delivery of multicultural events",
          "Collaborate in a large, diverse team to foster community and inclusivity",
        ],
        tags: ["Community", "Events"],
        pos: { x: 70, y: 210 },
      },
      {
        id: "sodalis-hackeurope",
        title: "Outreach & Sponsorships",
        org: "HackEurope",
        catalogId: "SOD-11",
        kind: "experience",
        year: "Oct 2025 — Feb 2026",
        magnitude: 0.95,
        summary: "Drove sponsorship & outreach for a 1000+ builder hackathon.",
        highlights: [
          "Raised €250K+ from 20+ sponsors through sponsor research and outreach",
          "Coordinated society partnerships across 80+ societies in 15 countries",
          "Ran press, vendor coordination, and partnerships behind the scenes",
          "Helped bring 1000+ builders through the doors",
        ],
        tags: ["Sponsorship", "Partnerships", "Events"],
        pos: { x: -40, y: -30 },
      },
    ],
    // Three lobes — mentoring (left), publications (right), community/events
    // (centre) — all stitched through the HackEurope hub.
    edges: [
      [2, 1],
      [1, 0],
      [0, 3],
      [0, 10],
      [10, 4],
      [4, 3],
      [4, 9],
      [10, 5],
      [5, 6],
      [10, 7],
      [7, 8],
      [5, 7],
    ],
  },
];

// Flattened index of every star, with a back-reference to its constellation.
export interface FlatEntry {
  entry: Entry;
  constellation: Constellation;
  world: { x: number; y: number };
}

export const ALL_ENTRIES: FlatEntry[] = CONSTELLATIONS.flatMap((c) =>
  c.entries.map((entry) => ({
    entry,
    constellation: c,
    world: { x: c.center.x + entry.pos.x, y: c.center.y + entry.pos.y },
  })),
);

// On portrait (phone) screens the wide desktop layout is replaced by a hand-placed
// vertical arrangement (each constellation's `mobileCenter`) — only the CENTRES
// move; the star shapes are untouched — so all five fill the screen with even
// spacing instead of bunching into a band or crowding each other.
export const centerFor = (c: Constellation, portrait: boolean) =>
  portrait && c.mobileCenter ? c.mobileCenter : c.center;

export const KIND_LABEL: Record<EntryKind, string> = {
  project: "Project",
  achievement: "Achievement",
  scholarship: "Scholarship",
  experience: "Experience",
  writing: "Writing",
};
