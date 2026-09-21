export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Langages & Frameworks",
    items: [
      "Python",
      "PHP",
      "Java",
      "JavaScript",
      "TypeScript (non pratiqué)",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Laravel",
      "Flask",
      "FastAPI",
      "Vue.js",
      "React",
      "Node",
    ],
  },
  {
    category: "Bases de données",
    items: ["SQL", "NoSQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Microsoft SQL Server"],
  },
  {
    category: "Cloud & DevOps",
    items: ["AWS", "Docker", "Git", "GitLab", "CI/CD", "Linux (Ubuntu)", "VSCode"],
  },
  {
    category: "Data & IA",
    items: [
      "Power BI",
      "DAX",
      "Power Query",
      "ETL",
      "R (Shiny)",
      "Analyse statistique",
      "Machine learning supervisé et non supervisé",
      "IA générative",
      "RAG",
      "Llama",
      "Mistral",
      "Qwen",
    ],
  },
  {
    category: "Méthodes & Outils",
    items: [
      "Agile",
      "Scrum",
      "Kanban",
      "VBA",
      "Trello",
      "Testim",
      "Tests unitaires",
      "Gestion de projet",
      "Gestion multi-équipes",
    ],
  },
];
