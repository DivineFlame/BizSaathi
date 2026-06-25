export type AgentTone = "good" | "warning" | "danger" | "neutral";

export type AgentRole = {
  slug: string;
  name: string;
  title: string;
  mission: string;
  status: string;
  priority: string;
  model: string;
  tools: string[];
  metrics: Array<{ label: string; value: string; tone: AgentTone }>;
  workspace: {
    primaryPanel: string;
    primaryItems: string[];
    secondaryPanel: string;
    secondaryItems: string[];
  };
  queue: string[];
};

export type PaperclipTaskPayload = {
  tenantId: string;
  agentSlug: string;
  title: string;
  goal: string;
  approvalRequired: boolean;
  metadata?: Record<string, string | number | boolean | null>;
};

export type PaperclipTaskResult = {
  mode: "paperclip" | "mock";
  taskId: string;
  status: "queued" | "failed";
  message: string;
};
