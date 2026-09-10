/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Shield, Target, Award, Users, FileText, Landmark } from 'lucide-react';

export type ActiveTab = 'home' | 'about' | 'services' | 'methodology' | 'contact';

export interface CoFounder {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  initials: string;
}

export interface ServicePole {
  id: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  tools: string[];
  badgeColor: string;
}

export interface MethodologyPhase {
  phaseNumber: number;
  title: string;
  description: string;
  objective: string;
  tools: string[];
  inputRequired: string;
  outputLivable: string;
}

// STATIC DATA
// Équipe réelle d'Axis.
export const CO_FOUNDERS: CoFounder[] = [
  {
    id: 'founder-1',
    name: 'Mardochée Joseph',
    role: 'Fondateur · Vision & Direction',
    bio: "Donne le ton et la direction d'Axis : cadrage stratégique des missions, exigence de résultats et cohérence de l'ensemble.",
    specialties: ['Vision & Stratégie', 'Direction des missions', 'Orientation résultats'],
    initials: 'MJ'
  },
  {
    id: 'founder-2',
    name: 'Antoine Ismann',
    role: 'Garant du Cadre & de la Méthodologie',
    bio: "Veille à ce que le cadre méthodologique soit respecté à chaque étape : rigueur, conformité et qualité des livrables.",
    specialties: ['Rigueur méthodologique', 'Conformité', 'Contrôle qualité'],
    initials: 'AI'
  },
  {
    id: 'founder-3',
    name: 'Hervens Pierre',
    role: 'Marketing & Image de Marque',
    bio: "Façonne l'image, le récit et le positionnement de marque d'Axis comme de ceux qu'elle accompagne.",
    specialties: ['Marketing', 'Branding', 'Communication'],
    initials: 'HP'
  }
];

export const SERVICE_POLES: ServicePole[] = [
  {
    id: 'advisory',
    title: 'Axis Advisory',
    tagline: 'Conseil stratégique, organisationnel et institutionnel',
    description: 'Nous vous aidons à clarifier votre vision, à optimiser votre fonctionnement et à concevoir des feuilles de route robustes et pragmatiques adaptées au marché.',
    deliverables: [
      'Diagnostics organisationnels complets',
      'Plans stratégiques triennaux ou quinquennaux',
      'Analyse et cartographie des processus métiers',
      'Études de faisabilité commerciale et technique',
      'Feuilles de route d\'accompagnement au changement'
    ],
    tools: [
      'Grille d\'analyse SWOT / PESTEL',
      'Matrice d\'alignement stratégique',
      'Modèle d\'efficience opérationnelle',
      'Plan d\'actions prioritaires'
    ],
    badgeColor: 'cyan'
  },
  {
    id: 'project-operations',
    title: 'Axis Project & Operations',
    tagline: 'Gestion de projets et coordination opérationnelle',
    description: 'De l\'idée aux résultats réels. Nous mettons en œuvre les ressources de gestion nécessaires pour piloter vos projets dans le respect strict des délais, des budgets et de la qualité.',
    deliverables: [
      'Modélisation et planification de projets complexes',
      'Mise en place de bureaux de projets (PMO)',
      'Systèmes de suivi-évaluation réguliers des activités',
      'Suivi et contrôle de la matrice des risques opérationnels',
      'Rapports d\'avancement décisionnels mensuels'
    ],
    tools: [
      'WBS (Work Breakdown Structure)',
      'Diagrammes de Gantt interactifs',
      'Registres RAID (Risks, Assumptions, Issues, Dependencies)',
      'Cadres logiques de performance'
    ],
    badgeColor: 'navy'
  },
  {
    id: 'digital-data',
    title: 'Axis Digital & Data',
    tagline: 'Transformation numérique et valorisation des données',
    description: 'La technologie au service de l\'efficacité opérationnelle. Nous digitalisons vos processus manuels pour accélérer les flux et structurer vos données de décision.',
    deliverables: [
      'Schémas directeurs de transformation numérique',
      'Formulaires et applications de collecte terrain',
      'Bases de données relationnelles ou structurées',
      'Tableaux de bord interactifs (Dashboards KPI)',
      'Protocoles de tests fonctionnels et recettes d\'outils'
    ],
    tools: [
      'Outils No-Code / Low-Code',
      'Formulaires dynamiques intelligents',
      'Outils de Business Intelligence (BI)',
      'Cartographies de flux de données'
    ],
    badgeColor: 'green'
  },
  {
    id: 'learning-development',
    title: 'Axis Learning & Development',
    tagline: 'Formation et renforcement durable des capacités',
    description: 'Le transfert de compétences est au cœur de notre démarche. Nous formons vos équipes pour pérenniser les solutions implémentées au sein de votre structure.',
    deliverables: [
      'Diagnostics des besoins en compétences (GPMC)',
      'Syllabus et programmes de formation sur-mesure',
      'Ateliers pratiques de montée en compétences',
      'Manuels utilisateurs et supports de cours interactifs',
      'Suivi post-formation et évaluation du retour sur investissement'
    ],
    tools: [
      'Méthode Kirkpatrick (Évaluation de formation)',
      'Ateliers de co-conception de solutions',
      'Simulateurs de cas d\'usage',
      'Fiches de transfert de compétences'
    ],
    badgeColor: 'gray'
  }
];

