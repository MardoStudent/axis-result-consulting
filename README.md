# Axis Result Consulting — site vitrine

Site vitrine de la firme Axis Result Consulting (Port-au-Prince, Haïti).
React 19 + TypeScript + Vite 6 + Tailwind CSS 4.

## Prérequis

- Node.js 20 ou plus

## Lancer en local

```bash
npm install
npm run dev
```

Le site est servi sur http://localhost:3000.

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Sert le build de production en local |
| `npm run lint` | Vérification TypeScript (`tsc --noEmit`) |

## Structure

```
index.html            Métadonnées SEO, polices, point d'entrée
public/favicon.svg    Marque
src/
  main.tsx            Montage React
  App.tsx             Coquille : navigation, vues, pied de page
  index.css           Thème Tailwind (couleurs, polices, échelle typo)
  types.ts            Types + contenu statique (pôles, méthodologie, projets)
  components/
    Navigation.tsx    En-tête et menu mobile
    AboutView.tsx     À propos, valeurs, co-fondateurs
    ServicesView.tsx  Les 4 pôles de services
    MethodologyView.tsx  Les 7 phases d'intervention
    ContactView.tsx   Formulaire de cadrage
    DashboardView.tsx Simulateur de pilotage de projet (démo)
```

## Thème

Les couleurs de marque et l'échelle typographique sont déclarées dans le bloc
`@theme` de `src/index.css`. En Tailwind 4, **toute classe utilitaire non
adossée à un token de thème ne génère aucun CSS et échoue silencieusement.**
Les tailles sous `text-xs` (`text-2xs`, `text-3xs`, `text-4xs`), l'ombre
`shadow-3xs` et l'animation `animate-fadeIn` y sont donc explicitement définies.

## Points ouverts

- Le formulaire de contact n'envoie encore rien : `handleSubmit` dans
  `ContactView.tsx` génère un numéro de ticket local sans appel réseau.
- Pas de routeur : les six vues partagent une seule URL, ce qui empêche
  l'indexation et le partage de liens profonds.
- `DashboardView.tsx` est un simulateur ; son état n'est pas persisté.
