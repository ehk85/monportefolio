import { getSupabasePublicClient } from "./public";
import type { Experience } from "@/data/experiences";
import type { Education } from "@/data/education";

export async function getExperiences(): Promise<Experience[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("experiences")
    .select("id, role, company, location, region, period, is_current, missions, stack, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    role: row.role,
    company: row.company,
    location: row.location,
    region: row.region,
    period: row.period,
    current: row.is_current,
    missions: row.missions ?? [],
    stack: row.stack ?? [],
    sort_order: row.sort_order,
  }));
}

export async function getEducation(): Promise<Education[]> {
  const supabase = getSupabasePublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("education")
    .select("id, degree, school, location, period, is_current, detail, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return data.map((row) => ({
    id: row.id,
    degree: row.degree,
    school: row.school,
    location: row.location,
    period: row.period,
    current: row.is_current,
    detail: row.detail ?? undefined,
    sort_order: row.sort_order,
  }));
}