export const METHODOLOGY_PHASES: MethodologyPhase[] = [
  {
    phaseNumber: 1,
    title: 'Qualification de la demande',
    description: 'Comprendre en profondeur le besoin du client, analyser le contexte macro-économique, valider l\'opportunité et évaluer les contraintes initiales.',
    objective: 'S\'assurer de l\'alignement et de la faisabilité avant tout engagement formel.',
    tools: ['Entretien exploratoire approfondi', 'Grille de diagnostic rapide', 'Matrice d\'opportunité pour la PME'],
    inputRequired: 'Expression informelle du besoin, problématique métier soulevée.',
    outputLivable: 'Fiche d\'opportunité qualifiée, accord de principe pour cadrage.'
  },
  {
    phaseNumber: 2,
    title: 'Cadrage de la mission',
    description: 'Définir rigoureusement les objectifs SMART, le périmètre d\'intervention, les livrables clés et la répartition des responsabilités opérationnelles.',
    objective: 'Éviter toute dérive de périmètre et poser les bases d\'une collaboration transparente.',
    tools: ['Fiche d\'Objectifs SMART', 'Matrice de responsabilités RACI', 'Note de Cadrage formelle'],
    inputRequired: 'Fiche d\'opportunité validée, entretiens clés avec les décideurs.',
    outputLivable: 'Note de cadrage co-signée, Plan de gouvernance initial.'
  },
  {
    phaseNumber: 3,
    title: 'Conception de l’intervention',
    description: 'Élaborer l\'architecture méthodologique, le plan de travail détaillé, le budget afférent et la matrice d\'allocation des ressources.',
    objective: 'Planifier de manière réaliste et structurer les livrables attendus.',
    tools: ['WBS (Organigramme des tâches)', 'Planning GANTT prévisionnel', 'Registre des risques (RAID)'],
    inputRequired: 'Note de cadrage signée, cahier des charges interne.',
    outputLivable: 'Plan d\'intervention global, budget de mission approuvé.'
  },
  {
    phaseNumber: 4,
    title: 'Mise en œuvre',
    description: 'Exécuter les activités planifiées, coordonner les actions, suivre les indicateurs intermédiaires et adapter la feuille de route en temps réel.',
    objective: 'Garantir une exécution fluide et une transparence totale sur le statut d\'avancement.',
    tools: ['Système Kanban interactif', 'Réunions de coordination', 'Fiches de suivi opérationnel'],
    inputRequired: 'Lancement de mission, Plan d\'intervention.',
    outputLivable: 'Livrables intermédiaires, rapports d\'avancement périodiques.'
  },
  {
    phaseNumber: 5,
    title: 'Contrôle qualité',
    description: 'Soumettre l\'ensemble des travaux produits à une validation interne rigoureuse pour garantir le niveau d\'excellence attendu.',
    objective: 'Assurer une conformité totale aux exigences métiers et aux critères de réussite convenus.',
    tools: ['Checklist de conformité de livrable', 'Revue croisée de la Direction', 'Séances de tests utilisateurs'],
    inputRequired: 'Projets de livrables rédigés, fiches de tests opérationnels.',
    outputLivable: 'Grille qualité complétée, livrables pré-validés pour présentation.'
  },
  {
    phaseNumber: 6,
    title: 'Clôture de mission',
    description: 'Transmettre de manière formelle les livrables finaux, réaliser la session de transfert de compétences et acter la réception.',
    objective: 'Clore administrativement et transférer sereinement la propriété des outils.',
    tools: ['Rapport de fin de mission', 'Procès-verbal de réception', 'Fiche d\'évaluation post-livraison'],
    inputRequired: 'Livrables validés par le contrôle qualité, feedback client.',
    outputLivable: 'Procès-verbal de réception signé, rapport de mission archivé.'
  },
  {
    phaseNumber: 7,
    title: 'Suivi des résultats',
    description: 'Évaluer l\'impact réel à 30/60/90 jours après l\'intervention, mesurer le taux d\'adoption des livrables et la satisfaction à long terme.',
    objective: 'Assurer la pérennité de l\'intervention et l\'atteinte des bénéfices réels.',
    tools: ['Questionnaire d\'impact', 'Tableau de suivi des KPI d\'adoption', 'Plan d\'amélioration continue'],
    inputRequired: 'Dossier de mission clôturé, recul de 1 à 3 mois sur l\'utilisation.',
    outputLivable: 'Rapport d\'évaluation d\'impact, fiche de retour d\'expérience (REX).'
  }
];
