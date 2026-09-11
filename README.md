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
- `experiences.ts` — expériences professionnelles
- `education.ts` — diplômes et formations
- `skills.ts` — compétences par catégorie

Pour mettre à jour le contenu du site, il suffit de modifier ces fichiers.

## À compléter

- Remplacer le placeholder "EK" du Hero par une vraie photo de profil (ajouter l'image dans `public/` et l'utiliser dans `components/Hero.tsx`).
- Ajouter une section "Projets" avec des cas concrets (non présents dans le CV actuel).
