export const product = {
  name: 'CampusForge AI',
  college: 'One College Creative Lab',
  tagline: 'Prompt, prototype, review, and ship digital work from one focused studio.',
  emailDomain: 'college.edu',
};

export const demoUsers = [
  {
    id: 'lead',
    name: 'Riya Shah',
    email: 'lead@college.edu',
    password: 'studio123',
    role: 'Studio Lead',
    team: 'Digital Innovation Cell',
  },
  {
    id: 'mentor',
    name: 'Arjun Mehta',
    email: 'mentor@college.edu',
    password: 'studio123',
    role: 'Faculty Mentor',
    team: 'Web Development Lab',
  },
  {
    id: 'creator',
    name: 'Maya Rao',
    email: 'creator@college.edu',
    password: 'studio123',
    role: 'Student Creator',
    team: 'Design Sprint Cohort',
  },
];

export const heroStats = [
  { label: 'Active briefs', value: '42' },
  { label: 'Avg. prompt score', value: '94%' },
  { label: 'Launch cycles', value: '6x' },
];

export const featurePillars = [
  {
    title: 'Prompt Operating System',
    description: 'Reusable prompts, brand rules, acceptance checks, and delivery context for college teams.',
    accent: 'teal',
  },
  {
    title: 'Creation Workflows',
    description: 'Move a website, campaign, chatbot, or media request through brief, generation, QA, and launch.',
    accent: 'coral',
  },
  {
    title: 'One-College Governance',
    description: 'Built for a private campus workspace with faculty review, student roles, and local project standards.',
    accent: 'amber',
  },
];

export const workflowStages = [
  {
    stage: 'Brief',
    title: 'Capture intent',
    detail: 'Audience, goal, brand tone, deadline, and source material are collected before generation starts.',
  },
  {
    stage: 'Prompt',
    title: 'Shape the request',
    detail: 'Prompt blocks turn raw ideas into production-ready instructions for web and media output.',
  },
  {
    stage: 'Generate',
    title: 'Create variants',
    detail: 'Teams compare copy, UI direction, page structure, and asset concepts before committing.',
  },
  {
    stage: 'Review',
    title: 'Apply quality gates',
    detail: 'Accessibility, responsiveness, college policy, and brand consistency checks stay visible.',
  },
  {
    stage: 'Ship',
    title: 'Package delivery',
    detail: 'Launch notes, handoff tasks, and reusable prompt recipes are saved for the next cohort.',
  },
];

export const dashboardMetrics = [
  { label: 'In production', value: '18', change: '+5 this week', tone: 'teal' },
  { label: 'Prompt reuse', value: '71%', change: '+14%', tone: 'citron' },
  { label: 'Review queue', value: '7', change: '3 high priority', tone: 'coral' },
  { label: 'Avg. cycle time', value: '2.4d', change: '-31%', tone: 'amber' },
];

export const performanceData = [
  { week: 'W1', prompts: 18, shipped: 6 },
  { week: 'W2', prompts: 26, shipped: 8 },
  { week: 'W3', prompts: 31, shipped: 11 },
  { week: 'W4', prompts: 38, shipped: 16 },
  { week: 'W5', prompts: 44, shipped: 18 },
  { week: 'W6', prompts: 52, shipped: 23 },
];

export const activeProjects = [
  {
    id: 'admission-portal',
    title: 'Admissions Microsite Refresh',
    owner: 'Design Sprint Cohort',
    type: 'Web build',
    status: 'Review',
    progress: 78,
    due: 'May 03',
    priority: 'High',
  },
  {
    id: 'fest-campaign',
    title: 'Annual Fest Campaign Kit',
    owner: 'Media Cell',
    type: 'Digital creation',
    status: 'Generate',
    progress: 54,
    due: 'May 08',
    priority: 'Medium',
  },
  {
    id: 'department-chatbot',
    title: 'Department Helpdesk Bot',
    owner: 'Web Development Lab',
    type: 'Workflow',
    status: 'Brief',
    progress: 26,
    due: 'May 14',
    priority: 'Medium',
  },
];

