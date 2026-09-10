/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronRight, CheckCircle2, ListFilter, ClipboardCheck, ArrowUpRight, Award, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import { METHODOLOGY_PHASES, ActiveTab, MethodologyPhase } from '../types';

interface MethodologyViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function MethodologyView({ setActiveTab }: MethodologyViewProps) {
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);

  const activePhase: MethodologyPhase = METHODOLOGY_PHASES[activePhaseIndex];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fadeIn" id="methodology-view-container">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4" id="methodology-header">
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-cyan-text font-bold text-xs tracking-widest uppercase block"
        >
          Méthodologie en 7 phases
        </motion.span>
        <h1 className="font-display font-black text-4xl text-brand-navy tracking-tight leading-tight uppercase">
          Notre Processus d’Intervention Axé sur les Résultats
        </h1>
        <p className="text-brand-navy/70 text-sm sm:text-base leading-relaxed">
          Le succès d'une mission ne s'improvise pas. Nous appliquons un cadre rigoureux de 7 jalons méthodologiques validés, de l'expression de besoin initiale jusqu'au suivi d'impact à 90 jours.
        </p>
      </div>

      {/* Horizontal Step Timeline Selector for Desktop, Vertical for Mobile */}
      <div className="relative border border-brand-gray/15 bg-white p-6 rounded-3xl shadow-md" id="methodology-timeline-selector">
        <div className="absolute inset-x-12 top-1/2 -translate-y-1/2 h-0.5 bg-brand-navy/5 hidden lg:block" />
        
        {/* Step indicator buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
          {METHODOLOGY_PHASES.map((phase, idx) => {
            const isActive = activePhaseIndex === idx;
            const isCompleted = idx < activePhaseIndex;
            return (
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                key={phase.phaseNumber}
                id={`timeline-step-btn-${phase.phaseNumber}`}
                onClick={() => setActivePhaseIndex(idx)}
                className={`p-4 rounded-2xl text-center flex flex-col items-center gap-2 transition-all duration-300 border cursor-pointer relative ${
                  isActive
                    ? 'bg-brand-navy text-white border-brand-navy font-bold shadow-md shadow-brand-navy/10'
                    : isCompleted
                    ? 'bg-brand-green/10 text-brand-navy border-brand-green/20 hover:bg-brand-navy/5'
                    : 'bg-brand-light text-brand-navy/70 hover:bg-white hover:border-brand-cyan border-brand-gray/15'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeMethodologyOutline"
                    className="absolute inset-0 border-2 border-brand-cyan rounded-2xl pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <div className={`h-8 w-8 rounded-xl font-display font-black text-xs flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-brand-cyan text-brand-navy'
                    : isCompleted
                    ? 'bg-brand-green text-white font-bold'
                    : 'bg-brand-navy/5 text-brand-navy'
                }`}>
                  {phase.phaseNumber}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-black uppercase tracking-wider block leading-none">Phase {phase.phaseNumber}</span>
                  <span className="text-[9px] text-brand-navy/60 font-mono mt-1 max-w-[110px] truncate block uppercase font-medium">
                    {phase.title}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Focused Phase Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="focused-phase-details">
        {/* Left column - main content */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border-l-4 border-brand-cyan border-y border-r border-brand-gray/15 p-8 flex flex-col justify-between space-y-6 shadow-md text-left" id="phase-left-info">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 bg-brand-cyan/15 text-brand-navy font-display font-extrabold rounded-xl flex items-center justify-center text-lg">
                0{activePhase.phaseNumber}
              </span>
              <div>
                <h2 className="font-display font-extrabold text-2xl text-brand-navy uppercase tracking-tight">{activePhase.title}</h2>
                <p className="text-[9px] uppercase font-mono tracking-widest text-brand-cyan-text font-bold">Axis Result Consulting Execution Framework</p>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-brand-navy/65 tracking-wider block">Description de la démarche :</span>
              <p className="text-xs sm:text-sm text-brand-navy/85 leading-relaxed">
                {activePhase.description}
              </p>
            </div>

            <div className="p-4 bg-brand-light rounded-xl border-l-4 border-brand-cyan space-y-1">
              <span className="text-[10px] uppercase font-bold text-brand-navy/65 tracking-wider block">Objectif de rigueur :</span>
              <p className="text-xs text-brand-navy/85 font-semibold leading-relaxed italic">
                "{activePhase.objective}"
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-navy/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-brand-cyan" />
              <span className="text-2xs text-brand-navy/60 font-mono">Phase {activePhase.phaseNumber}/7 du cycle</span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              id="btn-methodology-contact"
              onClick={() => setActiveTab('contact')}
              className="w-full sm:w-auto bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy text-2xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl border border-brand-navy hover:border-brand-cyan transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Discuter de votre projet</span>
              <ArrowUpRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Right column - Input/Outputs and Tools */}
        <div className="lg:col-span-5 flex flex-col gap-6" id="phase-right-info">
          {/* Inputs & Outputs panel */}
          <div className="bg-white rounded-3xl border border-brand-gray/15 p-6 space-y-4 flex-1 shadow-md text-left">
            <h3 className="font-display font-bold text-sm text-brand-navy uppercase tracking-tight border-b border-brand-navy/5 pb-2 flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-brand-cyan" />
              Garanties de livrables
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-navy/60 block">1. Intrants requis (Du client ou diagnostic) :</span>
                <p className="text-xs text-brand-navy/80 bg-brand-light p-3 rounded-xl border border-brand-navy/5 font-mono">
                  {activePhase.inputRequired}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-brand-navy/60 block">2. Livrables finaux formalisés :</span>
                <p className="text-xs text-brand-navy/90 bg-brand-green/5 p-3 rounded-xl border border-brand-green/10 font-semibold uppercase text-brand-green">
                  {activePhase.outputLivable}
                </p>
              </div>
            </div>
          </div>

          {/* Tools panel */}
          <div className="bg-brand-navy text-white rounded-[32px] border-l-4 border-brand-cyan p-6 space-y-4 shadow-xl relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 h-20 w-20 bg-brand-cyan/10 rounded-full blur-xl pointer-events-none" />
            <h3 className="font-display font-bold text-sm border-b border-white/10 pb-2 flex items-center gap-2 text-white uppercase tracking-tight">
              <ListFilter className="h-4 w-4 text-brand-cyan" />
              Outils mobilisables pour la phase {activePhase.phaseNumber}
            </h3>

            <div className="space-y-3">
              {activePhase.tools.map((tool, index) => (
                <motion.div 
                  whileHover={{ x: 3 }}
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-200" 
                  id={`method-tool-item-${index}`}
                >
                  <span className="h-6 w-6 rounded-lg bg-brand-cyan text-brand-navy font-display font-extrabold text-[10px] flex items-center justify-center">
                    T{index + 1}
                  </span>
                  <span className="text-xs text-white/90 font-medium">
                    {tool}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Methodology rigour assurance block */}
      <div className="bg-white border border-brand-gray/15 p-8 rounded-3xl flex flex-col lg:flex-row items-center gap-8 shadow-md" id="methodology-footer-assurance">
        <div className="h-16 w-16 bg-brand-green/10 rounded-2xl flex items-center justify-center text-brand-green flex-shrink-0 animate-pulse">
          <Award className="h-8 w-8" />
        </div>
        <div className="space-y-2 flex-1 text-left">
          <h3 className="font-display font-bold text-lg text-brand-navy uppercase tracking-tight">La rigueur au service du transfert de compétences</h3>
          <p className="text-xs sm:text-sm text-brand-navy/70 leading-relaxed">
            Chaque livrable est codifié et documenté avec soin. Notre objectif final, validé en Phase 6 (Clôture) et évalué en Phase 7 (Suivi), est de rendre les équipes des PME totalement autonomes sur les solutions organisationnelles et numériques délivrées.
          </p>
        </div>
        <div className="flex flex-row gap-2 w-full lg:w-auto justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="btn-nav-methodology-contact"
            onClick={() => setActiveTab('contact')}
            className="w-full lg:w-auto bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy text-2xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl border border-brand-navy hover:border-brand-cyan transition-all cursor-pointer whitespace-nowrap"
          >
            Prendre contact
          </motion.button>
        </div>
      </div>
    </div>
  );
}
