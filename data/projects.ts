export type Project = {
  title: string;
  organization: string;
  period: string;
  description: string;
  tags: string[];
  grade?: string;
  githubUrl?: string;
  fileUrl?: string;
  fileLabel?: string;
};

export const projects: Project[] = [
  {
    title: "Projet Ligue des Champions",
    organization: "Nexa Digital School",
    period: "Oct. 2024 — Jan. 2025",
    description:
      "Reproduction en binôme du nouveau format de tirage au sort de la Ligue des Champions UEFA 2024/2025 : traitement d'une base de données JSON des équipes qualifiées et génération automatique d'un livrable PDF interactif.",
    tags: ["Python 3.10", "fpdf2", "Algorithmes", "Gestion de projet"],
    githubUrl: "https://github.com/ehk85/Projet_LDC",
  },
  {
    title: "Projet IA 2025 — IA & développement durable",
    organization: "Nexa Digital School",
    period: "Sept. 2024 — Avr. 2025",
    description:
      "Conception et planification, en tant que chef de projet, d'une solution IA répondant à un enjeu de développement durable dans un secteur d'activité choisi — de la problématique à l'évaluation financière et aux indicateurs de suivi.",
    tags: ["IA & développement durable", "Chef de projet", "Office 365"],
    grade: "A (15/20)",
  },
  {
    title: "Projet d'Étude 2025",
    organization: "Nexa Digital School",
    period: "Sept. 2024 — Août 2025",
    description:
      "Étude de causalité approfondie (rapport de 40 pages) : diagnostic complet d'un environnement data, définition argumentée d'une stratégie IA et évaluation financière, avec plan de réalisation et indicateurs de performance.",
    tags: ["Stratégie IA", "Python", "Analyse financière"],
    grade: "A (16/20)",
  },
  {
    title: "Projet IA 2024 — Lutte contre la désinformation",
    organization: "Nexa Digital School",
    period: "Sept. 2023 — Avr. 2024",
    description:
      "Étude sur la lutte contre les fake news et les deepfakes à l'aide de l'IA (NLP, vision par ordinateur), avec une réflexion éthique sur la préservation de l'intégrité de l'information.",
    tags: ["NLP", "Vision par ordinateur", "MLOps", "Éthique de l'IA"],
    grade: "A (17/20)",
    fileLabel: "EmmanuelKONATE_B3LM1_ProjetIA.pdf",
  },
  {
    title: "Projet d'Étude 2024",
    organization: "Nexa Digital School",
    period: "Sept. 2023 — Août 2024",
    description:
      "Analyse de marché et diagnostic d'entreprise, suivis de l'élaboration d'une stratégie IA complète (gestion des données, implications managériales, planning et KPI). Rapport de 30 pages et soutenance orale devant un jury professionnel.",
    tags: ["Stratégie IA", "Diagnostic d'entreprise", "Gestion de projet"],
    grade: "A (16/20)",
  },
  {
    title: "Système de largage de confettis pour drone",
    organization: "ESSTI-Rabat",
    period: "Fév. 2021 — Juil. 2021",
    description:
      "Conception d'un système de largage de confettis compatible avec le drone DJI S1000, pour une diffusion synchronisée lors d'un événement festif.",
    tags: ["Ingénierie mécatronique", "DJI S1000", "Travail d'équipe"],
    fileLabel: "Rapport C&F.pdf",
  },
];
