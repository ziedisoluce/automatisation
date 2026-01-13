# Front-end

## Technologies en place

- Template HTML/CSS/JS classique, appuyée sur un dossier `vendor/` avec bibliothèques UI (widgets, grilles, composants).
- Node.js est utilisé pour gérer les dépendances (`front-end/package.json`, `node_modules/`), ce qui peut servir à automatiser un build ou générer un site statique.
- Une couche SCSS (`front-end/scss/`) permet de styliser rapidement les écrans et de générer `all.min.css`.

## Fonctionnalités implémentées

- Nombreux écrans de gestion interne : dashboards (`dashboard-apporteur.html`, `dashboard-manager.html`), listes métiers (`table-datatable-basic.html`), formulaires (`form-element.html`, `form-validation.html`) et écrans de profils/paramètres.
- Pages de communication (email, blog, messagerie) déjà stylées et prêtes pour afficher du contenu.
- Écrans de connexion/inscription (`page-login.html`, `page-register.html`) et d’erreurs (`page-error-404.html`, etc.).

## Composants existants

- Éléments de navigation (menus, onglets, modals, accordéons, notifications).
- Widgets de visualisation (charts, calendriers, kanban et cartes).
- Formulaires multi-étapes, validateurs basiques et composants de chargement.

## État partiel ou en cours

- Les écrans sont statiques : aucune liaison avec une API métier ou une base de données n’existe.
- Les formulaires ne soumettent rien et ne sont pas connectés au workflow n8n. Ils servent actuellement uniquement de maquettes fonctionnelles.
- Il n’y a pas de système de composants JavaScript réutilisables ou de gestion d’état centralisée (Redux, Vuex, etc.).

## Limitations connues

- Les pages ne sont pas responsives de manière éprouvée ; la cohérence mobile reste à valider.
- Les données présentées sont fictives (mock) : tout passage en production devra brancher les appels HTTP.
- Absence d’authentification fiable et de protection des ressources sensibles côté front-end.

## Prochaines étapes front-end

1. Transformer les composants statiques en vues dynamiques alimentées par l’API (via fetch/axios ou sockets).
2. Instaurer une couche d’authentification (JWT, OAuth) partagée entre la partie interface et les workflows.
3. Implémenter la réactivité (rafraîchissement des dashboards, tables filtrables, formulaires connectés).
4. Documenter les styles, les composants réutilisables et la manière dont les développeurs doivent les étendre.
