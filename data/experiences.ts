export const contractTypes = [
  "Stage",
  "Stage alterné",
  "Alternance",
  "CDI",
  "CDD",
  "Freelance",
] as const;
export type ContractType = (typeof contractTypes)[number];

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string;
  region: string;
  period: string;
  contractType?: ContractType | null;
  current?: boolean;
  missions: string[];
  stack: string[];
  sort_order?: number;
};

// Le contenu (liste des postes) et la géographie des régions/cartes du
// globe vivent désormais dans Supabase, gérés depuis /admin/experiences
// — voir lib/supabase/content.ts et lib/supabase/geo.ts.
