export type SkillGroup = {
  category: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Langages",
    items: ["Python", "Java / JavaScript", "HTML5 / CSS3", "SQL / NoSQL", "R (Shiny)", "VBA"],
  },
  {
    category: "Data Science & IA",
    items: [
      "Analyse statistique et exploration de données",
      "Machine learning supervisé et non supervisé",
      "Préparation de données pour l'IA",
      "IA générative (RAG, Llama, Mistral, Qwen)",
    ],
  },
  {
    category: "Data Visualisation & Restitution",
    items: ["Power BI (dashboards, indicateurs)", "Restitution à des profils non techniques"],
  },
  {
    category: "Data Engineering",
    items: [
      "Collecte, nettoyage, transformation (ETL)",
      "Bases de données relationnelles SQL/NoSQL",
      "Modélisation & contrôle qualité des données",
    ],
  },
  {
    category: "BI & CRM",
    items: [
      "Analyse de trafic e-commerce",
      "Analyse comportementale client",
      "RGPD & protection des données",
    ],
  },
  {
    category: "Méthodes & Collaboration",
    items: ["Git", "Docker", "Linux (Ubuntu)", "Trello", "Agile / Scrum"],
  },
  {
    category: "Gestion de projet & Management",
    items: [
      "Priorisation des tâches à forte valeur ajoutée",
      "Suivi des délais et jalons",
      "Leadership & communication transparente",
    ],
  },
];
