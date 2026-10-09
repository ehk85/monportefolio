export type Education = {
  id: string;
  degree: string;
  school: string;
  location: string;
  period: string;
  current?: boolean;
  detail?: string;
  sort_order?: number;
};

// Contenu géré depuis Supabase (table "education", /admin/education) —
// voir lib/supabase/content.ts.
