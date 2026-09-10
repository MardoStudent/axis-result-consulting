/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Target, Eye, Award, CheckCircle2, Star, Briefcase, GraduationCap, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { CO_FOUNDERS } from '../types';

export default function AboutView() {
  const values = [
    {
      title: 'Professionnalisme & Qualité',
      desc: 'Recherche constante de l\'excellence dans nos livrables. Nous visons à produire des analyses approfondies et des solutions prêtes à l\'emploi.',
      icon: Award,
      color: 'text-brand-cyan'
    },
    {
      title: 'Confidentialité absolue',
      desc: 'La protection des données internes et stratégiques de nos clients est garantie par des protocoles stricts de sécurité de l\'information.',
      icon: Shield,
      color: 'text-brand-navy'
    },
    {
      title: 'Transparence & Clarté',
      desc: 'Communication continue et honnête sur l\'état d\'avancement de la mission, l\'utilisation des ressources et les alertes de risques.',
      icon: CheckCircle2,
      color: 'text-brand-green'
    },
    {
      title: 'Respect des Engagements',
      desc: 'Livrer ce qui a été convenu, dans les délais impartis et selon le budget validé. Nous basons notre réputation sur cette fiabilité.',
      icon: Target,
      color: 'text-brand-cyan'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20 animate-fadeIn" id="about-view-container">
      {/* Hero Headline */}
      <div className="text-center max-w-3xl mx-auto space-y-4" id="about-hero-section">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-navy/5 text-brand-navy text-xs font-semibold uppercase tracking-wider border border-brand-navy/10 shadow-xs"
        >
          <Star className="h-3.5 w-3.5 text-brand-cyan fill-brand-cyan" />
          Rigueur & Orientation Résultats
        </motion.div>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-brand-navy tracking-tight leading-tight uppercase">
          Bâtir la performance par une démarche rigoureuse
        </h1>
        <p className="text-sm sm:text-base text-brand-navy/70 leading-relaxed">
          Axis Result Consulting est une firme de services professionnels multidisciplinaires basée à Port-au-Prince. Nous accompagnons nos partenaires de l'expression du besoin jusqu'à la pérennisation des livrables.
        </p>
      </div>

      {/* Pourquoi Axis — la conviction fondatrice */}
      <section className="max-w-4xl mx-auto space-y-6" id="about-why" aria-labelledby="about-why-heading">
        <div className="text-center space-y-2">
          <span className="text-brand-cyan-text font-bold text-xs tracking-widest uppercase block">Notre raison d'être</span>
          <h2 id="about-why-heading" className="font-display font-extrabold text-3xl text-brand-navy uppercase tracking-tight">Pourquoi Axis existe</h2>
        </div>

        <div className="bg-white rounded-3xl border-l-4 border-brand-cyan border-y border-r border-brand-gray/15 p-8 sm:p-10 shadow-xs space-y-5 text-left">
          <p className="text-sm sm:text-base text-brand-navy/80 leading-relaxed">
            Le monde évolue à grande vitesse vers le numérique, et beaucoup d'entreprises peinent à suivre le rythme. Axis est né d'un constat simple : trop d'organisations haïtiennes (PME, institutions, initiatives citoyennes) ont des idées justes mais butent, faute de structure et d'outils adaptés au terrain réel. Pas le terrain des manuels : celui des coupures de courant, des zones sans réseau, des équipes à former.
          </p>
          <p className="text-sm sm:text-base text-brand-navy/80 leading-relaxed">
            Nous avons créé Axis pour apporter une rigueur de niveau international qui tient debout dans ces conditions, et pour transférer les compétences afin que les solutions restent quand nous partons.
          </p>
          <p className="text-base sm:text-lg text-brand-navy font-bold leading-relaxed border-l-4 border-brand-cyan pl-4 italic">
            Ce qui nous motive : l'autonomie de nos clients, jamais leur dépendance. C'est pourquoi nous travaillons corps et âme, pour la transformation numérique comme pour le développement des communautés.
          </p>
        </div>
      </section>

      {/* Mission & Vision Bento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="mission-vision-bento">
        {/* Mission Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white p-8 sm:p-10 rounded-3xl border-l-4 border-brand-cyan border-y border-r border-brand-gray/10 shadow-xs relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-cyan/5 blur-2xl transition-all duration-350 group-hover:scale-15 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-cyan/10 rounded-2xl text-brand-cyan flex-shrink-0">
              <Target className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl text-brand-navy uppercase tracking-tight">Notre Mission</h2>
              <p className="text-brand-navy/70 leading-relaxed text-xs sm:text-sm">
                Concevoir, planifier et mettre en œuvre des solutions organisationnelles et numériques concrètes pour accompagner nos clients dans l'amélioration de leur fonctionnement, la réussite de leurs projets et le développement de leurs compétences clés.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vision Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="bg-white p-8 sm:p-10 rounded-3xl border-l-4 border-brand-green border-y border-r border-brand-gray/10 shadow-xs relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 h-32 w-32 bg-brand-green/5 blur-2xl transition-all duration-350 group-hover:scale-15 pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-green/10 rounded-2xl text-brand-green flex-shrink-0">
              <Eye className="h-6 w-6" />
            </div>
            <div className="space-y-3">
              <h2 className="font-display font-bold text-xl text-brand-navy uppercase tracking-tight">Notre Vision</h2>
              <p className="text-brand-navy/70 leading-relaxed text-xs sm:text-sm">
                Devenir la référence en Haïti pour la rigueur d'exécution opérationnelle et la qualité méthodologique des livrables. Nous croyons en la <span className="font-bold text-brand-navy border-b border-brand-cyan/30">progressivité</span> : une structure légère et adaptative qui se fortifie en fonction de la valeur concrète apportée sur le terrain.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Core Values Section */}
      <div className="space-y-12" id="values-section">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-display font-extrabold text-3xl text-brand-navy uppercase tracking-tight">Nos Principes Directeurs</h2>
          <p className="text-brand-navy/60 text-xs sm:text-sm">
            Ces quatre valeurs cardinales guident chaque décision opérationnelle et l'ensemble de nos relations clients.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div 
                key={idx} 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="bg-white p-6 rounded-2xl border border-brand-gray/15 shadow-xs flex flex-col justify-between hover:border-brand-cyan hover:shadow-md transition-shadow duration-300" 
                id={`value-card-${idx}`}
              >
                <div className="space-y-4">
                  <div className="p-3 bg-brand-navy/5 rounded-xl w-fit">
                    <Icon className={`h-5 w-5 ${val.color}`} />
                  </div>
                  <h3 className="font-display font-bold text-base text-brand-navy uppercase tracking-tight">{val.title}</h3>
                  <p className="text-xs text-brand-navy/65 leading-relaxed">{val.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Co-founders Section */}
      <div className="bg-brand-navy text-white rounded-[32px] border-l-4 border-brand-cyan p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-xl" id="founders-section">
        {/* Abstract design elements to elevate visual quality */}
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-brand-cyan font-bold text-xs tracking-widest uppercase block">Les femmes et hommes derrière Axis</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-tight">L'Équipe</h2>
            <p className="text-white/70 text-xs sm:text-sm">
              Les visionnaires qui portent Axis et donnent le cap : une direction qui donne le ton, un garant du cadre méthodologique et une expertise marque, appuyés par un spécialiste externe des marchés internationaux. Derrière eux, un réseau mobilisé sur mesure exécute et accompagne sur le terrain.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {CO_FOUNDERS.map((founder) => (
              <motion.div 
                key={founder.id} 
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col justify-between space-y-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300" 
                id={`founder-card-${founder.id}`}
              >
                <div className="space-y-4">
                  {/* Elegant Initials badge */}
                  <div className="h-12 w-12 rounded-2xl bg-brand-cyan text-brand-navy font-display font-extrabold text-lg flex items-center justify-center shadow-xs">
                    {founder.initials}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white uppercase tracking-tight">{founder.name}</h3>
                    <p className="text-2xs text-brand-cyan font-mono uppercase tracking-widest mt-1 font-semibold">{founder.role}</p>
                  </div>
                  <p className="text-xs text-white/75 leading-relaxed italic">
                    "{founder.bio}"
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-white/10">
                  <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider block">Spécialités clés :</span>
                  <div className="flex flex-wrap gap-1.5">
                    {founder.specialties.map((spec, sIdx) => (
                      <span key={sIdx} className="bg-white/10 text-brand-cyan px-2.5 py-1 rounded-lg text-[9px] font-mono uppercase border border-white/5">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white/5 p-6 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center gap-5" id="governance-framework-info">
            <div className="h-14 w-14 rounded-2xl bg-brand-cyan text-brand-navy font-display font-extrabold text-base flex items-center justify-center flex-shrink-0 shadow-xs">
              MJC
            </div>
            <div className="space-y-1 text-left">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                <h3 className="font-display font-bold text-base text-white uppercase tracking-tight">Marc Johnson Charles</h3>
                <span className="text-2xs text-brand-cyan font-mono uppercase tracking-widest font-semibold">Spécialiste externe</span>
              </div>
              <p className="text-xs text-white/85 leading-relaxed max-w-xl">
                Fait le pont vers les marchés internationaux pour ancrer le positionnement d'Axis au-delà d'Haïti, et veiller à la cohérence de nos engagements d'excellence.
              </p>
            </div>
          </div>

          {/* Réseau d'exécution — la capacité qui s'étoffe à la demande */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sm:p-8 space-y-5" id="delivery-network">
            <div className="space-y-1 text-left">
              <span className="text-brand-cyan text-2xs font-mono font-bold uppercase tracking-widest block">Une capacité qui s'étoffe à la demande</span>
              <h3 className="font-display font-bold text-xl text-white uppercase tracking-tight">Un réseau mobilisé sur mesure</h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-2xl pt-1">
                Les visionnaires donnent le cap. Pour le travail et l'accompagnement sur le terrain, Axis mobilise un réseau constitué au besoin de chaque mission :
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: GraduationCap, label: 'Masterants', desc: 'Analyse, recherche et production, au plus près de la donnée.' },
                { icon: Users, label: 'Consultants', desc: 'Pilotage et exécution des missions sur le terrain.' },
                { icon: Briefcase, label: 'Spécialistes métiers', desc: 'Expertises pointues mobilisées selon le besoin.' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-white/5 rounded-xl border border-white/10 p-4 space-y-2 text-left">
                    <div className="p-2 bg-brand-cyan/20 rounded-lg text-brand-cyan w-fit">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h4 className="font-display font-bold text-sm text-white uppercase tracking-tight">{item.label}</h4>
                    <p className="text-3xs text-white/65 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
