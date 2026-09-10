/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Target, BarChart2, Laptop, Award, ShieldAlert, ArrowRight, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICE_POLES, ServicePole, ActiveTab } from '../types';

interface ServicesViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export default function ServicesView({ setActiveTab }: ServicesViewProps) {
  const [selectedPoleId, setSelectedPoleId] = useState<string | null>(null);
  
  // Diagnostic State
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);

  const getPoleIcon = (id: string) => {
    switch (id) {
      case 'advisory':
        return <BarChart2 className="h-6 w-6 text-brand-cyan" />;
      case 'project-operations':
        return <Target className="h-6 w-6 text-brand-navy" />;
      case 'digital-data':
        return <Laptop className="h-6 w-6 text-brand-green" />;
      case 'learning-development':
        return <Award className="h-6 w-6 text-brand-gray" />;
      default:
        return <BarChart2 className="h-6 w-6 text-brand-cyan" />;
    }
  };

  const getBadgeClass = (color: string) => {
    switch (color) {
      case 'cyan':
        return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/25';
      case 'navy':
        return 'bg-brand-navy/10 text-brand-navy border-brand-navy/20';
      case 'green':
        return 'bg-brand-green/10 text-brand-green-text border-brand-green/25';
      case 'gray':
        return 'bg-brand-gray/15 text-brand-navy/80 border-brand-gray/30';
      default:
        return 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/25';
    }
  };

  // Diagnostic questions
  const diagnosticQuestions = [
    {
      id: 1,
      text: "Quel est le défi opérationnel le plus urgent de votre organisation ?",
      options: [
        { key: 'advisory', label: "Clarifier notre vision stratégique et réaliser un diagnostic d'organisation" },
        { key: 'project-operations', label: "Piloter et coordonner l'exécution de nos projets dans le respect des délais" },
        { key: 'digital-data', label: "Remplacer les processus papier et centraliser nos rapports de performance" },
        { key: 'learning-development', label: "Renforcer les compétences techniques et méthodologiques de nos collaborateurs" }
      ]
    },
    {
      id: 2,
      text: "Quel outil vous manque-t-il le plus pour avancer sereinement ?",
      options: [
        { key: 'advisory', label: "Une feuille de route stratégique claire validée par notre direction" },
        { key: 'project-operations', label: "Un planning d'actions (Gantt) réaliste et un tableau de suivi des risques" },
        { key: 'digital-data', label: "Des formulaires de collecte de données et un dashboard de pilotage interactif" },
        { key: 'learning-development', label: "Des supports de formation structurés et un plan de transfert de compétences" }
      ]
    },
    {
      id: 3,
      text: "Quelle est votre plus grande cause de frustration lors des missions passées ?",
      options: [
        { key: 'advisory', label: "Des recommandations trop théoriques déconnectées de notre réalité de terrain" },
        { key: 'project-operations', label: "Un manque de rigueur de suivi et des livrables non conformes ou en retard" },
        { key: 'digital-data', label: "Des outils technologiques trop lourds que nos équipes n'adoptent pas" },
        { key: 'learning-development', label: "Une perte d'autonomie dès que les consultants externes s'en vont" }
      ]
    }
  ];

  const handleAnswerSelect = (qId: number, key: string) => {
    setAnswers({ ...answers, [qId]: key });
  };

  const calculateResult = () => {
    const counts: Record<string, number> = {
      'advisory': 0,
      'project-operations': 0,
      'digital-data': 0,
      'learning-development': 0
    };

    Object.values(answers).forEach((val) => {
      const key = val as string;
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });

    let maxKey = 'advisory';
    let maxCount = -1;
    Object.entries(counts).forEach(([key, value]) => {
      if (value > maxCount) {
        maxCount = value;
        maxKey = key;
      }
    });

    setDiagnosticResult(maxKey);
  };

  const resetDiagnostic = () => {
    setAnswers({});
    setDiagnosticResult(null);
  };

  const getRecommendedPole = () => {
    return SERVICE_POLES.find(p => p.id === diagnosticResult);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fadeIn" id="services-view-container">
      {/* Title section */}
      <div className="text-center max-w-3xl mx-auto space-y-4" id="services-header-section">
        <span className="text-brand-cyan-text font-bold text-xs tracking-widest uppercase block">Offre d'accompagnement</span>
        <h1 className="font-display font-black text-4xl text-brand-navy tracking-tight leading-tight uppercase">
          Nos Quatre Pôles de Services à Égalité de Visibilité
        </h1>
        <p className="text-brand-navy/70 text-sm sm:text-base leading-relaxed">
          Pour une structure multidisciplinaire agile, nous intervenons à tous les niveaux opérationnels des organisations (en Haïti comme à l'international, dans tous les secteurs) à travers des pôles complémentaires conçus pour agir en synergie.
        </p>
      </div>

      {/* Grid structure (4 equal weight items) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="services-grid-poles">
        {SERVICE_POLES.map((pole) => {
          const isOpen = selectedPoleId === pole.id;
          return (
            <motion.div 
              key={pole.id} 
              whileHover={{ y: -4 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden shadow-md flex flex-col justify-between ${
                isOpen ? 'border-brand-cyan ring-1 ring-brand-cyan/20' : 'border-brand-gray/15 hover:border-brand-cyan hover:shadow-lg'
              }`}
              id={`service-card-${pole.id}`}
            >
              <div className="p-8 space-y-6">
                {/* Header card info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3.5 rounded-2xl flex-shrink-0 bg-brand-navy/5">
                    {getPoleIcon(pole.id)}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-2xs font-bold uppercase tracking-wider border ${getBadgeClass(pole.badgeColor)}`}>
                    {pole.id === 'learning-development' ? 'L&D' : pole.id.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2 text-left">
                  <h2 className="font-display font-extrabold text-2xl text-brand-navy uppercase tracking-tight">{pole.title}</h2>
                  <p className="text-brand-cyan-text text-xs font-bold uppercase tracking-wider font-mono">{pole.tagline}</p>
                  <p className="text-brand-navy/70 text-sm leading-relaxed">{pole.description}</p>
                </div>

                {/* Collapsible section */}
                <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100 pt-6 border-t border-brand-navy/5' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/60 block">Livrables clés de la firme :</span>
                      <ul className="space-y-2">
                        {pole.deliverables.map((del, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2 text-xs text-brand-navy/75">
                            <CheckCircle2 className="h-4 w-4 text-brand-green flex-shrink-0 mt-0.5" />
                            <span>{del}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-navy/60 block">Outils mobilisables :</span>
                      <div className="flex flex-wrap gap-1.5">
                        {pole.tools.map((tool, tIdx) => (
                          <span key={tIdx} className="bg-brand-navy/5 text-brand-navy/80 px-2.5 py-1 rounded-lg text-2xs font-mono border border-brand-navy/5 uppercase">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action area */}
              <div className="bg-brand-light/50 px-8 py-4 border-t border-brand-navy/5 flex items-center justify-between">
                <button
                  id={`btn-toggle-details-${pole.id}`}
                  onClick={() => setSelectedPoleId(isOpen ? null : pole.id)}
                  className="text-brand-navy/80 hover:text-brand-cyan font-bold text-2xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{isOpen ? 'Masquer les détails' : 'Découvrir les livrables & outils'}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id={`btn-contact-pole-${pole.id}`}
                  onClick={() => setActiveTab('contact')}
                  className="bg-brand-navy hover:bg-brand-cyan hover:text-brand-navy text-white text-2xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl border border-brand-navy hover:border-brand-cyan transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Discuter de ce besoin</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Synergic values banner */}
      <div className="bg-brand-navy text-white rounded-[32px] border-l-4 border-brand-cyan p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl" id="synergies-banner">
        <div className="absolute inset-0 bg-radial-[at_50%_0%] from-brand-cyan/10 to-transparent pointer-events-none" />
        <div className="space-y-2 relative z-10 text-left">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl uppercase tracking-tight">Une synergie intégrée pour les PME</h3>
          <p className="text-xs sm:text-sm text-white/70 max-w-2xl leading-relaxed">
            Nos pôles ne fonctionnent pas en silos. Un diagnostic d'organisation (<span className="text-brand-cyan">Advisory</span>) déclenche souvent la modélisation opérationnelle (<span className="text-brand-cyan">Project</span>), le développement d'outils de décision (<span className="text-brand-cyan">Digital</span>) et la formation des utilisateurs (<span className="text-brand-cyan">Learning</span>).
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          id="btn-trigger-diagnostic"
          onClick={() => setShowDiagnostic(!showDiagnostic)}
          className="bg-brand-cyan text-brand-navy hover:bg-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap border border-brand-cyan relative z-10"
        >
          {showDiagnostic ? 'Fermer le diagnostic' : 'Faire un diagnostic rapide'}
          <RefreshCw className="h-4 w-4" />
        </motion.button>
      </div>

      {/* Interactive diagnostic tool */}
      <AnimatePresence>
        {showDiagnostic && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-[32px] p-6 sm:p-10 border-l-4 border-brand-cyan border-y border-r border-brand-gray/10 shadow-lg space-y-8 overflow-hidden" 
            id="interactive-diagnostic-panel"
          >
            <div className="border-b border-brand-navy/5 pb-4 flex justify-between items-start gap-4">
              <div className="text-left">
                <h3 className="font-display font-extrabold text-2xl text-brand-navy uppercase tracking-tight">Simulateur de Diagnostic de Service</h3>
                <p className="text-brand-navy/60 text-xs sm:text-sm">Identifiez en 3 questions le pôle Axis le plus adapté à vos priorités stratégiques actuelles.</p>
              </div>
              <button 
                id="btn-close-diagnostic"
                onClick={() => setShowDiagnostic(false)}
                className="text-brand-navy/60 hover:text-brand-cyan p-1 text-2xs uppercase tracking-wider font-bold"
              >
                Fermer
              </button>
            </div>

            {!diagnosticResult ? (
              <div className="space-y-6">
                {diagnosticQuestions.map((q) => (
                  <div key={q.id} className="space-y-3" id={`diagnostic-q-${q.id}`}>
                    <p className="text-xs font-bold uppercase tracking-wide text-brand-navy text-left">
                      {q.id}. {q.text}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = answers[q.id] === opt.key;
                        return (
                          <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            key={oIdx}
                            id={`diagnostic-opt-${q.id}-${oIdx}`}
                            onClick={() => handleAnswerSelect(q.id, opt.key)}
                            className={`p-4 rounded-xl text-left text-xs sm:text-sm transition-all border flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-brand-navy text-white border-brand-navy font-bold shadow-md shadow-brand-navy/10'
                                : 'bg-brand-light text-brand-navy/80 hover:bg-white hover:border-brand-cyan border-brand-gray/15'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-brand-cyan flex-shrink-0" />}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="pt-4 border-t border-brand-navy/5 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    id="btn-calculate-diagnostic"
                    disabled={Object.keys(answers).length < diagnosticQuestions.length}
                    onClick={calculateResult}
                    className="bg-brand-cyan text-brand-navy disabled:opacity-50 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-brand-cyan flex items-center gap-2 cursor-pointer shadow-sm transition-all"
                  >
                    <span>Analyser mes réponses</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 bg-brand-navy/5 rounded-2xl border border-brand-navy/5 flex flex-col md:flex-row items-center gap-6 sm:gap-8 justify-between animate-fadeIn text-left" id="diagnostic-result-panel">
                {(() => {
                  const recommended = getRecommendedPole();
                  if (!recommended) return null;
                  return (
                    <>
                      <div className="space-y-4 max-w-2xl text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-brand-green/10 text-brand-green-text text-2xs font-bold uppercase tracking-wider border border-brand-green/20">
                          Pôle recommandé pour votre organisation
                        </div>
                        <h3 className="font-display font-extrabold text-2xl text-brand-navy uppercase tracking-tight">
                          {recommended.title}
                        </h3>
                        <p className="text-brand-cyan-text text-xs font-mono uppercase tracking-wider font-bold">
                          {recommended.tagline}
                        </p>
                        <p className="text-brand-navy/80 text-xs sm:text-sm leading-relaxed">
                          {recommended.description} Nous vous conseillons de lancer l'outil interactif de ce pôle dans l'Espace de Gestion ou de formuler votre demande dans notre formulaire de contact.
                        </p>
                        <div className="pt-2">
                          <p className="text-2xs font-bold text-brand-navy/60 uppercase block mb-1">Vos livrables prioritaires :</p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-left">
                            {recommended.deliverables.slice(0, 3).map((del, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-xs text-brand-navy/70">
                                <CheckCircle2 className="h-3.5 w-3.5 text-brand-green flex-shrink-0" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 w-full md:w-auto flex-shrink-0">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          id="btn-diagnostic-go-contact"
                          onClick={() => setActiveTab('contact')}
                          className="bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy text-xs font-bold px-5 py-3.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border border-brand-navy"
                        >
                          <ArrowRight className="h-4 w-4 text-brand-cyan" />
                          Prendre contact
                        </motion.button>
                        <button
                          id="btn-diagnostic-reset"
                          onClick={resetDiagnostic}
                          className="border border-brand-gray/40 hover:border-brand-navy text-brand-navy text-xs font-bold px-5 py-3 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                        >
                          Réinitialiser le test
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