export const projectColumns = [
  {
    title: 'Brief',
    items: [
      { title: 'Placement cell landing page', owner: 'Career Services', meta: 'Audience map pending' },
      { title: 'Library orientation chatbot', owner: 'Central Library', meta: 'Knowledge base audit' },
    ],
  },
  {
    title: 'Generate',
    items: [
      { title: 'Annual Fest campaign kit', owner: 'Media Cell', meta: '3 visual routes' },
      { title: 'Alumni newsletter template', owner: 'Alumni Office', meta: 'Copy variants ready' },
    ],
  },
  {
    title: 'Review',
    items: [
      { title: 'Admissions microsite refresh', owner: 'Design Sprint Cohort', meta: 'Mobile QA active' },
      { title: 'AI policy explainer', owner: 'Faculty Council', meta: 'Tone check' },
    ],
  },
  {
    title: 'Ship',
    items: [
      { title: 'Hackathon registration page', owner: 'Coding Club', meta: 'Launch notes saved' },
      { title: 'Sports week poster pack', owner: 'Student Council', meta: 'Assets archived' },
    ],
  },
];

export const promptTemplates = [
  {
    id: 'landing-page',
    category: 'Web Design',
    title: 'Premium Landing Page Builder',
    description: 'Creates a sharp first screen, product sections, CTA strategy, and responsive UI requirements.',
    body:
      'Act as a senior product designer and frontend engineer. Build a premium landing page for [PROJECT] at [COLLEGE]. Audience: [AUDIENCE]. Goal: [GOAL]. Include a strong hero, clear positioning, trust signals, feature sections, CTA flow, responsive behavior, accessibility checks, and production-ready implementation notes.',
  },
  {
    id: 'dashboard-ux',
    category: 'Web Design',
    title: 'Dashboard UX Spec',
    description: 'Turns vague admin or workspace ideas into a usable dashboard structure.',
    body:
      'Design a production dashboard for [ROLE] managing [WORKFLOW]. Prioritize scanability, action hierarchy, filters, empty states, error states, mobile behavior, and daily repeated use. Return route structure, component list, key metrics, data states, and visual direction.',
  },
  {
    id: 'brand-kit',
    category: 'Digital Creation',
    title: 'Campus Campaign Brand Kit',
    description: 'Creates campaign copy, visual language, asset list, and review criteria.',
    body:
      'Create a campaign kit for [EVENT] at [COLLEGE]. Include message pillars, visual mood, color notes, poster concepts, social captions, email subject lines, accessibility constraints, and a review checklist for faculty approval.',
  },
  {
    id: 'qa-pass',
    category: 'Quality',
    title: 'Responsive QA Pass',
    description: 'Checks layout, content, accessibility, and deployment readiness before launch.',
    body:
      'Audit this web experience before launch: [URL OR DESCRIPTION]. Check mobile layout, spacing, typography, color contrast, broken routes, empty states, performance risks, accessibility, copy clarity, and deployment blockers. Return prioritized fixes with exact acceptance criteria.',
  },
  {
    id: 'workflow-map',
    category: 'Workflow',
    title: 'AI Workflow Mapper',
    description: 'Breaks a creative request into repeatable stages and ownership.',
    body:
      'Map this request into an AI-assisted production workflow: [REQUEST]. Include brief inputs, generation steps, review gates, owner roles, handoff artifacts, risks, and a reusable prompt stack for future college teams.',
  },
  {
    id: 'content-system',
    category: 'Content',
    title: 'Website Content System',
    description: 'Produces page copy that feels clear, premium, and useful.',
    body:
      'Write website copy for [PROJECT] at [COLLEGE]. Define the audience, H1, support copy, section headlines, benefit-led body copy, CTA labels, microcopy, and SEO description. Keep it direct, credible, and production-ready.',
  },
];

export const reviewQueue = [
  { item: 'Admissions mobile hero', status: 'Needs contrast pass', tone: 'coral' },
  { item: 'Fest campaign prompt stack', status: 'Faculty copy review', tone: 'amber' },
  { item: 'Hackathon page deployment', status: 'Ready to publish', tone: 'teal' },
];

export const integrations = [
  { name: 'Design board', status: 'Connected', detail: 'Figma handoff links stored per project' },
  { name: 'Code workspace', status: 'Ready', detail: 'GitHub branch naming and launch notes enabled' },
  { name: 'AI provider', status: 'Demo mode', detail: 'Local prompt builder is active until API keys are added' },
];
