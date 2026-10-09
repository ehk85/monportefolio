# Portfolio — Emmanuel Konate

Site portfolio one-page construit avec Next.js (App Router), TypeScript, Tailwind CSS et Framer Motion.

## Démarrer

```bash
npm install
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

## Contenu

Les expériences et formations sont gérables directement depuis `/admin/experiences` et
`/admin/education` (voir plus bas) — pas besoin de toucher au code pour ça. Le reste du contenu
du CV est centralisé dans le dossier `data/` :

- `profile.ts` — informations personnelles, atouts, langues, centres d'intérêt
- `experiences.ts` / `education.ts` — types partagés + régions du globe interactif (le contenu
  lui-même vit dans Supabase, voir `lib/supabase/content.ts`)
- `skills.ts` — compétences par catégorie
- `projects.ts` — projets académiques et personnels
- `contract.ts` / `testimonialSources.ts` — options de l'écran d'entrée et du formulaire d'avis

Pour ces derniers, il suffit de modifier le fichier concerné.

## Section Avis (témoignages)

Les visiteurs peuvent déposer un avis depuis le site ; il reste en attente tant qu'il n'est pas
validé sur `/admin`, protégée par mot de passe. Fonctionnement et configuration détaillés dans
`supabase/schema.sql` et `.env.local.example`. En résumé :

1. Crée un projet gratuit sur [supabase.com](https://supabase.com), exécute `supabase/schema.sql`
   dans l'éditeur SQL du projet.
2. Copie `.env.local.example` en `.env.local` et renseigne les clés Supabase (Project Settings > API),
   des identifiants pour `/admin`, et — optionnel — une clé [Resend](https://resend.com) pour recevoir
   un email à chaque nouvel avis déposé.
3. Ajoute les mêmes variables dans Vercel (Project Settings > Environment Variables) pour la prod.

Sans ces variables, le site fonctionne normalement : la section affiche juste "Aucun avis publié".

## Administration (/admin)

Protégée par mot de passe (`ADMIN_USER` / `ADMIN_PASSWORD`), trois sections :

- **Avis en attente** (`/admin`) — approuver/rejeter les avis déposés publiquement
- **Expériences** (`/admin/experiences`) — ajouter, modifier, réordonner, supprimer un poste.
  La « zone géographique » doit être l'une des quatre déjà cartographiées sur le globe (Lyon,
  Paris, Londres, Abidjan) — pour un nouveau pays, une nouvelle carte doit être générée dans le code.
- **Formations** (`/admin/education`) — idem, sans contrainte de zone

Tables Supabase créées via `supabase/content_schema.sql` (contenu repris une fois dans
`supabase/content_seed.sql`). Les changements apparaissent sur le site sous 2 minutes
(revalidation ISR), sans redéploiement.

## Déploiement

Dépôt GitHub [ehk85/monportefolio](https://github.com/ehk85/monportefolio), déployé sur Vercel.
Un `git push` sur `main` déclenche un redéploiement automatique.
