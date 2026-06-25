import type { AgentRole } from "@/lib/types";

export const agentRoles: AgentRole[] = [
  {
    slug: "ceo",
    name: "CEO Agent",
    title: "Mission control and executive decisions",
    mission: "Convert business goals into projects, decisions, budgets, and cross-agent accountability.",
    status: "Active",
    priority: "Critical",
    model: "Strategic planning model",
    tools: ["Mission board", "Budget rules", "Agent org chart", "Executive approvals"],
    metrics: [
      { label: "Goals", value: "12", tone: "good" },
      { label: "Approvals", value: "7", tone: "warning" },
      { label: "Utilization", value: "68%", tone: "neutral" },
    ],
    workspace: {
      primaryPanel: "Mission board",
      primaryItems: ["Quarterly revenue goal", "Client onboarding", "Campaign launch", "Risk review"],
      secondaryPanel: "Decision queue",
      secondaryItems: ["Approve budget", "Assign owner", "Escalate low-confidence output", "Pause unsafe task"],
    },
    queue: ["Review weekly operating plan", "Approve campaign budget", "Set agent limits"],
  },
  {
    slug: "marketing",
    name: "Marketing Manager Agent",
    title: "Campaign planning workspace",
    mission: "Plan campaigns, audiences, channels, offers, budgets, and performance checkpoints.",
    status: "Active",
    priority: "High",
    model: "Campaign planner model",
    tools: ["Campaign calendar", "Audience segments", "Brief generator", "Performance tracker"],
    metrics: [
      { label: "Campaigns", value: "9", tone: "good" },
      { label: "Ready briefs", value: "14", tone: "neutral" },
      { label: "Blocked", value: "2", tone: "warning" },
    ],
    workspace: {
      primaryPanel: "Campaign planner",
      primaryItems: ["Objective", "Target audience", "Offer", "Channel mix", "KPI target"],
      secondaryPanel: "Channel plan",
      secondaryItems: ["Meta ads", "LinkedIn organic", "Email nurture", "X thought leadership"],
    },
    queue: ["Create campaign for festive sale", "Split audience by lifecycle stage", "Prepare content tasks"],
  },
  {
    slug: "content",
    name: "Content Writer Agent",
    title: "Brand-safe content studio",
    mission: "Generate captions, blogs, emails, ad copy, and scripts while preserving brand voice.",
    status: "Active",
    priority: "Medium",
    model: "Copywriting LLM via Ollama",
    tools: ["Brand voice", "Draft editor", "Version history", "SEO checklist"],
    metrics: [
      { label: "Drafts", value: "28", tone: "good" },
      { label: "Needs edit", value: "6", tone: "warning" },
      { label: "Approved", value: "17", tone: "good" },
    ],
    workspace: {
      primaryPanel: "Draft editor",
      primaryItems: ["Hook", "Body", "CTA", "Hashtags", "Compliance notes"],
      secondaryPanel: "Quality checks",
      secondaryItems: ["Similarity", "Tone", "Brand fit", "Human approval"],
    },
    queue: ["Write LinkedIn post", "Create email nurture draft", "Rewrite caption in Hinglish"],
  },
  {
    slug: "social",
    name: "Social Media Agent",
    title: "Publishing and approval calendar",
    mission: "Prepare channel-specific posts, previews, schedules, and approval requests before anything goes live.",
    status: "Needs approval",
    priority: "High",
    model: "Social workflow model",
    tools: ["Meta", "LinkedIn", "X", "Publishing calendar", "Preview renderer"],
    metrics: [
      { label: "Scheduled", value: "31", tone: "good" },
      { label: "Approval wait", value: "11", tone: "warning" },
      { label: "Published", value: "54", tone: "good" },
    ],
    workspace: {
      primaryPanel: "Post calendar",
      primaryItems: ["Today", "This week", "Platform preview", "Best time to post"],
      secondaryPanel: "Publishing guardrails",
      secondaryItems: ["Require approval", "No direct publishing", "Log platform response", "Rollback notes"],
    },
    queue: ["Prepare Meta creative preview", "Queue LinkedIn carousel", "Ask approval for X thread"],
  },
  {
    slug: "sales-crm",
    name: "Sales & CRM Agent",
    title: "Lead pipeline and follow-up desk",
    mission: "Qualify leads, enrich profiles, draft follow-ups, and update CRM only after approval.",
    status: "Active",
    priority: "High",
    model: "Sales assistant model",
    tools: ["Lead scoring", "CRM notes", "Email drafts", "Follow-up sequences"],
    metrics: [
      { label: "New leads", value: "46", tone: "good" },
      { label: "Hot leads", value: "8", tone: "warning" },
      { label: "Due", value: "19", tone: "neutral" },
    ],
    workspace: {
      primaryPanel: "Pipeline board",
      primaryItems: ["New", "Qualified", "Proposal", "Negotiation", "Won"],
      secondaryPanel: "Next action assistant",
      secondaryItems: ["Draft follow-up", "Summarize call", "Update score", "Escalate"],
    },
    queue: ["Draft follow-up for hot leads", "Score website inquiries", "Create CRM notes"],
  },
  {
    slug: "support",
    name: "Support Agent",
    title: "Customer issue response desk",
    mission: "Summarize support tickets, draft replies, detect sentiment, and escalate sensitive cases.",
    status: "Draft",
    priority: "Medium",
    model: "Support assistant model",
    tools: ["Ticket inbox", "Knowledge base", "Sentiment", "Escalation rules"],
    metrics: [
      { label: "Tickets", value: "23", tone: "neutral" },
      { label: "SLA risk", value: "3", tone: "warning" },
      { label: "Resolved", value: "71%", tone: "good" },
    ],
    workspace: {
      primaryPanel: "Ticket inbox",
      primaryItems: ["Urgent", "Open", "Waiting customer", "Resolved"],
      secondaryPanel: "Reply assistant",
      secondaryItems: ["Suggested answer", "Tone softener", "Knowledge source", "Escalate"],
    },
    queue: ["Summarize open issues", "Draft refund policy reply", "Escalate angry customer"],
  },
  {
    slug: "finance",
    name: "Finance Agent",
    title: "Billing and subscription monitor",
    mission: "Track invoices, reminders, usage, renewals, and finance approvals.",
    status: "Draft",
    priority: "Medium",
    model: "Finance operations model",
    tools: ["Invoices", "Payment reminders", "Usage limits", "Billing plans"],
    metrics: [
      { label: "Invoices due", value: "13", tone: "warning" },
      { label: "Renewals", value: "5", tone: "neutral" },
      { label: "Usage", value: "62%", tone: "good" },
    ],
    workspace: {
      primaryPanel: "Billing board",
      primaryItems: ["Draft invoice", "Payment reminder", "Usage alert", "Renewal follow-up"],
      secondaryPanel: "Finance approvals",
      secondaryItems: ["Discount", "Refund", "Plan upgrade", "Overage limit"],
    },
    queue: ["Draft payment reminder", "Flag overdue invoices", "Prepare renewals"],
  },
  {
    slug: "compliance",
    name: "Compliance & QA Agent",
    title: "Risk, quality, and approval reviewer",
    mission: "Review outputs for brand, legal, factual, privacy, tone, and approval-policy risks.",
    status: "Active",
    priority: "High",
    model: "QA reviewer model",
    tools: ["Policy checklist", "PII scanner", "Brand guardrails", "Approval rules"],
    metrics: [
      { label: "Reviewed", value: "84", tone: "good" },
      { label: "Flagged", value: "9", tone: "warning" },
      { label: "Auto-approved", value: "41", tone: "good" },
    ],
    workspace: {
      primaryPanel: "Review queue",
      primaryItems: ["Content risk", "PII risk", "Brand mismatch", "Factual uncertainty"],
      secondaryPanel: "Approval policy",
      secondaryItems: ["Low risk draft", "Medium risk approve", "High risk block", "Escalate"],
    },
    queue: ["Review outbound copy", "Flag unverifiable claim", "Approve safe draft"],
  },
];

