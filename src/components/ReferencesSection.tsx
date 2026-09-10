/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface Stat {
  value: string;
  label: string;
}

interface Reference {
  segment: string;
  /** Description anonymisée du client — jamais le nom réel en public
   *  (sauf initiative publique comme VEL). */
  title: string;
  work: string;
  /** Ligne de résultat / jalon honnête (mission en cours ou réalisée). */
  result: string;
  status: 'en cours' | 'réalisé';
  /** Chiffres forts, mis en avant (surtout pour VEL). */
  stats?: Stat[];
  /** Partenaires nommés (initiative publique uniquement). */
  partners?: string;
  /** true = client confidentiel → mention « référence sur demande ». */
  confidential: boolean;
  color: 'cyan' | 'navy' | 'green';
}

// Cas réels d'Axis. Les clients privés restent anonymes ; seule l'initiative
// communautaire publique (Vacances En Livre) est nommée, avec ses partenaires.
const REFERENCES: Reference[] = [
  {
    segment: 'PME · Distribution',
    title: 'Une PME de distribution en croissance',
    work: "Structuration de l'entreprise et conception d'un Système de Pilotage des Opérations (Digital Operations System) sur mesure, pour ancrer durablement sa transformation numérique.",
    result: 'Diagnostic réalisé · structure opérationnelle définie · système en phase de test',
    status: 'en cours',
    confidential: true,
    color: 'cyan'
  },
  {
    segment: 'ONG · Communication & développement',
    title: 'Une organisation de développement',
    work: "Formation aux approches RCCE / C4D — communication des risques et engagement communautaire, au standard des acteurs humanitaires.",
    result: 'Programme de formation en cours',
    status: 'en cours',
    stats: [{ value: '75', label: 'bénéficiaires formés' }],
    confidential: true,
    color: 'navy'
  },
  {
    segment: 'Porteur de projet',
    title: 'Un entrepreneur en lancement',
    work: "Collecte et structuration des données, puis montage d'un plan d'affaires solide pour lancer l'activité.",
    result: "Démarrage d'activité prévu en décembre 2026",
    status: 'en cours',
    confidential: true,
    color: 'green'
  },
  {
    segment: 'Impact communautaire · Éducation',
    title: 'Initiative « Vacances En Livre »',
    work: "Structuration et coordination d'un grand rendez-vous communautaire autour du livre et de la lecture, porté par la jeunesse haïtienne — Axis en facilitateur de l'organisation.",
    result: 'Réalisée — un succès communautaire',
    status: 'réalisé',
    stats: [
      { value: '3 000+', label: 'jeunes mobilisés' },
      { value: '49', label: 'auteurs en signature' }
    ],
    partners: "En partenariat avec la BRH, le FNE, la Direction Nationale du Livre (DNL), le Bureau Haïtien du Droit d'Auteur (BHDA), la Mairie de Delmas et le Rotaract Club de Delmas.",
    confidential: false,
    color: 'cyan'
  }
];

const accent: Record<Reference['color'], { bar: string; label: string }> = {
  cyan: { bar: 'border-l-brand-cyan', label: 'text-brand-cyan-text' },
  navy: { bar: 'border-l-brand-navy', label: 'text-brand-navy/70' },
  green: { bar: 'border-l-brand-green', label: 'text-brand-green-text' }
};

function StatusBadge({ status }: { status: Reference['status'] }) {
  const done = status === 'réalisé';
  return (
    <span
      className={`text-4xs font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border flex-shrink-0 ${
        done
          ? 'bg-brand-green/10 text-brand-green-text border-brand-green/25'
          : 'bg-brand-cyan/10 text-brand-cyan-text border-brand-cyan/25'
      }`}
    >
      {done ? '✓ Réalisé' : 'En cours'}
    </span>
  );
}

export default function ReferencesSection() {
  return (
    <section
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12"
      id="home-references-section"
      aria-labelledby="references-heading"
    >
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-brand-cyan-text font-bold text-xs tracking-widest uppercase block">
          Nos réalisations
        </span>
        <h2
          id="references-heading"
          className="font-display font-extrabold text-3xl text-brand-navy uppercase tracking-tight"
        >
          Ils nous ont fait confiance
        </h2>
        <p className="text-brand-navy/70 text-xs sm:text-sm leading-relaxed">
          Des missions réelles, du secteur privé au développement communautaire.
          Par respect de nos clients privés, leur identité reste confidentielle —
          les références détaillées sont communiquées sur demande, avec leur accord.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start" id="references-grid">
        {REFERENCES.map((ref, idx) => (
          <motion.article
            key={idx}
            whileHover={{ y: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className={`bg-white rounded-3xl border-y border-r border-brand-gray/15 border-l-4 ${accent[ref.color].bar} p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-4`}
            id={`reference-card-${idx}`}
          >
            <div className="space-y-3 text-left">
              <div className="flex items-start justify-between gap-3">
                <span className={`text-3xs font-mono font-bold uppercase tracking-widest ${accent[ref.color].label}`}>
                  {ref.segment}
                </span>
                <StatusBadge status={ref.status} />
              </div>
              <h3 className="font-display font-bold text-lg text-brand-navy uppercase tracking-tight leading-tight">
                {ref.title}
              </h3>
              <p className="text-xs text-brand-navy/70 leading-relaxed">{ref.work}</p>

              {ref.stats && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {ref.stats.map((s, i) => (
                    <div key={i} className="bg-brand-light rounded-xl px-3 py-2 border border-brand-navy/5">
                      <span className="font-display font-black text-xl text-brand-navy block leading-none">
                        {s.value}
                      </span>
                      <span className="text-4xs uppercase tracking-wider text-brand-navy/60 font-bold">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 bg-brand-light rounded-xl p-3 border border-brand-navy/5">
                <CheckCircle2 className="h-4 w-4 text-brand-green-text flex-shrink-0 mt-0.5" />
                <span className="text-xs font-bold text-brand-navy leading-snug">{ref.result}</span>
              </div>

              {ref.partners && (
                <p className="text-3xs text-brand-navy/70 leading-relaxed italic">{ref.partners}</p>
              )}

              {ref.confidential && (
                <p className="flex items-center gap-1.5 text-3xs text-brand-navy/55 uppercase tracking-wider font-bold">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-navy/40" />
                  Référence sur demande
                </p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
