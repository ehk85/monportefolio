export type RegionKey = "lyon" | "paris" | "londres" | "abidjan";

export type CountryCode = "fra" | "gbr" | "civ";

export type Region = {
  label: string;
  country: string;
  countryCode: CountryCode;
  lat: number;
  lng: number;
};

export const regions: Record<RegionKey, Region> = {
  lyon: { label: "Lyon", country: "France", countryCode: "fra", lat: 45.75, lng: 4.85 },
  paris: { label: "Paris", country: "France", countryCode: "fra", lat: 48.8566, lng: 2.3522 },
  londres: {
    label: "Londres",
    country: "Royaume-Uni",
    countryCode: "gbr",
    lat: 51.5074,
    lng: -0.1278,
  },
  abidjan: {
    label: "Abidjan",
    country: "Côte d'Ivoire",
    countryCode: "civ",
    lat: 5.36,
    lng: -4.0083,
  },
};

export type Experience = {
  role: string;
  company: string;
  location: string;
  region: RegionKey;
  period: string;
  current?: boolean;
  missions: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: "Chargé des données Achats et IA",
    company: "AFEO",
    location: "Genas, France",
    region: "lyon",
    period: "Fév. 2026 — Sept. 2026 · Stage alterné",
    current: true,
    missions: [
      "Mise en place d'une solution IA pour améliorer l'émission de devis",
      "Mise en place d'outils pour l'optimisation des tournées techniques à l'aide de JavaScript",
      "Création de dashboards BI pour le pilotage du SAV",
      "Animation de la relation fournisseurs en lien avec les achats",
    ],
    stack: ["Python", "VBA", "JavaScript", "Node", "React", "Vue", "Microsoft SQL Server", "Power BI", "Excel"],
  },
  {
    role: "Analyste QA",
    company: "Le Livre Scolaire",
    location: "Lyon, France",
    region: "lyon",
    period: "Jan. 2025 — Sept. 2025 · Alternance",
    missions: [
      "Contrôle qualité sur les systèmes de gestion de contenu et reporting des anomalies",
      "Suivi des corrections en lien avec les équipes techniques",
      "Contribution à la fiabilisation des flux de données et à l'amélioration du process qualité",
    ],
    stack: [
      "PHP",
      "Python",
      "JavaScript",
      "SQL",
      "Git",
      "MongoDB",
      "PostgreSQL",
      "Testim",
      "Tests unitaires",
      "Intégration continue",
    ],
  },
  {
    role: "Développeur Back End",
    company: "InnovQube",
    location: "Paris, France (à distance)",
    region: "paris",
    period: "Nov. 2024 — Jan. 2025 · Stage",
    missions: [
      "Création d'outils d'extraction et de transformation de données",
      "Architecture d'interfaces web et scripts automatisés",
      "Documentation technique et interaction avec les équipes produit",
    ],
    stack: ["Laravel", "Vue.js", "PHP", "MySQL", "Redis", "API REST", "Docker", "RAG", "Llama", "Mistral", "Qwen"],
  },
  {
    role: "Développeur Back End en intelligence artificielle",
    company: "Nexora AI",
    location: "Londres, Royaume-Uni (à distance)",
    region: "londres",
    period: "Sept. 2024 — Oct. 2024 · Stage",
    missions: [
      "Documentation technique et support utilisateurs pour le déploiement cloud",
      "Mise en place de pipelines Machine Learning et NLP pour l'analyse automatique de textes",
      "Création d'API pour connecter back end et front end",
      "Déploiement sur AWS avec Docker et intégration continue via GitLab",
    ],
    stack: ["Flask", "FastAPI", "MongoDB", "ETL", "Docker", "AWS", "GitLab", "Analyse prédictive"],
  },
  {
    role: "Business Analyst Data et CRM",
    company: "Capgemini",
    location: "Paris, France",
    region: "paris",
    period: "Oct. 2023 — Août 2024 · Alternance",
    missions: [
      "Nettoyage, migration et validation de bases clients",
      "Mise en place de règles de cohérence et recueil des besoins",
      "Rédaction des user stories, suivi du backlog et participation aux UAT",
      "Création de dashboards et rapports de suivi utilisés par les managers",
      "Animation de sessions de formation et rédaction de tutoriels d'utilisation CRM",
      "Collaboration internationale avec les équipes IT et métier en France, Espagne et au Royaume-Uni",
    ],
    stack: ["SQL", "VBA", "CRM", "JavaScript", "Scrum", "Power BI", "Python", "Tableaux croisés dynamiques"],
  },
  {
    role: "Développeur logiciels",
    company: "WebTech",
    location: "Abidjan, Côte d'Ivoire",
    region: "abidjan",
    period: "Sept. 2022 — Août 2023",
    missions: [],
    stack: [
      "Bases de données",
      "Java",
      "Django",
      "Travail d'équipe",
      "WinDev",
      "Maintenance des données",
      "SQL",
      "WebDev",
      "Compétences analytiques",
      "E-commerce",
      "Contrôle de version",
      "Microsoft Windows",
      "Algorithmes",
      "Gestion de l'assistance bureautique",
      "WinDev Mobile",
      "Bonnes pratiques (GxP)",
    ],
  },
  {
    role: "Stagiaire",
    company: "SUNU GROUP",
    location: "Abidjan, Côte d'Ivoire",
    region: "abidjan",
    period: "Août 2021 — Oct. 2021",
    missions: [],
    stack: [
      "Cloud Computing",
      "Linux",
      "Travail d'équipe",
      "Office 365",
      "Sécurité de l'information",
      "Kali Linux",
      "Microsoft Windows",
      "Assistance informatique",
    ],
  },
  {
    role: "Stagiaire",
    company: "SNDI — Société Nationale de Développement Informatique",
    location: "Abidjan, Côte d'Ivoire",
    region: "abidjan",
    period: "Août 2019 — Oct. 2019",
    missions: [],
    stack: ["Microsoft Office", "Informatique", "Microsoft Windows", "Assistance informatique"],
  },
];
