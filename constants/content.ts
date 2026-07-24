/** All site copy, mirrored from eirion.ai. Single source of truth for sections. */

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Architecture", href: "#architecture" },
  { label: "Diagnostics", href: "#diagnostics" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "News", href: "#news" },
] as const;

export const HERO = {
  eyebrow: "ELEANOR PLATFORM • POWERED BY ELLIE",
  headlineTop: "Science.",
  headlineBottom: "Better with Eleanor.",
  taglines: ["Better treatments.", "Better efficiencies.", "Better outcomes."],
  paragraph:
    "The ELEANOR Platform is the intelligent AI Operating Layer for healthcare. Coordinated by ELLIE, our interactive AI agent, our MCP-centered architecture connects your systems, teams, and genetic data to accelerate growth, improve outcomes, and unlock proactive care everywhere.",
  primaryCta: "Explore ELEANOR",
  secondaryCta: "Meet ELLIE",
} as const;

export const TRUSTED_BY = [
  "Cleveland Clinic",
  "Johns Hopkins Medicine",
  "Quest Diagnostics",
] as const;

export const GROWTH_ENGINES = {
  title: ["The ELEANOR Platform.", "Two Growth Engines."],
  paragraph:
    "Our centralized Model Context Protocol (MCP) acts as an intelligent AI overlay—powering internal operations and customer experiences without replacing your systems. ELLIE orchestrates it all.",
  engines: [
    {
      eyebrow: "Grow the Enterprise",
      title: "Internal AI Services",
      items: [
        "Automated clinical and operational workflows",
        "Intelligent employee assistants",
        "Compliance and audit automation",
        "Predictive analytics and population health insights",
      ],
      cta: "Explore Internal Solutions",
    },
    {
      eyebrow: "Grow Client Value",
      title: "Customer-Facing AI Services",
      items: [
        "ELLIE Health Coaches & Wellness Advisors",
        "RPM Monitoring Agents",
        "CCM Care Coordination Assistants",
        "Personalized Genetic & Preventive Health Journeys",
      ],
      cta: "Explore Customer Solutions",
    },
  ],
} as const;

export const ECOSYSTEM = {
  eyebrow: "MCP Intelligence Layer",
  title: "The ELLIE Agent Ecosystem",
  paragraph:
    "A sophisticated network of specialized AI agents — internal and external — orchestrated through the Model Context Protocol. Every agent starts with ELLIE.",
  internalAgents: [
    "Workflow Agent",
    "Compliance Agent",
    "Analytics Agent",
    "Assistant Agent",
  ],
  externalAgents: [
    "Health Coach",
    "RPM Monitor",
    "Care Coordinator",
    "Genetic Advisor",
  ],
} as const;

export const BASELINE = {
  title: ["Every Journey Starts", "with a Baseline."],
  paragraph:
    "No wellness, longevity, or chronic care program can demonstrate measurable clinical value without establishing an objective baseline. Healthcare providers can only improve what they can measure.",
  quote:
    "We are modernizing the standard of care to enable doctors to prescribe medications with precision and safety — providing better patient outcomes and lowering overall healthcare costs.",
  quoteAuthor: "Dr Patrick Hanaway",
  layers: [
    {
      eyebrow: "Layer 1 — Genetic Blueprint",
      title: "Pharmacogenomics (PGx)",
      description:
        "Determines how an individual's genetics influence medication metabolism and response. Prescribe more safely, more accurately — without trial and error.",
      points: [
        "Reduces adverse drug events",
        "Accelerates therapeutic success",
        "Enables personalized medicine",
        "Eliminates trial-and-error prescribing",
      ],
    },
    {
      eyebrow: "Layer 2 — Biomarker Baseline",
      title: "Clinical Diagnostics",
      description:
        "Establishes measurable biomarkers that define current physiological health — revealing early disease processes long before symptoms emerge.",
      points: [
        "Blood glucose & HbA1c",
        "Lipid & cardiovascular markers",
        "Inflammatory & immune function",
        "Hormones & nutritional deficiencies",
      ],
    },
    {
      eyebrow: "Layer 3 — Longitudinal Intelligence",
      title: "Continuous Monitoring",
      description:
        "RPM and CCM programs generate continuous objective health data rather than relying on infrequent office visits. Without diagnostics, monitoring generates data. With diagnostics, monitoring generates clinical intelligence.",
      points: [
        "Blood pressure & heart rate",
        "Blood glucose & pulse oximetry",
        "Activity, sleep & weight",
        "Medication adherence tracking",
      ],
    },
  ],
} as const;

export const CLOSED_LOOP = {
  title: "The Closed-Loop ELEANOR Platform",
  paragraph: "A continuous cycle of measurement, intelligence, and improvement.",
  steps: [
    { number: "01", title: "Baseline", description: "PGx + clinical diagnostics + lifestyle assessment" },
    { number: "02", title: "Stratify", description: "AI identifies disease, medication & lifestyle risks" },
    { number: "03", title: "Personalize", description: "Customized care: nutrition, exercise, medication optimization" },
    { number: "04", title: "Monitor", description: "RPM devices, CCM engagement, wearables" },
    { number: "05", title: "Re-measure", description: "Repeat lab diagnostics, compare against baseline" },
    { number: "06", title: "Demonstrate", description: "Objective improvement: reduced HbA1c, lower BP, better outcomes" },
  ],
} as const;

