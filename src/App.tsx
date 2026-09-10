/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowRight, BarChart2, Laptop, Target, Award, CheckCircle2, 
  ChevronRight, Users, Shield, Clock, Activity, HelpCircle, Send, Star, Globe
} from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import Navigation from './components/Navigation';
import AboutView from './components/AboutView';
import ServicesView from './components/ServicesView';
import MethodologyView from './components/MethodologyView';
import ContactView from './components/ContactView';
import DashboardView from './components/DashboardView';
import ReferencesSection from './components/ReferencesSection';
import { ActiveTab, SERVICE_POLES } from './types';

export default function App() {
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [direction, setDirection] = useState(0);

  const tabOrder: ActiveTab[] = ['home', 'about', 'services', 'methodology', 'contact', 'dashboard'];

  const setActiveTab = (tab: ActiveTab) => {
    const currentIndex = tabOrder.indexOf(activeTab);
    const nextIndex = tabOrder.indexOf(tab);
    if (currentIndex !== -1 && nextIndex !== -1) {
      setDirection(nextIndex > currentIndex ? 1 : -1);
    }
    setActiveTabState(tab);
  };

  // Animation variants for view transitions with a progressive horizontal slide
  const slideVariants: Variants = {
    hidden: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 30 : dir < 0 ? -30 : 0,
      y: 0,
    }),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        x: { type: 'spring', stiffness: 350, damping: 32 },
        opacity: { duration: 0.35 }
      }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -30 : dir < 0 ? 30 : 0,
      y: 0,
      transition: {
        x: { duration: 0.25, ease: 'easeIn' },
        opacity: { duration: 0.25 }
      }
    })
  };

  const getPoleIcon = (id: string) => {
    switch (id) {
      case 'advisory':
        return <BarChart2 className="h-5 w-5 text-brand-cyan" />;
      case 'project-operations':
        return <Target className="h-5 w-5 text-brand-navy" />;
      case 'digital-data':
        return <Laptop className="h-5 w-5 text-brand-green" />;
      case 'learning-development':
        return <Award className="h-5 w-5 text-brand-gray" />;
      default:
        return <BarChart2 className="h-5 w-5 text-brand-cyan" />;
    }
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeView();
      case 'about':
        return <AboutView />;
      case 'services':
        return <ServicesView setActiveTab={setActiveTab} />;
      case 'methodology':
        return <MethodologyView setActiveTab={setActiveTab} />;
      case 'contact':
        return <ContactView />;
      case 'dashboard':
        return <DashboardView />;
      default:
        return renderHomeView();
    }
  };

  // Home Page rendering
  const renderHomeView = () => {
    return (
      <div className="space-y-20 py-12" id="home-view-container">
        {/* HERO SECTION - Focusing on PMEs first, then other stakeholders */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8" id="hero-section">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider border border-brand-navy/10 shadow-xs"
          >
            <Star className="h-3.5 w-3.5 text-brand-cyan fill-brand-cyan" />
            Firme multidisciplinaire d'accompagnement
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 150, damping: 15 }}
              className="font-display font-black text-4xl sm:text-6xl text-brand-navy tracking-tight leading-none uppercase"
            >
              La Firme qui Accompagne vos Idées Jusqu’aux <span className="text-brand-cyan-text relative inline-block">Résultats</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150, damping: 15 }}
              className="text-sm sm:text-lg text-brand-navy/70 max-w-2xl mx-auto leading-relaxed"
            >
              Nous accompagnons <span className="font-bold text-brand-navy border-b-2 border-brand-cyan">PME, Institutions, ONG et Porteurs de projets</span>, dans tous les secteurs, pour structurer leur croissance, piloter leurs projets, digitaliser leurs opérations et former leurs équipes.
            </motion.p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4" id="hero-cta-buttons">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              id="hero-btn-cadrage"
              onClick={() => setActiveTab('contact')}
              className="w-full sm:w-auto bg-brand-cyan text-brand-navy hover:bg-brand-navy hover:text-white border border-brand-cyan hover:border-brand-navy px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-brand-cyan/20"
            >
              <span>Lancer un diagnostic préliminaire</span>
              <ArrowRight className="h-4 w-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              id="hero-btn-simulation"
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto bg-white border border-brand-gray/40 hover:border-brand-navy text-brand-navy px-8 py-4 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Simuler un projet</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          {/* Positionnement : ancrage local, ouverture internationale et multisectorielle */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-2xs text-brand-navy/65 uppercase tracking-wider font-bold" id="hero-positioning">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-brand-cyan-text" />
              Ancrés en Haïti
            </span>
            <span className="text-brand-navy/25" aria-hidden="true">•</span>
            <span>Ouverts à l'international</span>
            <span className="text-brand-navy/25" aria-hidden="true">•</span>
            <span>Tous secteurs d'activité</span>
          </div>

        </section>

        {/* PREUVE : réalisations réelles, placées haut — la preuve vend avant le process */}
        <ReferencesSection />

        {/* 4 POLES AT EQUAL WEIGHT OVERVIEW GRID WITH THEMATIC CORRESPONDING DESIGN STYLES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12" id="home-poles-section">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl text-brand-navy uppercase tracking-tight">Nos Quatre Domaines d’Offres</h2>
            <p className="text-brand-navy/60 text-xs sm:text-sm">
              Présentés à égalité de visibilité pour vous offrir une panoplie complète et synergique de services opérationnels.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="home-poles-grid">
            {SERVICE_POLES.map((pole, index) => {
              // Custom geometric themes for each card mapping the design HTML example:
              let cardStyle = "bg-white border border-brand-gray/20 hover:border-brand-cyan text-brand-navy shadow-xs";
              let badgeStyle = "text-brand-gray-text";
              let btnStyle = "text-brand-navy hover:text-brand-cyan-text border-brand-navy/10";
              let iconBg = "bg-brand-navy/5";
              let iconColor = "text-brand-navy";

              if (index === 0) { // Advisory -> bg-[#081A2E] text-white
                cardStyle = "bg-brand-navy text-white border-none shadow-xl shadow-brand-navy/10";
                badgeStyle = "text-brand-gray";
                btnStyle = "text-brand-cyan hover:text-white border-white/10";
                iconBg = "bg-white/10";
                iconColor = "text-brand-cyan";
              } else if (index === 3) { // Learning -> bg-[#2ED573]/10 border border-[#2ED573]/30
                cardStyle = "bg-brand-green/10 border border-brand-green/25 text-brand-navy shadow-xs";
                badgeStyle = "text-brand-green-text font-bold";
                btnStyle = "text-brand-navy hover:text-brand-green-text border-brand-green/20";
                iconBg = "bg-brand-green/20";
                iconColor = "text-brand-green";
              }

              return (
                <motion.div 
                  key={pole.id} 
                  whileHover={{ scale: 1.03, y: -6 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className={`p-6 rounded-3xl flex flex-col justify-between group cursor-pointer ${cardStyle}`}
                  id={`home-pole-card-${pole.id}`}
                  onClick={() => setActiveTab('services')}
                >
                  <div className="space-y-4">
                    <div className={`p-3 rounded-2xl w-fit ${iconBg}`}>
                      {index === 0 ? <BarChart2 className="h-5 w-5 text-brand-cyan" /> :
                       index === 1 ? <Target className="h-5 w-5 text-brand-navy" /> :
                       index === 2 ? <Laptop className="h-5 w-5 text-brand-navy" /> :
                       <Award className="h-5 w-5 text-brand-green" />}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg leading-tight uppercase tracking-tight">{pole.title}</h3>
                      <p className={`text-3xs font-mono uppercase tracking-widest mt-1 font-bold ${badgeStyle}`}>
                        {pole.id === 'learning-development' ? '04 / LEARNING' : 
                         pole.id === 'digital-data' ? '03 / DIGITAL' :
                         pole.id === 'project-operations' ? '02 / OPS' : '01 / ADVISORY'}
                      </p>
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">
                      {pole.description.substring(0, 110)}...
                    </p>
                  </div>

                  <button
                    id={`home-pole-btn-${pole.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveTab('services');
                    }}
                    className={`mt-6 text-2xs font-bold uppercase tracking-wider flex items-center justify-between border-t pt-4 cursor-pointer w-full ${btnStyle}`}
                  >
                    <span>Découvrir les livrables</span>
                    <div className="w-6 h-6 border border-current rounded-full flex items-center justify-center text-xs font-bold font-mono transition-transform group-hover:rotate-90">
                      +
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CORE METHODOLOGY QUICK MAP */}
        <section className="bg-brand-navy text-white rounded-[32px] border-l-4 border-brand-cyan py-12 px-6 sm:px-12 lg:px-16 max-w-7xl mx-auto relative overflow-hidden shadow-xl" id="home-methodology-promo">
          <div className="absolute top-0 right-0 h-48 w-48 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-brand-cyan font-bold text-xs tracking-widest uppercase block">La rigueur méthodologique</span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl leading-tight uppercase">
                Le Cycle de Vie de nos Missions en 7 Phases
              </h2>
              <p className="text-xs sm:text-sm text-white/70 max-w-xl leading-relaxed">
                Notre approche n'est pas uniquement consultative. Nous intervenons depuis le cadrage de vos objectifs SMART, à l'exécution de plans opérationnels précis (Kanban, RACI), jusqu'au suivi d'impact à 90 jours pour garantir le transfert réel de compétences.
              </p>
              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  id="home-btn-methodology"
                  onClick={() => setActiveTab('methodology')}
                  className="bg-brand-cyan text-brand-navy hover:bg-white text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-brand-cyan"
                >
                  Consulter la méthodologie
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </div>
            </div>

            {/* Quick interactive phase highlights */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4" id="home-methodology-preview-panel">
              <span className="text-3xs uppercase font-bold text-brand-cyan tracking-wider block">Garanties de collaboration :</span>
              <div className="space-y-3">
                {[
                  { phase: 'Phase 1', title: 'Qualification & Faisabilité', desc: 'S\'assurer de l\'opportunité réelle avant tout engagement.' },
                  { phase: 'Phase 2', title: 'Cadrage SMART & Note co-signée', desc: 'Figer le périmètre exact des responsabilités (RACI).' },
                  { phase: 'Phase 6', title: 'Contrôle Qualité & Clôture', desc: 'Valider rigoureusement les conformités métiers.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start text-xs border-b border-white/5 pb-2 last:border-b-0 last:pb-0">
                    <CheckCircle2 className="h-4.5 w-4.5 text-brand-cyan flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white text-xs">{item.phase} : {item.title}</p>
                      <p className="text-white/60 text-3xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS & PROGRESSIVE DEVELOPMENT PRINCIPLE */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8" id="home-values-assurance">
          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="p-6 bg-white rounded-3xl border-l-4 border-brand-cyan border-y border-r border-brand-gray/10 shadow-xs space-y-3"
          >
            <span className="font-display text-2xl font-black text-brand-navy uppercase block tracking-tight">Structure Légère</span>
            <p className="text-brand-cyan-text text-xs font-mono font-bold uppercase tracking-wider">01 / PROGRESSIVITÉ</p>
            <p className="text-xs text-brand-navy/65 leading-relaxed">
              Une organisation adaptative et flexible qui s'étoffe au rythme réel et pragmatique des missions validées.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="p-6 bg-white rounded-3xl border-l-4 border-brand-navy border-y border-r border-brand-gray/10 shadow-xs space-y-3"
          >
            <span className="font-display text-2xl font-black text-brand-navy uppercase block tracking-tight">Confidentialité</span>
            <p className="text-brand-navy/65 text-xs font-mono font-bold uppercase tracking-wider">02 / PROTECTION DES DONNÉES</p>
            <p className="text-xs text-brand-navy/65 leading-relaxed">
              Chaque audit et cartographie de données fait l'objet d'accords d'intégrité et de discrétion absolue.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03, y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="p-6 bg-white rounded-3xl border-l-4 border-brand-green border-y border-r border-brand-gray/10 shadow-xs space-y-3"
          >
            <span className="font-display text-2xl font-black text-brand-navy uppercase block tracking-tight">Multi-Secteur</span>
            <p className="text-brand-green-text text-xs font-mono font-bold uppercase tracking-wider">03 / EXPERTISE INTÉGRÉE</p>
            <p className="text-xs text-brand-navy/65 leading-relaxed">
              Intervention éprouvée dans la manufacture, la distribution commerciale, la logistique et les institutions.
            </p>
          </motion.div>
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans text-brand-navy antialiased selection:bg-brand-cyan/20">
      {/* Navigation Header */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Core Presentation Stage & Workspace */}
      <main className="flex-grow overflow-x-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            id={`view-stage-${activeTab}`}
            custom={direction}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={slideVariants}
            className="w-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Standard professional footer - displayed on presentation tabs only */}
      {activeTab !== 'dashboard' && (
        <footer className="bg-brand-navy text-white border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8" id="corporate-footer">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center text-brand-cyan">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="4" y1="20" x2="20" y2="4" />
                    <polyline points="14 4 20 4 20 10" />
                    <line x1="4" y1="4" x2="10" y2="10" />
                  </svg>
                </div>
                <span className="font-display font-bold tracking-widest text-white">AXIS RESULT</span>
              </div>
              <p className="text-2xs text-white/50 leading-relaxed max-w-xs">
                Firme multidisciplinaire de services professionnels orientée résultats. Accompagnement rigoureux des entreprises privées et institutions.
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-display font-bold text-xs uppercase tracking-wider text-brand-cyan">Nos Pôles</p>
              <ul className="space-y-1.5 text-2xs text-white/60">
                <li><button id="footer-link-advisory" onClick={() => setActiveTab('services')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Axis Advisory</button></li>
                <li><button id="footer-link-project" onClick={() => setActiveTab('services')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Axis Project & Operations</button></li>
                <li><button id="footer-link-digital" onClick={() => setActiveTab('services')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Axis Digital & Data</button></li>
                <li><button id="footer-link-learning" onClick={() => setActiveTab('services')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Axis Learning & Development</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-display font-bold text-xs uppercase tracking-wider text-brand-cyan">L'Approche</p>
              <ul className="space-y-1.5 text-2xs text-white/60">
                <li><button id="footer-link-methodology" onClick={() => setActiveTab('methodology')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Les 7 Phases</button></li>
                <li><button id="footer-link-dashboard" onClick={() => setActiveTab('dashboard')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Simulateur de Pilotage</button></li>
                <li><button id="footer-link-contact" onClick={() => setActiveTab('contact')} className="hover:text-brand-cyan cursor-pointer text-left inline-block py-1.5">Formulaire de Cadrage</button></li>
              </ul>
            </div>

            <div className="space-y-3">
              <p className="font-display font-bold text-xs uppercase tracking-wider text-brand-cyan">Port-au-Prince</p>
              <p className="text-2xs text-white/65 leading-relaxed">
                B99, Morne Ébo, Canapé-Vert,<br />
                Port-au-Prince, Haïti<br />
                contact@axisresult.com
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-3xs text-white/60 gap-4" id="footer-copyright-row">
            <p>© 2026 Axis Result Consulting. Tous droits réservés.</p>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">Mentions légales</span>
              <span className="hover:text-white transition-colors cursor-pointer">Confidentialité</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
