export type ContractChoice = "alternance" | "stage" | "cdi" | "cdd";

export const contractChoices: Record<ContractChoice, { label: string; availability: string }> = {
  alternance: { label: "Alternance", availability: "Disponible pour une alternance dès septembre 2026" },
  stage: { label: "Stage", availability: "Disponible pour un stage dès septembre 2026" },
  cdi: { label: "CDI", availability: "Disponible en CDI dès septembre 2026" },
  cdd: { label: "CDD", availability: "Disponible en CDD dès septembre 2026" },
};

export const contractGroups: { label: string; options: ContractChoice[] }[] = [
  { label: "Alternance / Stage", options: ["alternance", "stage"] },
  { label: "CDI / CDD", options: ["cdi", "cdd"] },
];
