export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  missions: string[];
  stack: string[];
};

export const experiences: Experience[] = [
  {
    role: "Chef de projet Chargé des données Achats et IA",
    company: "AFEO",
    location: "Genas, France",
    period: "Fév. 2026 — Sept. 2026",
    current: true,
    missions: [
      "Mise en place d'une solution IA pour améliorer l'émission de devis",
      "Nouveaux processus d'achats et animation auprès des équipes",
      "Analyse de la concurrence entre fournisseurs et suivi des catalogues",
      "Valorisation des stocks, inventaire et suivi administratif",
      "Création de dashboards BI pour le pilotage du SAV",
    ],
    stack: ["Python", "Power BI", "VBA", "JavaScript", "Windows Server"],
  },
  {
    role: "Analyste Q&A",
    company: "Le Livre Scolaire",
    location: "Lyon, France",
    period: "Jan. 2025 — Sept. 2025",
    missions: [
      "Contrôle qualité sur les systèmes de gestion de contenu et reporting d'anomalies",
      "Suivi des corrections en lien avec les équipes techniques",
      "Fiabilisation des flux de données et amélioration du process qualité",
    ],
    stack: ["PHP", "Python", "SQL", "MongoDB", "PostgreSQL", "Testim", "Git", "CI"],
  },
  {
    role: "Développeur Back-end",
    company: "InnovQube",
    location: "Paris, France (à distance)",
    period: "Nov. 2024 — Jan. 2025",
    missions: [
      "Création d'outils d'extraction / transformation de données",
      "Architecture d'interfaces web et scripts automatisés",
      "Documentation technique et interaction avec les équipes produit",
    ],
    stack: ["Laravel", "Vue.js", "PHP", "MySQL", "Redis", "API REST", "Docker", "RAG"],
  },
  {
    role: "Développeur backend en intelligence artificielle",
    company: "Nexora AI",
    location: "Londres, Royaume-Uni (à distance)",
    period: "Sept. 2024 — Oct. 2024",
    missions: [
      "Documentation technique et support utilisateurs pour le déploiement cloud",
      "Mise en place de pipelines ML/NLP pour l'analyse automatique de textes",
      "Gestion de données massives et création d'API pour connecter back-end et front-end",
      "Déploiement sur AWS avec Docker et intégration CI/CD via GitLab",
      "Conception de dashboards interactifs : solution IA réduisant de 30 % le temps de traitement des tickets clients",
    ],
    stack: ["Machine Learning", "NLP", "AWS", "Docker", "CI/CD", "GitLab", "API REST"],
  },
  {
    role: "Business Analyst Data/CRM",
    company: "Capgemini",
    location: "Paris, France · Hybride",
    period: "Oct. 2023 — Août 2024",
    missions: [
      "Nettoyage, migration et validation de bases clients",
      "Mise en place de règles de cohérence et recueil des besoins",
      "Rédaction des user stories, suivi du backlog et participation aux UAT",
      "Création de dashboards et rapports de suivi utilisés par les managers",
      "Animation de sessions de formation et rédaction de tutoriels d'utilisation CRM",
      "Collaboration internationale avec les équipes IT et métier (France, Espagne, UK)",
    ],
    stack: ["Python", "JavaScript", "CRM", "Dashboards"],
  },
];
