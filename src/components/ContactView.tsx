/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Copy, AlertCircle, Loader2, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICE_POLES } from '../types';

interface ContactFormData {
  fullName: string;
  role: string;
  companyName: string;
  sector: string;
  email: string;
  phone: string;
  targetPole: string;
  description: string;
}

// Adresse qui reçoit les demandes de cadrage.
// L'envoi passe par FormSubmit (https://formsubmit.co) : aucun serveur à héberger.
// La toute première soumission déclenche un email de confirmation à cette adresse ;
// il faut cliquer le lien qu'il contient une seule fois pour activer la réception.
const CONTACT_EMAIL = 'contact@axisresult.com';
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_EMAIL}`;

// Lignes WhatsApp. Indicatif Haïti : +509. wa.me exige le numéro au format
// international, sans espace ni symbole.
const WHATSAPP_LINES = [
  { display: '+509 4194-6385', intl: '50941946385' },
  { display: '+509 4807-5039', intl: '50948075039' }
];
const WHATSAPP_PREFILL = encodeURIComponent(
  'Bonjour Axis Result Consulting, je souhaite en savoir plus sur votre accompagnement.'
);

// Secteurs proposés dans le formulaire de cadrage.
const SECTORS = [
  'Agroalimentaire',
  'Distribution / Commerce de détail',
  'Logistique & Transport',
  'Manufacture / Production',
  'Construction / BTP',
  'Services professionnels',
  'Finance / Microfinance',
  'Technologie / Numérique',
  'Santé & Pharmaceutique',
  'Éducation & Formation',
  'Tourisme & Hôtellerie',
  'Énergie & Environnement',
  'ONG / Organisation de développement',
  'Institution publique',
  'Porteur de projet / Startup',
  "Autre secteur d'activité"
];

// Message affiché sous le sélecteur de pôle quand le visiteur ne sait pas encore.
const UNDECIDED_POLE = {
  tagline: "Vous hésitez ? C'est exactement notre point de départ.",
  description:
    "Notre entretien exploratoire gratuit (Phase 1) sert précisément à cela : nous qualifions votre besoin réel et vous orientons vers le pôle — ou la combinaison de pôles — le plus efficace pour votre situation. Aucun engagement à ce stade.",
  points: [
    'Diagnostic rapide de votre problématique',
    'Recommandation du pôle le plus pertinent',
    'Estimation de la démarche et des délais'
  ]
};

// Logo WhatsApp (lucide n'inclut pas la marque). Rendu monochrome via currentColor.
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.892c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a12.062 12.062 0 005.71 1.447h.006c6.585 0 11.946-5.335 11.949-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function ContactView() {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    role: '',
    companyName: '',
    sector: 'Distribution / Commerce de détail',
    email: '',
    phone: '',
    targetPole: 'advisory',
    description: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || submitting) return;

    setErrorMsg(null);
    setSubmitting(true);

    // Référence lisible reprise dans l'email et affichée au demandeur.
    const reference = `AXIS-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const poleLabels: Record<string, string> = {
      advisory: 'Axis Advisory',
      'project-operations': 'Axis Project & Operations',
      'digital-data': 'Axis Digital & Data',
      'learning-development': 'Axis Learning & Development',
      undecided: 'Diagnostic exploratoire (non décidé)'
    };

    try {
      const response = await fetch(FORMSUBMIT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: `Demande de cadrage — ${formData.companyName || formData.fullName} [${reference}]`,
          _template: 'table',
          _replyto: formData.email,
          Référence: reference,
          'Nom complet': formData.fullName,
          Fonction: formData.role || '(non renseignée)',
          Structure: formData.companyName,
          Email: formData.email,
          Téléphone: formData.phone || '(non renseigné)',
          Secteur: formData.sector,
          'Pôle ciblé': poleLabels[formData.targetPole] ?? formData.targetPole,
          'Description du besoin': formData.description
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data.success === 'true' || data.success === true)) {
        setTicketId(reference);
        setSubmitted(true);
      } else {
        throw new Error(data.message || `Réponse inattendue (${response.status})`);
      }
    } catch (err) {
      setErrorMsg(
        `Votre demande n'a pas pu être envoyée. Vérifiez votre connexion, ou écrivez-nous directement à ${CONTACT_EMAIL}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Pôle actuellement sélectionné, pour la carte explicative dynamique.
  const selectedPole = SERVICE_POLES.find((p) => p.id === formData.targetPole);
  const poleCard =
    formData.targetPole === 'undecided'
      ? UNDECIDED_POLE
      : selectedPole
      ? {
          tagline: selectedPole.tagline,
          description: selectedPole.description,
          points: selectedPole.deliverables.slice(0, 3)
        }
      : null;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-fadeIn" id="contact-view-container">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4" id="contact-header">
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-brand-cyan-text font-bold text-xs tracking-widest uppercase block"
        >
          Prise de contact
        </motion.span>
        <h1 className="font-display font-black text-4xl text-brand-navy tracking-tight uppercase">
          Lancer Votre Diagnostic Préliminaire
        </h1>
        <p className="text-brand-navy/70 text-sm sm:text-base leading-relaxed">
          Que vous soyez une PME en pleine croissance, une institution publique ou un porteur de projet, soumettez votre demande pour activer la Phase 1 de notre méthodologie d'intervention.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="contact-grid-content">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-gray/15 p-6 sm:p-8 shadow-md" id="contact-form-col">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6" id="consultation-form">
              {/* Ligne 1 : identité du demandeur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="space-y-1 text-left">
                  <label htmlFor="fullName" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Nom complet *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jean-Pierre Boyer"
                    className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>

                {/* Role / position in the company */}
                <div className="space-y-1 text-left">
                  <label htmlFor="role" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Fonction dans la structure *</label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Directeur Général, Responsable Opérations…"
                    className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Ligne 2 : structure & secteur */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Company Name */}
                <div className="space-y-1 text-left">
                  <label htmlFor="companyName" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Nom de la structure *</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Sogepack Haiti S.A."
                    className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>

                {/* Sector */}
                <div className="space-y-1 text-left">
                  <label htmlFor="sector" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Secteur d'activité</label>
                  <select
                    id="sector"
                    name="sector"
                    value={formData.sector}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs cursor-pointer"
                  >
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ligne 3 : coordonnées */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div className="space-y-1 text-left">
                  <label htmlFor="email" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Adresse Email professionnelle *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@sogepack.com"
                    className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1 text-left">
                  <label htmlFor="phone" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Téléphone (WhatsApp recommandé)</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+509 4194-6385"
                    className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Pôle Axis ciblé (pleine largeur) + carte explicative dynamique */}
              <div className="space-y-3 text-left">
                <label htmlFor="targetPole" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Pôle Axis ciblé</label>
                <select
                  id="targetPole"
                  name="targetPole"
                  value={formData.targetPole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all shadow-2xs cursor-pointer"
                >
                  <option value="advisory">Axis Advisory (Conseil Stratégique & Organisationnel)</option>
                  <option value="project-operations">Axis Project & Operations (Gestion PMO & Suivi)</option>
                  <option value="digital-data">Axis Digital & Data (Transformation Numérique & BI)</option>
                  <option value="learning-development">Axis Learning & Development (Formations)</option>
                  <option value="undecided">Je ne sais pas (Besoin d'un diagnostic exploratoire)</option>
                </select>

                <AnimatePresence mode="wait">
                  {poleCard && (
                    <motion.div
                      key={formData.targetPole}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 rounded-2xl bg-brand-cyan/5 border border-brand-cyan/20 space-y-2.5"
                      id="pole-value-card"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-cyan-text flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Ce que ce pôle vous apporte
                      </span>
                      <p className="text-xs font-bold text-brand-navy leading-snug">{poleCard.tagline}</p>
                      <p className="text-2xs text-brand-navy/70 leading-relaxed">{poleCard.description}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                        {poleCard.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-2xs text-brand-navy/80 bg-white rounded-lg p-2 border border-brand-navy/5">
                            <CheckCircle2 className="h-3.5 w-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                            <span className="leading-tight">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Message / Scoping description */}
              <div className="space-y-1 text-left">
                <label htmlFor="description" className="text-3xs uppercase font-bold text-brand-navy/75 block pl-1">Description succincte du besoin opérationnel</label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Expliquez brièvement votre problématique, les délais souhaités et les résultats attendus..."
                  className="w-full px-4 py-3 bg-brand-light border border-brand-navy/10 rounded-xl text-xs sm:text-sm focus:border-brand-cyan focus:outline-hidden transition-all resize-none shadow-2xs"
                />
              </div>

              {errorMsg && (
                <div
                  role="alert"
                  className="flex items-start gap-2 p-3.5 bg-red-500/5 border border-red-500/20 rounded-xl text-xs text-red-600 font-semibold"
                  id="contact-form-error"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <motion.button
                whileHover={submitting ? undefined : { scale: 1.02 }}
                whileTap={submitting ? undefined : { scale: 0.98 }}
                type="submit"
                disabled={submitting}
                id="btn-submit-contact-form"
                className="w-full bg-brand-navy text-white hover:bg-brand-cyan hover:text-brand-navy border border-brand-navy hover:border-brand-cyan transition-all duration-300 font-bold text-xs uppercase tracking-wider py-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-brand-navy/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-brand-navy disabled:hover:text-white"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Envoi en cours…</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer ma demande de cadrage</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            <div className="p-6 sm:p-8 bg-brand-navy/5 border-l-4 border-brand-green border-y border-r border-brand-navy/10 rounded-3xl space-y-6 animate-fadeIn text-left" id="scoping-ticket-receipt">
              <div className="text-center space-y-3">
                <div className="h-12 w-12 bg-brand-green/10 text-brand-green-text rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h2 className="font-display font-extrabold text-2xl text-brand-navy uppercase tracking-tight">Demande de Cadrage Enregistrée</h2>
                <p className="text-brand-navy/60 text-xs">
                  Votre fiche de besoin préliminaire a été structurée et soumise à notre Comité de coordination.
                </p>
              </div>

              {/* Custom Scoping Ticket Receipt */}
              <div className="bg-white rounded-2xl p-5 border border-brand-gray/15 space-y-4 shadow-xs">
                <div className="flex justify-between items-center border-b border-brand-navy/5 pb-3">
                  <span className="text-3xs uppercase font-mono font-bold text-brand-navy/65">Ticket de Qualification :</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono font-extrabold text-brand-navy bg-brand-navy/5 px-2.5 py-0.5 rounded-lg">
                      {ticketId}
                    </span>
                    <button
                      type="button"
                      id="btn-copy-ticket"
                      onClick={handleCopyTicket}
                      className="p-1.5 hover:bg-brand-navy/5 text-brand-navy/60 hover:text-brand-navy rounded-lg transition-colors"
                      title="Copier le numéro de ticket"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-left">
                  <div>
                    <span className="text-[9px] text-brand-navy/65 uppercase block font-bold">Demandeur :</span>
                    <span className="font-bold text-brand-navy">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-navy/65 uppercase block font-bold">Structure :</span>
                    <span className="font-bold text-brand-navy">{formData.companyName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-navy/65 uppercase block font-bold">Pôle ciblé :</span>
                    <span className="font-extrabold text-brand-cyan-text uppercase">{formData.targetPole}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-navy/65 uppercase block font-bold">Secteur :</span>
                    <span className="font-bold text-brand-navy">{formData.sector}</span>
                  </div>
                </div>

                {copied && (
                  <p className="text-3xs text-brand-green-text font-mono text-center">✓ Ticket copié dans le presse-papier</p>
                )}
              </div>

              {/* Next Steps walkthrough (matching Phase 1 of Methodology) */}
              <div className="space-y-3 pt-2 text-left">
                <span className="text-3xs font-bold uppercase tracking-wider text-brand-navy/60 block">Processus d'activation Phase 1 :</span>
                <div className="space-y-3">
                  <div className="flex gap-3 items-start text-xs text-brand-navy/75">
                    <span className="h-5 w-5 rounded-lg bg-brand-cyan text-brand-navy font-display font-black text-2xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="font-bold text-brand-navy uppercase tracking-tight text-xs">Examen préliminaire (Sous 24h)</p>
                      <p className="text-brand-navy/60 text-3xs">Notre Comité évalue l'adéquation de votre besoin avec nos compétences.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start text-xs text-brand-navy/75">
                    <span className="h-5 w-5 rounded-lg bg-brand-cyan text-brand-navy font-display font-black text-2xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="font-bold text-brand-navy uppercase tracking-tight text-xs">Entretien exploratoire gratuit</p>
                      <p className="text-brand-navy/60 text-3xs">Planification d'un appel Zoom/Teams ou rdv physique à Port-au-Prince.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start text-xs text-brand-navy/75">
                    <span className="h-5 w-5 rounded-lg bg-brand-cyan text-brand-navy font-display font-black text-2xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="font-bold text-brand-navy uppercase tracking-tight text-xs">Co-signature d'une Note de Cadrage (Phase 2)</p>
                      <p className="text-brand-navy/60 text-3xs">Figer les livrables précis et la matrice RACI avant de lancer le projet.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-navy/5 flex justify-center">
                <button
                  type="button"
                  id="btn-reset-scoping-form"
                  onClick={() => setSubmitted(false)}
                  className="text-brand-navy/60 hover:text-brand-navy text-xs font-bold uppercase tracking-wider cursor-pointer border-b border-dashed border-brand-navy/30 hover:border-brand-navy"
                >
                  Soumettre une autre demande de cadrage
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Coordinate info */}
        <div className="lg:col-span-5 bg-brand-navy text-white rounded-[32px] border-l-4 border-brand-cyan p-8 flex flex-col justify-between space-y-10 relative overflow-hidden shadow-xl" id="contact-coords-col">
          {/* Decorative backdrop elements */}
          <div className="absolute inset-0 bg-radial-[at_50%_100%] from-brand-cyan/15 to-transparent pointer-events-none" />
          
          <div className="space-y-6 relative z-10 text-left">
            <h2 className="font-display font-extrabold text-2xl uppercase tracking-tight">Coordonnées de la Firme</h2>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Nous intervenons prioritairement dans l'aire métropolitaine de Port-au-Prince et en province pour des missions de restructuration ou de transformation numérique.
            </p>
          </div>

          {/* Coordinate blocks */}
          <div className="space-y-6 relative z-10 text-left" id="coords-list">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-brand-cyan border border-white/10 flex-shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 block">Adresse physique</span>
                <p className="text-xs sm:text-sm text-white/90 font-medium">
                  B99, Morne Ébo, Canapé-Vert,<br />
                  Port-au-Prince, Haïti
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-brand-cyan border border-white/10 flex-shrink-0">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-white/50 block">Courriel professionnel</span>
                <a href="mailto:contact@axisresult.com" className="text-xs sm:text-sm text-brand-cyan font-semibold hover:underline">
                  contact@axisresult.com
                </a>
              </div>
            </div>

            {/* Ligne d'assistance — CTA WhatsApp cliquables */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-white/50 flex items-center gap-1.5">
                <WhatsAppIcon className="h-3.5 w-3.5 text-brand-green" />
                Ligne d'assistance — Discutons sur WhatsApp
              </span>
              <div className="space-y-2.5">
                {WHATSAPP_LINES.map((line) => (
                  <motion.a
                    key={line.intl}
                    href={`https://wa.me/${line.intl}?text=${WHATSAPP_PREFILL}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    id={`whatsapp-cta-${line.intl}`}
                    className="group flex items-center gap-3 p-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5A] text-white transition-colors shadow-md cursor-pointer"
                  >
                    <span className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                      <WhatsAppIcon className="h-5 w-5" />
                    </span>
                    <span className="flex flex-col leading-tight">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Écrire maintenant</span>
                      <span className="text-sm font-mono font-bold">{line.display}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 ml-auto text-white/70 group-hover:text-white transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* Assurance footer */}
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-2xs text-white/60 leading-relaxed relative z-10 text-left" id="contact-assurance-footer">
            <strong>Engagement d'éthique :</strong> Axis Result Consulting applique une politique d'intégrité zéro-conflit d'intérêts et de confidentialité absolue sur l'ensemble de ses formulaires et diagnostics d'opportunités.
          </div>
        </div>
      </div>
    </div>
  );
}
