import "server-only";
import { Resend } from "resend";
import { profile } from "@/data/profile";

/**
 * Envoie un email à Emmanuel quand un nouvel avis est déposé.
 * Échoue silencieusement (log console seulement) si RESEND_API_KEY
 * n'est pas configurée — l'avis reste enregistré dans tous les cas.
 */
export async function notifyNewTestimonial(params: {
  name: string | null;
  isAnonymous: boolean;
  company: string;
  comment: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  try {
    const resend = new Resend(apiKey);
    const author = params.isAnonymous ? "Quelqu'un (anonyme)" : params.name ?? "Quelqu'un";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const adminLink = siteUrl ? `${siteUrl.replace(/\/$/, "")}/admin` : "la page /admin de ton site";
    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: profile.email,
      subject: `Nouvel avis à valider — ${author} (${params.company})`,
      text: [
        `${author} vient de déposer un avis via le site, à propos de son passage chez/à ${params.company}.`,
        "",
        params.comment,
        "",
        `Pour le publier ou le rejeter : ${adminLink}`,
      ].join("\n"),
    });
  } catch (err) {
    console.error("notifyNewTestimonial: échec de l'envoi de l'email", err);
  }
}
