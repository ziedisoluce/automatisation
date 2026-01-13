# Front-end

## Technologies et structure

- Template HTML/CSS/jQuery avec SCSS (`front-end/scss/`), composants UI (`front-end/ui-*`, `uc-*`, `widget-basic.html`) et dépendances gérées via `front-end/package.json`.
- Assets prêts à l’emploi : dashboards, listes, formulaires, profils, messagerie, exports (CSV/PDF), pages d’erreur.
- Front statique choisi parce qu’il respecte la contrainte de livraison rapide décrite dans `docs/Documentation technique.pdf` (Simple Fetch uniquement, pas de cache applicatif).

## Fonctionnalités et composants disponibles

- Écrans principaux : `page-login.html`, `dashboard-apporteur.html`, `dashboard-manager.html`, `page-nouveau-lead.html`, `project-page.html`, `table-datatable-basic.html`, `app-profile.html`, `message.html`, `email-*`.
- Widgets visuels (chartjs, morris, peity, calendar, kanban) accessibles via `chart-*.html`, `app-calender.html`, `kanban.html`.
- Formulaires avancés (`form-element.html`, `form-validation.html`, `form-wizard.html`) prêts à collecter `email`, `team`, `referral_partner_email`, `amount`.

## Spécifications pour l’interface

- **Contrainte** : un seul endpoint `POST /api` (cf. contrat API) ; tout appel doit envoyer `entity`/`action` et `params` pertinents (ex. `entity: "auth", action: "login"`).
- **Contrainte fetch** : utiliser des requêtes `fetch`/`axios` simples sans cache (Simple Fetch uniquement).
- **Données envoyées** : utiliser le modèle HubSpot (`email`, `password`, `team`, etc.) pour alimenter les workflows ; les écrans doivent s’appuyer sur `params` identiques à ceux attendus par n8n.
- **Sécurité** : ne jamais stocker de mot de passe en clair ; propagation du cookie `session` HttpOnly après `auth.login`.

## Ce qui reste à finir

- Lier les formulaires (login, lead, dashboards) à `POST /api` en construisant le payload `{ entity, action, params }`.
- Gérer les réponses JSON (statuts, KPI) et afficher les erreurs génériques reçues de n8n (anti-enumération).
- Implémenter les transitions entre écrans selon `redirect` (`/dashboard` ou `/dashboard/team`) renvoyé par `auth.login`.
- Ajouter des indicateurs dynamiques (statistiques, pipeline kanban) alimentés par les retours `deals.list`, `manager.dashboard`, `pipeline.kanban`.

## Limitations actuelles

- Données mock uniquement, pas d’appel réel à HubSpot ou n8n.
- Pas de gestion d’état complexe ni de bundler moderne ; tout reste en HTML/jQuery.
- Pas de tests automatisés pour les composants UI.

## Prochaines étapes

1. Implémenter tous les fetchs vers `/api` en respectant les routes autorisées (`auth.login`, `me.profile`, `deals.list`, `manager.dashboard`, `pipeline.kanban`, `prospects.list`, `export.csv`, `export.pdf`).
2. Ajouter un gestionnaire d’erreurs génériques pour éviter les fuites d’information (anti-enumération).
3. Mettre en place des loaders/notifications pour informer l’utilisateur des appels asynchrones.
4. Documenter la façon dont chaque écran construit ses `params` pour faciliter la collaboration avec les workflows.