export function getAgentRole(slug: string) {
  return agentRoles.find((role) => role.slug === slug);
}

export const approvalItems = [
  { title: "LinkedIn campaign post", agent: "Social Media Agent", risk: "Medium", action: "Approve publishing draft", status: "Pending" },
  { title: "Hot lead follow-up email", agent: "Sales & CRM Agent", risk: "Low", action: "Approve email draft", status: "Pending" },
  { title: "Discount request for agency client", agent: "Finance Agent", risk: "High", action: "Approve commercial exception", status: "Needs owner" },
  { title: "Ad claim about ROI improvement", agent: "Compliance & QA Agent", risk: "High", action: "Needs factual evidence", status: "Blocked" },
];

export const campaigns = [
  { name: "MSME Growth Sprint", client: "Internal", status: "Planning", channels: "LinkedIn, Email, Meta", due: "Next 7 days" },
  { name: "Festive Offer Engine", client: "Retail client", status: "Content", channels: "Meta, WhatsApp", due: "This week" },
  { name: "Agency Lead Magnet", client: "BizSaathi", status: "Approval", channels: "LinkedIn, X", due: "Today" },
];

export const leads = [
  { name: "Aarav Foods", stage: "Qualified", score: 86, next: "Send proposal draft" },
  { name: "Kaushambi Clinic", stage: "New", score: 72, next: "Ask discovery questions" },
  { name: "Noida Fashion Studio", stage: "Negotiation", score: 91, next: "Owner follow-up" },
  { name: "Meerut Coaching Hub", stage: "Nurture", score: 64, next: "Send case study" },
];
