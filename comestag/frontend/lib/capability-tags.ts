/** Curated capability / technology tags for consistent matching (IDs stable for analytics). */
export const CAPABILITY_TAGS: { id: string; label: string }[] = [
  { id: "cloud", label: "Cloud & infrastructure" },
  { id: "saas", label: "SaaS / software products" },
  { id: "data", label: "Data & analytics" },
  { id: "ai", label: "AI / machine learning" },
  { id: "security", label: "Cybersecurity" },
  { id: "integration", label: "Integration & APIs" },
  { id: "erp", label: "ERP / business systems" },
  { id: "manufacturing", label: "Manufacturing & IoT" },
  { id: "automotive", label: "Automotive & mobility" },
  { id: "healthcare", label: "Healthcare & life sciences" },
  { id: "fintech", label: "Financial services" },
  { id: "retail", label: "Retail & e-commerce" },
  { id: "energy", label: "Energy & utilities" },
  { id: "consulting", label: "Consulting & advisory" },
  { id: "support", label: "Support & managed services" },
];

export function labelsFromIds(ids: string[]): string {
  const set = new Set(ids);
  return CAPABILITY_TAGS.filter((t) => set.has(t.id))
    .map((t) => t.label)
    .join(", ");
}
