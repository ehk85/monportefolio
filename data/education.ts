export type Education = {
  degree: string;
  school: string;
  location: string;
  period: string;
  current?: boolean;
  detail?: string;
};

export const education: Education[] = [
  {
    degree: "MSc MBA Expert en Management des Systèmes d'Information",
    school: "Epitech",
    location: "Lyon, France",
    period: "Sept. 2026 — Oct. 2027",
    current: true,
    detail: "Année en cours",
  },
  {
    degree: "Mastère Chef de projet Data / Intelligence Artificielle",
    school: "NEXA Digital School",
    location: "Lyon, France",
    period: "Sept. 2024 — Juin 2026",
    detail:
      "Python avancé, IA générative, Machine Learning, MLOps, gestion de projet agile, sécurité et gouvernance des données, API REST, RGPD, Web Scraping & web mining",
  },
  {
    degree: "Bachelor Concepteur & Chef de Projet Web",
    school: "NEXA Digital School",
    location: "Lyon, France",
    period: "Sept. 2023 — Juin 2024",
    detail: "ETL, POO, SEO, contrôle de gestion, Excel-VBA, dashboard, RGPD, SQL",
  },
  {
    degree: "Ingénieur Système Automatisé",
    school: "ESSTI",
    location: "Rabat, Maroc",
    period: "Oct. 2019 — Juin 2022",
    detail: "Compréhension et automatisation des process et flux d'entreprise",
  },
];