export const NATURALIST = {
  quote: "Look deep into nature, and then you will understand everything better.",
  quoteAuthor: "Albert Einstein",
  eyebrow: "The Naturalist Intelligence — What ELLIE Does",
  title: ["Turning Technical Complexity", "into Nature's Simplicity."],
  paragraph:
    "The Naturalist movement applied scientific observation, heredity, and environment to understand human systems. ELLIE applies the same principles to healthcare — observing continuously, learning genetically, and adapting contextually.",
  principles: [
    {
      title: "Observation",
      principle: "Scientific observation of natural phenomena",
      application:
        "Continuous data collection across RPM, EHR, and genetic systems",
    },
    {
      title: "Heredity",
      principle: "Understanding inherited traits and evolution",
      application: "Genomic insights, PGx testing, and personalized care pathways",
    },
    {
      title: "Environment",
      principle: "How surroundings shape behavior and health",
      application:
        "Contextual awareness across all patient touchpoints and care settings",
    },
  ],
} as const;

export const SPEED = {
  title: "Speed-to-Market Advantage",
  traditional: {
    label: "Traditional AI",
    value: "6–18 months",
    points: ["Significant integration effort", "High consulting costs"],
  },
  eleanor: {
    label: "ELEANOR Overlay",
    value: "Weeks",
    points: ["Reuse existing infrastructure", "Modular deployment"],
  },
} as const;

export const INTELLIGENCE = {
  title: ["Healthcare-Specific", "Intelligence"],
  features: [
    {
      number: "01",
      title: "Genetics & Longevity",
      description:
        "Leverage AI to create personalized longevity programs using genetic insights, polygenic risk scores, biomarkers, and wearable data.",
    },
    {
      number: "02",
      title: "RPM Optimization",
      description:
        "Automate patient outreach, alert triage, and reimbursement readiness while improving engagement.",
    },
    {
      number: "03",
      title: "CCM Enhancement",
      description:
        "Increase program effectiveness through continuous patient interaction and ELLIE-driven care plans.",
    },
  ],
  stats: [
    { value: 3, suffix: "x", label: "Faster Implementation" },
    { value: 40, suffix: "%", label: "Reduction in Admin Time" },
    { value: 99, suffix: "%", label: "Compliance Accuracy" },
  ],
} as const;

export const FLOW = [
  { title: "Data", description: "Connect fragmented systems." },
  { title: "Intelligence", description: "Process with Eleanor's MCP." },
  { title: "Action", description: "Automate clinical workflows." },
  { title: "Outcome", description: "Improve patient health." },
] as const;

export const TESTIMONIAL = {
  quote:
    "The ELEANOR Platform transformed our patient engagement without having to rip and replace our EHR. ELLIE is a game-changer.",
  author: "CMO, Forward Health Network",
} as const;

export const SECURITY = {
  eyebrow: "Enterprise-Grade Security",
  title: "Certified & Compliant",
  paragraph:
    "Your patient data is protected by the most rigorous international security standards. Every certification is independently verified and continuously monitored.",
  certifications: [
    {
      name: "HIPAA",
      subtitle: "Health Insurance Portability & Accountability Act",
      description:
        "Full compliance with U.S. federal law protecting sensitive patient health information.",
      stat: "100%",
      statLabel: "Audit Pass Rate",
    },
    {
      name: "ISO 15189",
      subtitle: "Medical Laboratory Accreditation",
      description:
        "International standard for quality and competence in medical laboratories.",
      stat: "A+",
      statLabel: "Accreditation Grade",
    },
    {
      name: "GDPR",
      subtitle: "General Data Protection Regulation",
      description:
        "European Union regulation on data protection and privacy for all individuals.",
      stat: "Zero",
      statLabel: "Data Breaches",
    },
  ],
  badges: ["End-to-end encryption", "SOC 2 Type II audited", "99.99% uptime SLA"],
} as const;

export const FAQ = [
  {
    question: "What is a Model Context Protocol (MCP)?",
    answer:
      "MCP is an architecture that securely connects your existing data sources to large language models, providing the context needed for accurate, healthcare-specific AI applications.",
  },
  {
    question: "Do we need to replace our current systems?",
    answer:
      "No. The ELEANOR Platform is an intelligent overlay that connects to your existing EHR, diagnostics, and monitoring infrastructure — deployment takes weeks, not months, with no rip-and-replace.",
  },
  {
    question: "How does ELLIE keep patient data secure?",
    answer:
      "All data flows are end-to-end encrypted and processed within a HIPAA-compliant, SOC 2 Type II audited environment with continuous monitoring and a 99.99% uptime SLA.",
  },
  {
    question: "How quickly can we deploy the ELEANOR Platform?",
    answer:
      "Because ELEANOR reuses your existing infrastructure through its MCP-centered overlay architecture, most organizations deploy in weeks — compared to 6–18 months for traditional AI integrations.",
  },
] as const;

export const CTA = {
  title: ["The ELEANOR Platform.", "Orchestrated by ELLIE."],
  button: "Talk To An Expert",
} as const;

export const FOOTER = {
  tagline: "The AI Operating Layer for Healthcare.",
  columns: [
    {
      title: "Platform",
      links: ["ELEANOR Overview", "ELLIE Agents", "Architecture", "Diagnostics"],
    },
    {
      title: "Company",
      links: ["Philosophy", "News", "Careers", "Contact"],
    },
    {
      title: "Resources",
      links: ["Documentation", "Security", "Compliance", "Support"],
    },
  ],
  legal: ["Privacy Policy", "Terms of Service"],
} as const;
