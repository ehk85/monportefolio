-- Seed : reprend le contenu actuel du site dans les nouvelles tables.
-- À exécuter une seule fois, après migrate.sql, dans Supabase SQL Editor.

insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Chargé des données Achats et IA', 'AFEO', 'Genas, France', 'lyon', 'Fév. 2026 — Sept. 2026 · Stage alterné', true, ARRAY['Mise en place d''une solution IA pour améliorer l''émission de devis', 'Mise en place d''outils pour l''optimisation des tournées techniques à l''aide de JavaScript', 'Création de dashboards BI pour le pilotage du SAV', 'Animation de la relation fournisseurs en lien avec les achats']::text[], ARRAY['Python', 'VBA', 'JavaScript', 'Node', 'React', 'Vue', 'Microsoft SQL Server', 'Power BI', 'Excel']::text[], 0
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Analyste QA', 'Le Livre Scolaire', 'Lyon, France', 'lyon', 'Jan. 2025 — Sept. 2025 · Alternance', false, ARRAY['Contrôle qualité sur les systèmes de gestion de contenu et reporting des anomalies', 'Suivi des corrections en lien avec les équipes techniques', 'Contribution à la fiabilisation des flux de données et à l''amélioration du process qualité']::text[], ARRAY['PHP', 'Python', 'JavaScript', 'SQL', 'Git', 'MongoDB', 'PostgreSQL', 'Testim', 'Tests unitaires', 'Intégration continue']::text[], 1
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Développeur Back End', 'InnovQube', 'Paris, France (à distance)', 'paris', 'Nov. 2024 — Jan. 2025 · Stage', false, ARRAY['Création d''outils d''extraction et de transformation de données', 'Architecture d''interfaces web et scripts automatisés', 'Documentation technique et interaction avec les équipes produit']::text[], ARRAY['Laravel', 'Vue.js', 'PHP', 'MySQL', 'Redis', 'API REST', 'Docker', 'RAG', 'Llama', 'Mistral', 'Qwen']::text[], 2
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Développeur Back End en intelligence artificielle', 'Nexora AI', 'Londres, Royaume-Uni (à distance)', 'londres', 'Sept. 2024 — Oct. 2024 · Stage', false, ARRAY['Documentation technique et support utilisateurs pour le déploiement cloud', 'Mise en place de pipelines Machine Learning et NLP pour l''analyse automatique de textes', 'Création d''API pour connecter back end et front end', 'Déploiement sur AWS avec Docker et intégration continue via GitLab']::text[], ARRAY['Flask', 'FastAPI', 'MongoDB', 'ETL', 'Docker', 'AWS', 'GitLab', 'Analyse prédictive']::text[], 3
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Business Analyst Data et CRM', 'Capgemini', 'Paris, France', 'paris', 'Oct. 2023 — Août 2024 · Alternance', false, ARRAY['Nettoyage, migration et validation de bases clients', 'Mise en place de règles de cohérence et recueil des besoins', 'Rédaction des user stories, suivi du backlog et participation aux UAT', 'Création de dashboards et rapports de suivi utilisés par les managers', 'Animation de sessions de formation et rédaction de tutoriels d''utilisation CRM', 'Collaboration internationale avec les équipes IT et métier en France, Espagne et au Royaume-Uni']::text[], ARRAY['SQL', 'VBA', 'CRM', 'JavaScript', 'Scrum', 'Power BI', 'Python', 'Tableaux croisés dynamiques']::text[], 4
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Développeur logiciels', 'WebTech', 'Abidjan, Côte d''Ivoire', 'abidjan', 'Sept. 2022 — Août 2023', false, ARRAY[]::text[], ARRAY['Bases de données', 'Java', 'Django', 'Travail d''équipe', 'WinDev', 'Maintenance des données', 'SQL', 'WebDev', 'Compétences analytiques', 'E-commerce', 'Contrôle de version', 'Microsoft Windows', 'Algorithmes', 'Gestion de l''assistance bureautique', 'WinDev Mobile', 'Bonnes pratiques (GxP)']::text[], 5
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Stagiaire', 'SUNU GROUP', 'Abidjan, Côte d''Ivoire', 'abidjan', 'Août 2021 — Oct. 2021', false, ARRAY[]::text[], ARRAY['Cloud Computing', 'Linux', 'Travail d''équipe', 'Office 365', 'Sécurité de l''information', 'Kali Linux', 'Microsoft Windows', 'Assistance informatique']::text[], 6
);
insert into public.experiences (role, company, location, region, period, is_current, missions, stack, sort_order) values (
  'Stagiaire', 'SNDI — Société Nationale de Développement Informatique', 'Abidjan, Côte d''Ivoire', 'abidjan', 'Août 2019 — Oct. 2019', false, ARRAY[]::text[], ARRAY['Microsoft Office', 'Informatique', 'Microsoft Windows', 'Assistance informatique']::text[], 7
);

insert into public.education (degree, school, location, period, is_current, detail, sort_order) values (
  'MSc MBA Expert en Management des Systèmes d''Information', 'Epitech', 'Lyon, France', 'Sept. 2026 — Oct. 2027', true, 'Année en cours', 0
);
insert into public.education (degree, school, location, period, is_current, detail, sort_order) values (
  'Mastère Chef de projet Data / Intelligence Artificielle', 'NEXA Digital School', 'Lyon, France', 'Sept. 2024 — Juin 2026', false, 'Python avancé, IA générative, Machine Learning, MLOps, gestion de projet agile, sécurité et gouvernance des données, API REST, RGPD, Web Scraping & web mining', 1
);
insert into public.education (degree, school, location, period, is_current, detail, sort_order) values (
  'Bachelor Concepteur & Chef de Projet Web', 'NEXA Digital School', 'Lyon, France', 'Sept. 2023 — Juin 2024', false, 'ETL, POO, SEO, contrôle de gestion, Excel-VBA, dashboard, RGPD, SQL', 2
);
insert into public.education (degree, school, location, period, is_current, detail, sort_order) values (
  'Ingénieur Système Automatisé', 'ESSTI', 'Rabat, Maroc', 'Oct. 2019 — Juin 2022', false, 'Compréhension et automatisation des process et flux d''entreprise', 3
);
