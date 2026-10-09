# Portfolio — Emmanuel Konate

Site portfolio one-page construit avec Next.js (App Router), TypeScript, Tailwind CSS et Framer Motion.

## Démarrer

```bash
npm install
npm run dev
```

Le site est disponible sur [http://localhost:3000](http://localhost:3000).

## Contenu

Toutes les données du CV sont centralisées dans le dossier `data/` :

- `profile.ts` — informations personnelles, atouts, langues, centres d'intérêt
- `experiences.ts` — expériences professionnelles (régions pour le globe interactif)
- `education.ts` — diplômes et formations
- `skills.ts` — compétences par catégorie
- `projects.ts` — projets académiques et personnels
- `contract.ts` / `testimonialSources.ts` — options de l'écran d'entrée et du formulaire d'avis

Pour mettre à jour le contenu du site, il suffit de modifier ces fichiers.

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

## Déploiement

Dépôt GitHub [ehk85/monportefolio](https://github.com/ehk85/monportefolio), déployé sur Vercel.
Un `git push` sur `main` déclenche un redéploiement automatique.
