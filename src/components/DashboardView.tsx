/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase, Plus, CheckCircle2, AlertTriangle,
  Layers, CheckSquare, Download,
  Trash2, User, KanbanSquare, Table, ShieldAlert
} from 'lucide-react';
import { 
  SimulatedProject, ProjectTask, ProjectRisk, RACIMatrixRow, SMARTGoal, 
  INITIAL_SIMULATED_PROJECTS, METHODOLOGY_PHASES 
} from '../types';

export default function DashboardView() {
  const [projects, setProjects] = useState<SimulatedProject[]>(INITIAL_SIMULATED_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('p-1');
  const [activeSubTab, setActiveSubTab] = useState<'kpi' | 'smart' | 'raci' | 'wbs' | 'risks' | 'kanban'>('kpi');
  
  // Custom Project Form state
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjClient, setNewProjClient] = useState('');
  const [newProjSector, setNewProjSector] = useState('Commerce de détail');
  
  // Custom Task state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskOwner, setNewTaskOwner] = useState('Co-fondateur A');
  const [showAddTask, setShowAddTask] = useState(false);

  // Custom Risk state
  const [newRiskTitle, setNewRiskTitle] = useState('');
  const [newRiskProb, setNewRiskProb] = useState<'1' | '2' | '3'>('2');
  const [newRiskImpact, setNewRiskImpact] = useState<'1' | '2' | '3'>('2');
  const [newRiskMitigation, setNewRiskMitigation] = useState('');
  const [showAddRisk, setShowAddRisk] = useState(false);

  // Note de cadrage printed state
  const [scopingSigned, setScopingSigned] = useState(false);
  const [showScopingPrint, setShowScopingPrint] = useState(false);

  // Find currently active project
  const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Handler to add custom project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName || !newProjClient) return;

    const newProject: SimulatedProject = {
      id: `p-${Date.now()}`,
      name: newProjName,
      clientName: newProjClient,
      sector: newProjSector,
      startDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      status: 'active',
      progress: 15,
      currentPhase: 2, // Starts at Cadrage phase
      smartGoal: {
        specific: `Optimiser le fonctionnement opérationnel de ${newProjClient}.`,
        measurable: 'Atteindre un taux d\'efficacité supérieur de 20% par rapport à l\'existant.',
        achievable: 'Par un diagnostic rigoureux et l\'implémentation d\'outils métiers sur-mesure.',
        relevant: 'Aligné sur les ambitions d\'expansion de la structure.',
        timeBound: 'Réalisation complète sous 12 semaines.'
      },
      risks: [
        {
          id: `r-${Date.now()}`,
          title: 'Manque de disponibilité des équipes internes pour les ateliers de co-conception',
          probability: 2,
          impact: 2,
          mitigation: 'Planification anticipée des sessions clés et blocage d\'agendas auprès de la direction.'
        }
      ],
      tasks: [
        { id: `t-${Date.now()}-1`, title: 'Cadrage initial de la demande', description: 'Valider les premiers indicateurs', column: 'done', priority: 'high', phase: 1, assignedTo: 'Co-fondateur A' },
        { id: `t-${Date.now()}-2`, title: 'Élaboration de la note de cadrage', description: 'Figer les rôles RACI de la mission', column: 'in_progress', priority: 'high', phase: 2, assignedTo: 'Co-fondateur B' },
        { id: `t-${Date.now()}-3`, title: 'Atelier de validation SMART', description: 'Co-signer les indicateurs clés', column: 'todo', priority: 'medium', phase: 2, assignedTo: 'Co-fondateur C' }
      ],
      raci: [
        { task: 'Diagnostic préliminaire', director: 'A', client: 'C', consultant: 'R', partner: 'I' },
        { task: 'Note de cadrage', director: 'R', client: 'A', consultant: 'R', partner: 'I' },
        { task: 'Conception des livrables', director: 'C', client: 'I', consultant: 'R', partner: 'A' }
      ]
    };

    setProjects([...projects, newProject]);
    setSelectedProjectId(newProject.id);
    setNewProjName('');
    setNewProjClient('');
    setShowAddProject(false);
  };

  // Handler to update a Kanban task column
  const handleMoveTask = (taskId: string, direction: 'forward' | 'backward') => {
    const updatedProjects = projects.map(p => {
      if (p.id !== selectedProjectId) return p;
      
      const updatedTasks = p.tasks.map(t => {
        if (t.id !== taskId) return t;
        
        const columns: ProjectTask['column'][] = ['todo', 'in_progress', 'review', 'done'];
        const currentIndex = columns.indexOf(t.column);
        let nextIndex = currentIndex;
        
        if (direction === 'forward' && currentIndex < columns.length - 1) {
          nextIndex = currentIndex + 1;
        } else if (direction === 'backward' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        }

        // Calculate a dynamic impact on project progress based on columns
        const newCol = columns[nextIndex];
        return { ...t, column: newCol };
      });

      // Calculate new progress dynamically
      const completedCount = updatedTasks.filter(t => t.column === 'done').length;
      const totalCount = updatedTasks.length;
      const newProgress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // Calculate current phase based on progress and tasks
      let calculatedPhase = p.currentPhase;
      if (newProgress > 90) {
        calculatedPhase = 6; // Clôture
      } else if (newProgress > 70) {
        calculatedPhase = 5; // Contrôle qualité
      } else if (newProgress > 30) {
        calculatedPhase = 4; // Mise en œuvre
      }

      return { 
        ...p, 
        tasks: updatedTasks, 
        progress: newProgress,
        currentPhase: calculatedPhase
      };
    });

    setProjects(updatedProjects);
  };

  // Handler to add custom Kanban task
  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask: ProjectTask = {
      id: `t-${Date.now()}`,
      title: newTaskTitle,
      description: newTaskDesc,
      column: 'todo',
      priority: newTaskPriority,
      phase: currentProject.currentPhase,
      assignedTo: newTaskOwner
    };

    const updatedProjects = projects.map(p => {
      if (p.id !== selectedProjectId) return p;
      const totalCount = p.tasks.length + 1;
      const completedCount = p.tasks.filter(t => t.column === 'done').length;
      const newProgress = Math.round((completedCount / totalCount) * 100);
      
      return {
        ...p,
        tasks: [...p.tasks, newTask],
        progress: newProgress
      };
    });

    setProjects(updatedProjects);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setShowAddTask(false);
  };

  // Handler to add custom Risk
  const handleAddRiskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRiskTitle) return;

    const newRisk: ProjectRisk = {
      id: `r-${Date.now()}`,
      title: newRiskTitle,
      probability: parseInt(newRiskProb) as 1 | 2 | 3,
      impact: parseInt(newRiskImpact) as 1 | 2 | 3,
      mitigation: newRiskMitigation
    };

    const updatedProjects = projects.map(p => {
      if (p.id !== selectedProjectId) return p;
      return {
        ...p,
        risks: [...p.risks, newRisk]
      };
    });

    setProjects(updatedProjects);
    setNewRiskTitle('');
    setNewRiskMitigation('');
    setShowAddRisk(false);
  };

  // Update a single RACI cell
  const handleCycleRacicCell = (rowIndex: number, role: 'director' | 'client' | 'consultant' | 'partner') => {
    const roles: ('R' | 'A' | 'C' | 'I' | '')[] = ['R', 'A', 'C', 'I', ''];
    
    const updatedProjects = projects.map(p => {
      if (p.id !== selectedProjectId) return p;
      
      const updatedRaci = p.raci.map((row, idx) => {
        if (idx !== rowIndex) return row;
        
        const currentValue = row[role];
        const nextIndex = (roles.indexOf(currentValue) + 1) % roles.length;
        const nextValue = roles[nextIndex];
        
        return {
          ...row,
          [role]: nextValue
        };
      });

      return {
        ...p,
        raci: updatedRaci
      };
    });

    setProjects(updatedProjects);
  };

  // Delete project
  const handleDeleteProject = (projId: string) => {
    if (projects.length <= 1) return; // Retain at least one
    const remaining = projects.filter(p => p.id !== projId);
    setProjects(remaining);
    setSelectedProjectId(remaining[0].id);
  };

  // RACI Validation Rule Checker
  const checkRaciValidity = (raci: RACIMatrixRow[]) => {
    const issues: string[] = [];
    raci.forEach((row, idx) => {
      // Rule 1: Must have exactly one "A" per row
      const aCount = [row.director, row.client, row.consultant, row.partner].filter(val => val === 'A').length;
      if (aCount === 0) {
        issues.push(`Tâche "${row.task}" : Manque de redevable direct (A). Chaque tâche requiert exactement un décideur.`);
      } else if (aCount > 1) {
        issues.push(`Tâche "${row.task}" : Multiplicité de redevables (A). Conflit d'autorité potentiel.`);
      }

      // Rule 2: Must have at least one "R" per row
      const rCount = [row.director, row.client, row.consultant, row.partner].filter(val => val === 'R').length;
      if (rCount === 0) {
        issues.push(`Tâche "${row.task}" : Aucun acteur assigné à l'exécution (R).`);
      }
    });
    return issues;
  };

  const raciIssues = checkRaciValidity(currentProject.raci);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn" id="dashboard-container">
      {/* Upper header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-brand-navy text-white p-6 sm:p-8 rounded-3xl border-l-4 border-brand-cyan shadow-lg relative overflow-hidden" id="dashboard-header-block">
        <div className="absolute top-0 right-0 h-40 w-40 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-2 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-brand-cyan/25 text-brand-cyan text-2xs font-bold uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-brand-green animate-ping" />
            Environnement de Simulation Méthodologique (MVP)
          </div>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight">Espace de Pilotage & Gestion</h1>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed font-sans">
            Manipulez nos outils méthodologiques en conditions réelles. Sélectionnez un cas client (PME) existant ou simulez un nouveau projet pour visualiser l'application stricte des 7 phases de la firme.
          </p>
        </div>

        {/* Project Selector Control */}
        <div className="flex flex-wrap items-center gap-3 relative z-10 text-left" id="project-controls-wrapper">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-white/50 block mb-1">Projet simulé actif :</span>
            <select
              id="select-simulated-project"
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                setScopingSigned(false);
                setShowScopingPrint(false);
              }}
              className="bg-white/10 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 focus:outline-hidden focus:border-brand-cyan cursor-pointer min-w-[200px]"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="text-brand-navy font-bold">
                  {p.name.length > 30 ? `${p.name.substring(0, 30)}...` : p.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="btn-trigger-add-project"
            onClick={() => setShowAddProject(!showAddProject)}
            className="bg-brand-cyan hover:bg-white text-brand-navy font-bold text-xs uppercase tracking-wider px-4 py-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-sm whitespace-nowrap mt-4 lg:mt-0"
          >
            <Plus className="h-4 w-4" />
            Nouveau Projet
          </motion.button>
        </div>
      </div>

      {/* Add Custom Project Modal / Drawer */}
      {showAddProject && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-3xl border-l-4 border-brand-cyan border-y border-r border-brand-gray/15 shadow-lg text-left" 
          id="add-project-modal"
        >
          <div className="border-b border-brand-navy/5 pb-3 mb-6 flex justify-between items-center">
            <h2 className="font-display font-bold text-xl text-brand-navy uppercase tracking-tight">Simuler un Nouveau Cadrage Projet</h2>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="btn-close-add-project" 
              onClick={() => setShowAddProject(false)} 
              className="text-brand-navy/65 hover:text-brand-navy p-2 font-bold text-xs uppercase tracking-wider cursor-pointer bg-brand-navy/5 rounded-xl px-4"
            >
              Fermer
            </motion.button>
          </div>

          <form onSubmit={handleCreateProject} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <label htmlFor="newProjName" className="text-3xs uppercase font-bold text-brand-navy/60 block">Nom du projet *</label>
              <input
                type="text"
                id="newProjName"
                required
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="Audit de Performance Opérationnelle"
                className="w-full px-4 py-2.5 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="newProjClient" className="text-3xs uppercase font-bold text-brand-navy/60 block">Nom de la PME Client *</label>
              <input
                type="text"
                id="newProjClient"
                required
                value={newProjClient}
                onChange={(e) => setNewProjClient(e.target.value)}
                placeholder="Haiti Logistics S.A."
                className="w-full px-4 py-2.5 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <div className="space-y-1 flex-1">
                <label htmlFor="newProjSector" className="text-3xs uppercase font-bold text-brand-navy/60 block">Secteur d'activité</label>
                <select
                  id="newProjSector"
                  value={newProjSector}
                  onChange={(e) => setNewProjSector(e.target.value)}
                  className="w-full px-4 py-2.5 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden cursor-pointer"
                >
                  <option value="Agroalimentaire">Agroalimentaire</option>
                  <option value="Distribution">Distribution / Commerce</option>
                  <option value="Logistique">Logistique & Transport</option>
                  <option value="Manufacture">Production & Manufacture</option>
                  <option value="Services">Services Professionnels</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                id="btn-submit-new-project"
                className="bg-brand-navy hover:bg-brand-cyan hover:text-brand-navy text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl border border-brand-navy hover:border-brand-cyan transition-all h-11 flex items-center justify-center cursor-pointer"
              >
                Créer
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Main Grid: Tools navigation on left/top, Workspace view on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="dashboard-workspace-grid">
        {/* Workspace sidebar navigation */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 bg-white p-4 rounded-3xl border border-brand-gray/15 shadow-md" id="dashboard-sidebar">
          {[
            { id: 'kpi', label: '1. Tableau de bord', icon: Briefcase },
            { id: 'smart', label: '2. Cadrage SMART', icon: CheckSquare },
            { id: 'raci', label: '3. Matrice RACI', icon: Table },
            { id: 'wbs', label: '4. Structure WBS', icon: Layers },
            { id: 'risks', label: '5. Matrice de Risques', icon: ShieldAlert },
            { id: 'kanban', label: '6. Suivi Kanban', icon: KanbanSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={tab.id}
                id={`dashboard-sidebar-tab-${tab.id}`}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-xs sm:text-sm font-bold uppercase tracking-tight transition-all duration-200 cursor-pointer border relative ${
                  isActive 
                    ? 'bg-brand-navy text-white border-brand-navy shadow-sm' 
                    : 'text-brand-navy/70 border-transparent hover:bg-brand-navy/5'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeSubTabIndicator"
                    className="absolute inset-0 border border-brand-cyan rounded-2xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <Icon className={`h-4.5 w-4.5 relative z-10 ${isActive ? 'text-brand-cyan' : 'text-brand-navy/40'}`} />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            );
          })}
          
          <div className="hidden lg:block pt-4 mt-4 border-t border-brand-navy/15 px-2 text-left">
            <div className="p-3.5 bg-brand-light rounded-2xl border-l-4 border-brand-navy space-y-1">
              <span className="text-3xs uppercase font-bold text-brand-navy/70 block">Rappel de Cadrage</span>
              <p className="text-3xs text-brand-navy/75 leading-relaxed font-sans">
                Chaque modification apportée aux tâches ou aux risques recalcule automatiquement la progression globale et ajuste la phase d'intervention.
              </p>
            </div>
            <motion.button
              whileHover={{ x: 2 }}
              id="btn-delete-current-project"
              onClick={() => handleDeleteProject(currentProject.id)}
              disabled={projects.length <= 1}
              className="w-full text-left mt-4 text-2xs text-red-500 hover:text-red-700 font-bold uppercase tracking-wider flex items-center gap-1.5 p-2 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Supprimer cette simulation
            </motion.button>
          </div>
        </div>

        {/* WORKSPACE AREA (Dynamic View Rendering) */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-brand-gray/15 p-6 sm:p-8 min-h-[500px] shadow-md flex flex-col justify-between" id="dashboard-active-workspace">
          
          {/* Tab 1: Tableau de Bord (KPI Overview) */}
          {activeSubTab === 'kpi' && (
            <div className="space-y-6 animate-fadeIn text-left" id="view-kpi">
              <div className="border-b border-brand-navy/5 pb-4">
                <span className="text-3xs uppercase font-mono tracking-widest text-brand-cyan-text font-bold block mb-1">Phase 1 & 7 : Qualification et Valorisation</span>
                <h2 className="font-display font-black text-2xl text-brand-navy uppercase tracking-tight">État de Santé du Projet</h2>
              </div>

              {/* Top stats boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-brand-light p-5 rounded-2xl border border-brand-navy/5 border-l-4 border-brand-navy space-y-2">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60 block">Avancement opérationnel</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-3xl font-extrabold text-brand-navy">{currentProject.progress}%</span>
                    <div className="flex-1 bg-brand-navy/10 h-3 rounded-full overflow-hidden">
                      <div className="bg-brand-cyan h-full transition-all duration-500 rounded-full" style={{ width: `${currentProject.progress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="bg-brand-light p-5 rounded-2xl border border-brand-navy/5 border-l-4 border-brand-cyan space-y-2">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60 block">Phase Méthodologique</span>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-lg font-black text-brand-navy uppercase tracking-tight">Phase {currentProject.currentPhase}/7</span>
                    <span className="bg-brand-cyan/15 text-brand-navy font-mono text-3xs font-bold px-2 py-0.5 rounded-lg">
                      {METHODOLOGY_PHASES[currentProject.currentPhase - 1].title.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-3xs text-brand-navy/60 truncate font-semibold uppercase">{METHODOLOGY_PHASES[currentProject.currentPhase - 1].title}</p>
                </div>

                <div className="bg-brand-light p-5 rounded-2xl border border-brand-navy/5 border-l-4 border-brand-green space-y-2">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60 block">Alertes de Risques actives</span>
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg text-white flex items-center justify-center ${
                      currentProject.risks.length > 0 ? 'bg-amber-500' : 'bg-brand-green'
                    }`}>
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <span className="font-mono text-2xl font-bold text-brand-navy">{currentProject.risks.length}</span>
                    <span className="text-3xs text-brand-navy/65 uppercase font-bold">Plottés sur la matrice</span>
                  </div>
                </div>
              </div>

              {/* Timeline walkthrough of the 7 methodology phases */}
              <div className="bg-brand-navy text-white rounded-2xl border-l-4 border-brand-cyan p-6 space-y-4">
                <span className="text-3xs font-bold uppercase tracking-wider text-brand-cyan block">Workflow d'accompagnement Axis :</span>
                <div className="grid grid-cols-7 gap-1">
                  {METHODOLOGY_PHASES.map((p) => {
                    const isPassed = p.phaseNumber < currentProject.currentPhase;
                    const isCurrent = p.phaseNumber === currentProject.currentPhase;
                    return (
                      <div key={p.phaseNumber} className="flex flex-col items-center text-center space-y-1.5" title={p.title}>
                        <div className={`h-6 w-6 rounded-lg text-3xs font-bold flex items-center justify-center transition-all ${
                          isCurrent 
                            ? 'bg-brand-cyan text-brand-navy ring-4 ring-brand-cyan/20 scale-110 font-black' 
                            : isPassed 
                            ? 'bg-brand-green text-white font-bold' 
                            : 'bg-white/10 text-white/50'
                        }`}>
                          {p.phaseNumber}
                        </div>
                        <span className={`text-4xs uppercase tracking-wider font-bold block ${isCurrent ? 'text-brand-cyan font-bold' : 'text-white/60'}`}>
                          Ph. {p.phaseNumber}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Executive details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3">
                  <h3 className="font-display font-bold text-sm text-brand-navy uppercase tracking-wider border-b-2 border-brand-navy/10 pb-1">Fiche Signalétique Client</h3>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between"><span className="text-brand-navy/65">Raison sociale :</span><span className="font-bold text-brand-navy">{currentProject.clientName}</span></div>
                    <div className="flex justify-between"><span className="text-brand-navy/65">Secteur :</span><span className="font-semibold text-brand-navy">{currentProject.sector}</span></div>
                    <div className="flex justify-between"><span className="text-brand-navy/65">Démarrage de la mission :</span><span className="font-mono font-medium text-brand-navy">{currentProject.startDate}</span></div>
                    <div className="flex justify-between"><span className="text-brand-navy/65">Statut opérationnel :</span><span className="bg-brand-green/10 text-brand-green-text font-bold text-3xs px-2.5 py-0.5 rounded-none uppercase">Actif</span></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-display font-bold text-sm text-brand-navy uppercase tracking-wider border-b-2 border-brand-navy/10 pb-1">Tâches par statut</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-brand-light p-3 rounded-none border border-brand-navy/5 text-center">
                      <span className="text-2xl font-bold font-mono text-brand-navy">
                        {currentProject.tasks.filter(t => t.column === 'done').length}
                      </span>
                      <span className="text-4xs uppercase block text-brand-navy/65 font-bold mt-1">Validées & Livrées</span>
                    </div>
                    <div className="bg-brand-light p-3 rounded-none border border-brand-navy/5 text-center">
                      <span className="text-2xl font-bold font-mono text-brand-cyan-text">
                        {currentProject.tasks.filter(t => t.column !== 'done').length}
                      </span>
                      <span className="text-4xs uppercase block text-brand-navy/65 font-bold mt-1">En cours / Planifiées</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Cadrage SMART (Phase 2) */}
          {activeSubTab === 'smart' && (
            <div className="space-y-6 animate-fadeIn text-left" id="view-smart">
              <div className="border-b border-brand-navy/5 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-3xs uppercase font-mono tracking-widest text-brand-cyan-text font-bold block mb-1">Phase 2 : Cadrage de la mission</span>
                  <h2 className="font-display font-black text-2xl text-brand-navy uppercase tracking-tight">Cadrage de l'Objectif Stratégique (SMART)</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="btn-trigger-print-scoping"
                  onClick={() => setShowScopingPrint(!showScopingPrint)}
                  className="bg-brand-navy hover:bg-brand-cyan hover:text-brand-navy text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl border border-brand-navy hover:border-brand-cyan flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  Note de Cadrage (.PDF)
                </motion.button>
              </div>

              {!showScopingPrint ? (
                <div className="space-y-6">
                  <p className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans">
                    Toute mission signée par Axis Result Consulting fait l'objet d'un cadrage de but rigide selon la méthodologie SMART. Modifiez les indicateurs ci-dessous pour reformuler l'engagement d'Axis :
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { letter: 'S', title: 'Spécifique', text: currentProject.smartGoal.specific, color: 'border-l-brand-cyan', field: 'specific' },
                      { letter: 'M', title: 'Mesurable', text: currentProject.smartGoal.measurable, color: 'border-l-brand-navy', field: 'measurable' },
                      { letter: 'A', title: 'Atteignable', text: currentProject.smartGoal.achievable, color: 'border-l-brand-green', field: 'achievable' },
                      { letter: 'R', title: 'Réaliste', text: currentProject.smartGoal.relevant, color: 'border-l-brand-gray', field: 'relevant' },
                      { letter: 'T', title: 'Temporel', text: currentProject.smartGoal.timeBound, color: 'border-l-brand-cyan', field: 'timeBound' }
                    ].map((s, idx) => (
                      <div key={idx} className={`bg-brand-light p-4 rounded-2xl border-l-4 ${s.color} space-y-2 shadow-2xs flex flex-col justify-between`}>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 bg-brand-navy text-white font-display font-bold text-2xs flex items-center justify-center rounded-lg">{s.letter}</span>
                            <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60">{s.title}</span>
                          </div>
                          <p className="text-xs text-brand-navy font-bold italic">"{s.text}"</p>
                        </div>
                        <input
                          type="text"
                          id={`input-smart-${s.field}`}
                          value={s.text}
                          onChange={(e) => {
                            const updated = projects.map(p => {
                              if (p.id !== selectedProjectId) return p;
                              return {
                                ...p,
                                smartGoal: {
                                  ...p.smartGoal,
                                  [s.field]: e.target.value
                                }
                              };
                            });
                            setProjects(updated);
                          }}
                          className="w-full mt-2 bg-white px-2 py-1 text-2xs border border-brand-navy/10 rounded-lg focus:outline-hidden focus:border-brand-cyan"
                          title={`Modifier l'indicateur ${s.title}`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* SMART Validator panel */}
                  <div className="bg-brand-navy/5 p-4 rounded-2xl border-l-4 border-brand-navy space-y-1.5">
                    <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60 block">Garantie d'interventions de la firme :</span>
                    <p className="text-xs text-brand-navy/85 leading-relaxed font-sans">
                      Ce but SMART est injecté directement dans la <strong>Note de Cadrage formelle</strong>. En cas d'écart constaté lors de l'exécution, le Comité de coordination d'Axis se réfère à ces fiches textuelles pour recadrer l'action.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-brand-light border-l-4 border-brand-navy border-y border-r border-brand-navy/15 rounded-2xl space-y-6 font-mono text-xs sm:text-sm animate-fadeIn text-left" id="scoping-memorandum">
                  {/* Scoping Memoradum template */}
                  <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-brand-navy/20 pb-4 gap-4">
                    <div className="space-y-1">
                      <p className="font-bold text-brand-navy">AXIS RESULT CONSULTING</p>
                      <p className="text-3xs text-brand-navy/65 uppercase font-mono">Port-au-Prince, Haïti</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold uppercase text-brand-cyan-text">NOTE DE CADRAGE PROJET</p>
                      <p className="text-3xs text-brand-navy/60">Date : {currentProject.startDate}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <p><strong>CLIENT :</strong> {currentProject.clientName}</p>
                    <p><strong>SECTEUR :</strong> {currentProject.sector}</p>
                    <p><strong>STATUT MÉTHODOLOGIQUE :</strong> Phase {currentProject.currentPhase} / 7 (Cadrage actif)</p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-brand-navy/5">
                    <p className="font-bold uppercase text-brand-navy text-xs border-b border-brand-navy/10 pb-1">Clauses d'engagements SMART :</p>
                    <ul className="space-y-2 list-disc pl-5 text-xs text-brand-navy/85 leading-relaxed">
                      <li><strong>S - Spécifique :</strong> {currentProject.smartGoal.specific}</li>
                      <li><strong>M - Mesurable :</strong> {currentProject.smartGoal.measurable}</li>
                      <li><strong>A - Atteignable :</strong> {currentProject.smartGoal.achievable}</li>
                      <li><strong>R - Réaliste / Pertinent :</strong> {currentProject.smartGoal.relevant}</li>
                      <li><strong>T - Temporel :</strong> {currentProject.smartGoal.timeBound}</li>
                    </ul>
                  </div>

                  {/* Signatures simulation */}
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-brand-navy/5 text-center text-3xs">
                    <div className="space-y-4">
                      <p className="font-semibold text-brand-navy/65 uppercase">Pour Axis Result Consulting</p>
                      <p className="font-bold text-brand-navy">Le Comité de Coordination (Co-signé)</p>
                      {scopingSigned ? (
                        <span className="inline-block bg-brand-green/10 text-brand-green-text border border-brand-green/20 px-4 py-2 rounded-xl font-bold uppercase animate-fadeIn tracking-wider">✓ SIGNÉ NUMÉRIQUEMENT</span>
                      ) : (
                        <motion.button 
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          id="btn-sign-cadrage-axis" 
                          onClick={() => setScopingSigned(true)} 
                          className="bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy px-4 py-2 rounded-xl font-bold uppercase tracking-wider cursor-pointer border border-brand-navy hover:border-brand-cyan transition-colors"
                        >
                          Signer la note
                        </motion.button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <p className="font-semibold text-brand-navy/65 uppercase">Pour le Client ({currentProject.clientName})</p>
                      <p className="font-bold text-brand-navy">Le Représentant Légal</p>
                      <span className="inline-block bg-brand-navy/5 text-brand-navy/60 border border-brand-navy/10 px-4 py-2 rounded-xl font-semibold uppercase tracking-wider">En attente d'accord</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Matrice RACI (Phase 2) */}
          {activeSubTab === 'raci' && (
            <div className="space-y-6 animate-fadeIn text-left" id="view-raci">
              <div className="border-b border-brand-navy/5 pb-4">
                <span className="text-3xs uppercase font-mono tracking-widest text-brand-cyan-text font-bold block mb-1">Phase 2 & 3 : Attribution des responsabilités</span>
                <h2 className="font-display font-black text-2xl text-brand-navy uppercase tracking-tight">Matrice de Responsabilités (RACI)</h2>
              </div>

              <p className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans">
                Cliquez sur les cellules pour cycler les rôles et attribuer les responsabilités : <span className="font-bold text-brand-navy">R</span> (Réalise), <span className="font-bold text-brand-navy">A</span> (Approuve / Redevable), <span className="font-bold text-brand-navy">C</span> (Consulté), <span className="font-bold text-brand-navy">I</span> (Informé).
              </p>

              {/* Live RACI Grid */}
              <div className="overflow-x-auto rounded-2xl border border-brand-navy/10 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm" id="raci-matrix-table">
                  <thead className="bg-brand-navy text-white font-display text-3xs sm:text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Tâche d'Intervention</th>
                      <th className="p-4 text-center border-l border-white/10">Direction Axis</th>
                      <th className="p-4 text-center border-l border-white/10">Client ({currentProject.clientName.split(' ')[0]})</th>
                      <th className="p-4 text-center border-l border-white/10">Consultant Terrain</th>
                      <th className="p-4 text-center border-l border-white/10">Partenaire / Tiers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-navy/5 font-mono text-center">
                    {currentProject.raci.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-brand-light/50 transition-colors">
                        <td className="p-4 font-sans font-bold text-brand-navy text-left">{row.task}</td>
                        {[
                          { role: 'director' as const, val: row.director },
                          { role: 'client' as const, val: row.client },
                          { role: 'consultant' as const, val: row.consultant },
                          { role: 'partner' as const, val: row.partner }
                        ].map((cell, cIdx) => (
                          <td key={cIdx} className="p-4 border-l border-brand-navy/5">
                            <motion.button
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.85 }}
                              id={`raci-btn-${rIdx}-${cell.role}`}
                              onClick={() => handleCycleRacicCell(rIdx, cell.role)}
                              className={`h-8 w-8 rounded-lg font-bold transition-all text-xs flex items-center justify-center mx-auto cursor-pointer border ${
                                cell.val === 'A'
                                  ? 'bg-brand-navy text-white border-brand-navy font-black shadow-sm'
                                  : cell.val === 'R'
                                  ? 'bg-brand-cyan text-brand-navy border-brand-cyan font-bold shadow-2xs'
                                  : cell.val === 'C'
                                  ? 'bg-brand-green/20 text-brand-green-text border-brand-green/35'
                                  : cell.val === 'I'
                                  ? 'bg-brand-gray/20 text-brand-navy/70 border-brand-gray/30'
                                  : 'bg-brand-light text-brand-navy/30 border-brand-navy/5 hover:border-brand-cyan/40'
                              }`}
                            >
                              {cell.val || '-'}
                            </motion.button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rigueur Check Indicator (Rule enforcement) */}
              <div className="p-4 bg-brand-light rounded-2xl border-y border-r border-brand-navy/10 border-l-4 border-amber-500 space-y-2">
                <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60 flex items-center gap-1.5">
                  <ShieldAlert className="h-4 w-4 text-amber-500" />
                  Rapport de Rigueur Opérationnelle (Validation RACI) :
                </span>
                
                {raciIssues.length > 0 ? (
                  <ul className="space-y-1">
                    {raciIssues.map((issue, idx) => (
                      <li key={idx} className="text-xs text-brand-navy/85 flex items-start gap-1.5 font-semibold">
                        <span className="text-amber-500 font-bold mt-0.5">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-brand-green-text font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Félicitations : La gouvernance de votre matrice RACI respecte toutes les règles de rigueur (Un redevable décisionnel "A" unique et des exécuteurs désignés par tâche).
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Structure WBS (Phase 3) */}
          {activeSubTab === 'wbs' && (
            <div className="space-y-6 animate-fadeIn text-left" id="view-wbs">
              <div className="border-b border-brand-navy/5 pb-4">
                <span className="text-3xs uppercase font-mono tracking-widest text-brand-cyan-text font-bold block mb-1">Phase 3 : Conception de l’intervention</span>
                <h2 className="font-display font-black text-2xl text-brand-navy uppercase tracking-tight">Structure Découpée des Tâches (WBS)</h2>
              </div>

              <p className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed font-sans">
                L'organigramme technique WBS permet de répartir la mission globale en lots de travail mesurables. Voici le découpage technique calculé en fonction de la phase méthodologique :
              </p>

              {/* Visual Hierarchical Tree List */}
              <div className="space-y-4" id="wbs-hierarchical-tree">
                {/* Node Level 1: Global Project */}
                <div className="p-4 bg-brand-navy text-white rounded-2xl border-l-4 border-brand-cyan shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-2xs font-mono font-bold tracking-widest uppercase text-brand-cyan">Niveau 1 : Projet Global</span>
                    <span className="text-3xs bg-white/10 px-2.5 py-0.5 rounded-full font-mono font-bold">PROGRESSION: {currentProject.progress}%</span>
                  </div>
                  <h3 className="font-display font-black uppercase text-base mt-1 tracking-tight">{currentProject.name}</h3>
                </div>

                {/* Node Level 2: Methodology Phases representation */}
                <div className="pl-6 border-l-2 border-brand-navy/10 space-y-4">
                  {[1, 2, 3, 4, 5, 6].map((phaseNum) => {
                    const phaseTasks = currentProject.tasks.filter(t => t.phase === phaseNum);
                    if (phaseTasks.length === 0) return null;

                    const phaseObj = METHODOLOGY_PHASES.find(p => p.phaseNumber === phaseNum);
                    const isCurrent = currentProject.currentPhase === phaseNum;

                    return (
                      <div key={phaseNum} className="space-y-2 animate-fadeIn">
                        <div className={`p-3 rounded-xl border flex justify-between items-center ${
                          isCurrent ? 'bg-brand-cyan/15 border-brand-cyan' : 'bg-white border-brand-navy/5'
                        }`}>
                          <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-lg bg-brand-navy text-white font-display font-bold text-3xs flex items-center justify-center">
                              0{phaseNum}
                            </span>
                            <span className="font-display font-bold text-xs sm:text-sm text-brand-navy uppercase tracking-tight">{phaseObj?.title}</span>
                          </div>
                          <span className="text-3xs font-bold text-brand-navy/65 uppercase font-mono">Lot {phaseNum}.0</span>
                        </div>

                        {/* Node Level 3: Individual deliverables under that phase */}
                        <div className="pl-8 border-l-2 border-brand-cyan/15 space-y-2">
                          {phaseTasks.map((task) => (
                            <div key={task.id} className="p-3 bg-brand-light rounded-xl border border-brand-navy/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                              <div className="space-y-0.5">
                                <p className="font-bold text-brand-navy text-left">{task.title}</p>
                                <p className="text-brand-navy/60 text-3xs font-sans text-left">{task.description}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="bg-brand-navy/5 border border-brand-navy/5 font-mono text-4xs uppercase px-2 py-0.5 rounded-lg font-bold">
                                  {task.assignedTo}
                                </span>
                                <span className={`font-mono text-4xs uppercase px-2.5 py-0.5 rounded-full font-bold ${
                                  task.column === 'done' 
                                    ? 'bg-brand-green/10 text-brand-green-text' 
                                    : task.column === 'in_progress'
                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10'
                                    : 'bg-brand-navy/5 text-brand-navy/70'
                                }`}>
                                  {task.column}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Matrice des Risques (Phase 3) */}
          {activeSubTab === 'risks' && (
            <div className="space-y-6 animate-fadeIn text-left" id="view-risks">
              <div className="border-b border-brand-navy/5 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-3xs uppercase font-mono tracking-widest text-brand-cyan-text font-bold block mb-1">Phase 3 : Analyse des vulnérabilités</span>
                  <h2 className="font-display font-black text-2xl text-brand-navy uppercase tracking-tight">Matrice de Criticité des Risques (RAID)</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="btn-trigger-add-risk"
                  onClick={() => setShowAddRisk(!showAddRisk)}
                  className="bg-brand-navy hover:bg-brand-cyan hover:text-brand-navy text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl border border-brand-navy hover:border-brand-cyan flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Ajouter un risque
                </motion.button>
              </div>

              {showAddRisk && (
                <form onSubmit={handleAddRiskSubmit} className="bg-brand-light p-4 rounded-2xl border-l-4 border-brand-cyan border-y border-r border-brand-navy/10 grid grid-cols-1 md:grid-cols-4 gap-3 items-end animate-fadeIn" id="form-add-risk">
                  <div className="space-y-1">
                    <label htmlFor="newRiskTitle" className="text-3xs uppercase font-bold text-brand-navy/60 block">Libellé du risque *</label>
                    <input
                      type="text"
                      id="newRiskTitle"
                      required
                      value={newRiskTitle}
                      onChange={(e) => setNewRiskTitle(e.target.value)}
                      placeholder="Retard de livraison..."
                      className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs focus:outline-hidden focus:border-brand-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="newRiskProb" className="text-3xs uppercase font-bold text-brand-navy/60 block">Probabilité (1 à 3)</label>
                    <select
                      id="newRiskProb"
                      value={newRiskProb}
                      onChange={(e) => setNewRiskProb(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs cursor-pointer focus:outline-hidden"
                    >
                      <option value="1">1 : Faible</option>
                      <option value="2">2 : Moyenne</option>
                      <option value="3">3 : Forte</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="newRiskImpact" className="text-3xs uppercase font-bold text-brand-navy/60 block">Impact (1 à 3)</label>
                    <select
                      id="newRiskImpact"
                      value={newRiskImpact}
                      onChange={(e) => setNewRiskImpact(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs cursor-pointer focus:outline-hidden"
                    >
                      <option value="1">1 : Faible</option>
                      <option value="2">2 : Moyen</option>
                      <option value="3">3 : Majeur</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="space-y-1 flex-1">
                      <label htmlFor="newRiskMitigation" className="text-3xs uppercase font-bold text-brand-navy/60 block">Mitigation proposée</label>
                      <input
                        type="text"
                        id="newRiskMitigation"
                        value={newRiskMitigation}
                        onChange={(e) => setNewRiskMitigation(e.target.value)}
                        placeholder="Plan de secours..."
                        className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs focus:outline-hidden focus:border-brand-cyan"
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" 
                      id="btn-submit-new-risk" 
                      className="bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy px-4 py-2 rounded-xl border border-brand-navy hover:border-brand-cyan text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors h-10 flex items-center justify-center"
                    >
                      Ajouter
                    </motion.button>
                  </div>
                </form>
              )}

              {/* 3x3 Grid Plotting */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* 3x3 Visual Matrix */}
                <div className="space-y-3">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/65 block text-center">Matrice 3x3 de Gravité</span>
                  
                  <div className="relative">
                    {/* Y-axis label */}
                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 font-mono text-3xs font-bold uppercase tracking-wider -rotate-90 text-brand-navy/60">
                      Impact →
                    </div>
                    
                    <div className="grid grid-cols-4 gap-1.5 font-mono">
                      {/* Grid Header */}
                      <div />
                      <div className="text-center text-3xs font-bold text-brand-navy/65">Prob. 1</div>
                      <div className="text-center text-3xs font-bold text-brand-navy/65">Prob. 2</div>
                      <div className="text-center text-3xs font-bold text-brand-navy/65">Prob. 3</div>

                      {/* Row 3: Impact 3 */}
                      <div className="text-right pr-2 text-3xs font-bold text-brand-navy/65 self-center">Impact 3</div>
                      <div className="h-16 bg-amber-500/10 rounded-xl border border-amber-500/25 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 1 && r.impact === 3).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-amber-500 text-white text-3xs font-bold flex items-center justify-center animate-pulse" title={r.title}>!</span>
                        ))}
                      </div>
                      <div className="h-16 bg-red-500/10 rounded-xl border border-red-500/25 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 2 && r.impact === 3).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-red-500 text-white text-3xs font-bold flex items-center justify-center animate-pulse" title={r.title}>!</span>
                        ))}
                      </div>
                      <div className="h-16 bg-red-500/20 rounded-xl border-2 border-red-500 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 3 && r.impact === 3).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-red-600 text-white text-3xs font-bold flex items-center justify-center animate-pulse" title={r.title}>CRIT</span>
                        ))}
                      </div>

                      {/* Row 2: Impact 2 */}
                      <div className="text-right pr-2 text-3xs font-bold text-brand-navy/65 self-center">Impact 2</div>
                      <div className="h-16 bg-brand-green/10 rounded-xl border border-brand-green/20 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 1 && r.impact === 2).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-brand-green text-white text-3xs font-bold flex items-center justify-center" title={r.title}>✓</span>
                        ))}
                      </div>
                      <div className="h-16 bg-amber-500/10 rounded-xl border border-amber-500/25 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 2 && r.impact === 2).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-amber-500 text-white text-3xs font-bold flex items-center justify-center" title={r.title}>!</span>
                        ))}
                      </div>
                      <div className="h-16 bg-red-500/10 rounded-xl border border-red-500/25 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 3 && r.impact === 2).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-red-500 text-white text-3xs font-bold flex items-center justify-center animate-pulse" title={r.title}>!</span>
                        ))}
                      </div>

                      {/* Row 1: Impact 1 */}
                      <div className="text-right pr-2 text-3xs font-bold text-brand-navy/65 self-center">Impact 1</div>
                      <div className="h-16 bg-brand-green/10 rounded-xl border border-brand-green/20 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 1 && r.impact === 1).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-brand-green text-white text-3xs font-bold flex items-center justify-center" title={r.title}>✓</span>
                        ))}
                      </div>
                      <div className="h-16 bg-brand-green/10 rounded-xl border border-brand-green/20 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 2 && r.impact === 1).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-brand-green text-white text-3xs font-bold flex items-center justify-center" title={r.title}>✓</span>
                        ))}
                      </div>
                      <div className="h-16 bg-amber-500/10 rounded-xl border border-amber-500/25 flex items-center justify-center relative">
                        {currentProject.risks.filter(r => r.probability === 3 && r.impact === 1).map((r, i) => (
                          <span key={i} className="h-5 w-5 rounded-lg bg-amber-500 text-white text-3xs font-bold flex items-center justify-center" title={r.title}>!</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Register table list */}
                <div className="space-y-4">
                  <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/65 block">Registre des Risques actifs (RAID)</span>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {currentProject.risks.map((risk) => {
                      const priorityColor = risk.probability * risk.impact >= 6 
                        ? 'bg-red-500/10 text-red-600 border-red-500/20' 
                        : risk.probability * risk.impact >= 3 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                        : 'bg-brand-green/10 text-brand-green-text border-brand-green/20';

                      return (
                        <div key={risk.id} className="p-3.5 bg-brand-light border-l-4 border-brand-cyan border-y border-r border-brand-navy/5 rounded-2xl space-y-2 text-xs hover:border-brand-cyan/20 transition-all text-left">
                          <div className="flex justify-between items-start gap-3">
                            <p className="font-bold text-brand-navy leading-tight">{risk.title}</p>
                            <span className={`px-2.5 py-0.5 rounded-full font-mono text-4xs uppercase font-bold border ${priorityColor}`}>
                              SCORE : {risk.probability * risk.impact}
                            </span>
                          </div>
                          {risk.mitigation && (
                            <p className="text-brand-navy/65 italic text-2xs bg-white p-2 rounded-xl border border-brand-navy/5">
                              <strong>Mitigation :</strong> {risk.mitigation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: Kanban Board (Phase 4) */}
          {activeSubTab === 'kanban' && (
            <div className="space-y-6 animate-fadeIn text-left" id="view-kanban">
              <div className="border-b border-brand-navy/5 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <span className="text-3xs uppercase font-mono tracking-widest text-brand-cyan-text font-bold block mb-1">Phase 4 : Pilotage de la mise en œuvre</span>
                  <h2 className="font-display font-black text-2xl text-brand-navy uppercase tracking-tight">Tableau Kanban de Coordination</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="btn-trigger-add-task"
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="bg-brand-navy hover:bg-brand-cyan hover:text-brand-navy text-white text-xs font-bold uppercase tracking-wider px-4 py-3 rounded-xl border border-brand-navy hover:border-brand-cyan flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Nouvelle tâche
                </motion.button>
              </div>

              {showAddTask && (
                <motion.form 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddTaskSubmit} 
                  className="bg-brand-light p-4 rounded-2xl border-l-4 border-brand-cyan border-y border-r border-brand-navy/10 grid grid-cols-1 md:grid-cols-4 gap-3 items-end animate-fadeIn" 
                  id="form-add-task"
                >
                  <div className="space-y-1">
                    <label htmlFor="newTaskTitle" className="text-3xs uppercase font-bold text-brand-navy/60 block">Tâche d'Exécution *</label>
                    <input
                      type="text"
                      id="newTaskTitle"
                      required
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Atelier de cadrage..."
                      className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs focus:outline-hidden focus:border-brand-cyan"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="newTaskOwner" className="text-3xs uppercase font-bold text-brand-navy/60 block">Propriétaire Axis</label>
                    <select
                      id="newTaskOwner"
                      value={newTaskOwner}
                      onChange={(e) => setNewTaskOwner(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs cursor-pointer focus:outline-hidden"
                    >
                      <option value="Co-fondateur A">Co-fondateur A (Advisory)</option>
                      <option value="Co-fondateur B">Co-fondateur B (Ops)</option>
                      <option value="Co-fondateur C">Co-fondateur C (Digital)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="newTaskPriority" className="text-3xs uppercase font-bold text-brand-navy/60 block">Priorité</label>
                    <select
                      id="newTaskPriority"
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs cursor-pointer focus:outline-hidden"
                    >
                      <option value="low">Basse</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <div className="space-y-1 flex-1">
                      <label htmlFor="newTaskDesc" className="text-3xs uppercase font-bold text-brand-navy/60 block">Description succincte</label>
                      <input
                        type="text"
                        id="newTaskDesc"
                        value={newTaskDesc}
                        onChange={(e) => setNewTaskDesc(e.target.value)}
                        placeholder="Détails du livrable..."
                        className="w-full px-3 py-2 bg-white border border-brand-navy/10 rounded-xl text-xs focus:outline-hidden focus:border-brand-cyan"
                      />
                    </div>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit" 
                      id="btn-submit-new-task" 
                      className="bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy px-4 py-2 rounded-xl border border-brand-navy hover:border-brand-cyan text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors h-10 flex items-center justify-center"
                    >
                      Ajouter
                    </motion.button>
                  </div>
                </motion.form>
              )}

              {/* 4 columns layout for Kanban */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 overflow-x-auto" id="kanban-grid-cols">
                {[
                  { id: 'todo' as const, label: 'À faire', color: 'border-t-brand-navy bg-brand-light/40' },
                  { id: 'in_progress' as const, label: 'En cours', color: 'border-t-brand-cyan bg-brand-cyan/5' },
                  { id: 'review' as const, label: 'En revue / QA', color: 'border-t-amber-500 bg-amber-500/5' },
                  { id: 'done' as const, label: 'Validé & Livré', color: 'border-t-brand-green bg-brand-green/5' }
                ].map((col) => {
                  const colTasks = currentProject.tasks.filter(t => t.column === col.id);
                  return (
                    <div key={col.id} className={`p-4 rounded-2xl border-t-4 border border-brand-navy/5 flex flex-col space-y-4 min-h-[400px] ${col.color}`} id={`kanban-col-${col.id}`}>
                      <div className="flex justify-between items-center border-b border-brand-navy/5 pb-2 text-left">
                        <span className="font-display font-bold text-xs sm:text-sm text-brand-navy uppercase tracking-tight">{col.label}</span>
                        <span className="bg-brand-navy/5 font-mono text-3xs font-bold px-2 py-0.5 rounded-full">{colTasks.length}</span>
                      </div>

                      <div className="space-y-3 flex-1 overflow-y-auto max-h-[350px] pr-1">
                        {colTasks.map((task) => (
                          <motion.div 
                            layoutId={`task-card-${task.id}`}
                            key={task.id} 
                            className="bg-white p-3.5 rounded-xl border border-brand-navy/10 shadow-3xs space-y-3 hover:border-brand-cyan/25 transition-all flex flex-col justify-between text-left" 
                            id={`kanban-card-${task.id}`}
                          >
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-2">
                                <span className={`text-4xs font-mono font-bold uppercase px-1.5 py-0.5 rounded-md ${
                                  task.priority === 'high' ? 'bg-red-500/10 text-red-600' : 'bg-brand-navy/5 text-brand-navy/60'
                                }`}>
                                  {task.priority}
                                </span>
                                <span className="text-4xs text-brand-navy/40 font-mono">Lot {task.phase}.0</span>
                              </div>
                              <p className="text-xs font-bold text-brand-navy leading-tight">{task.title}</p>
                              {task.description && <p className="text-4xs text-brand-navy/60 font-sans leading-relaxed">{task.description}</p>}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-brand-navy/5 mt-1 text-3xs">
                              <span className="font-bold text-brand-navy/60 flex items-center gap-1 uppercase">
                                <User className="h-3 w-3 text-brand-cyan" />
                                {task.assignedTo.split(' ')[1] || task.assignedTo}
                              </span>

                              {/* Action controls inside iframe */}
                              <div className="flex items-center gap-1">
                                {col.id !== 'todo' && (
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    id={`kanban-backward-btn-${task.id}`}
                                    onClick={() => handleMoveTask(task.id, 'backward')}
                                    className="p-1 hover:bg-brand-navy/5 rounded-lg text-brand-navy font-bold text-xs cursor-pointer"
                                    title="Déplacer vers la gauche"
                                  >
                                    ←
                                  </motion.button>
                                )}
                                {col.id !== 'done' && (
                                  <motion.button
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    id={`kanban-forward-btn-${task.id}`}
                                    onClick={() => handleMoveTask(task.id, 'forward')}
                                    className="p-1 hover:bg-brand-navy/5 rounded-lg text-brand-cyan font-black text-xs cursor-pointer"
                                    title="Déplacer vers la droite"
                                  >
                                    →
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Persistent Footer to remind about Methodology Transfer */}
          <div className="mt-8 pt-4 border-t border-brand-navy/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-3xs sm:text-xs text-left">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />
              <span className="text-brand-navy/65 font-bold uppercase tracking-tight text-[10px]">Modèle de Gouvernance : Rigueur, Transparence, Transfert de compétences.</span>
            </div>
            <span className="text-brand-navy/40 font-mono">AXIS RESULT CONSULTING v1.0 MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
