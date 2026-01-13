# Automatisation pour SAAS Apporteurs d'affaires

Ce dépôt contient la base technique d'un mini-SaaS qui met en relation les apporteurs d’affaires et les managers d’une société de courtage avec leurs données HubSpot via un front-end statique (HTML/CSS/jQuery) et une couche d’automatisation n8n orchestrant toute la logique métier décrite dans `docs/Documentation technique.pdf` et `docs/Cahier des charges.pdf`.

## Architecture générale

- **Front-end (`front-end/`)** : pages statiques (dashboards, listes, formulaires, profils, erreurs) fournies par une template prête à l’emploi et stylisées via SCSS pour livrer rapidement une interface complète.
- **Workflows (n8n)** : un unique workflow hébergé sur `https://n8n.gdev.fr` exécute toute la logique métier (authentification, deals, reporting, exports) en utilisant les nodes Webhook, Function, IF, Switch, HubSpot, Split in Batches, Spreadsheet File, Cron, Email/SMTP et Respond to Webhook.
- **Orchestration** : deux scripts (`Tools/pull.mjs`, `Tools/push.mjs`) permettent d’extraire (Pull/) puis de publier (Push/) les définitions n8n. L’intégration front-end ↔ workflows reposera sur des appels `POST /api` définis dans le contrat unique.

## Interactions entre les sous-systèmes

1. Le front-end affiche les formulaires et tableaux (login, création de lead, dashboards, exports) qui doivent déclencher des `entity.action` vers l’API n8n.
2. Le workflow n8n reçoit ces appels via un webhook unique et les dirige vers la logique métier (auth, deals, manager, pipeline, prospects, export) en respectant les règles définies (team, rôles, filtres HubSpot).
3. Les scripts `Tools/pull.mjs`/`push.mjs` permettent de synchroniser manuellement les définitions pendant le développement, jusqu’à l’automatisation complète des déploiements.

## Rôle des README secondaires

- `README_FRONTEND.md` détaille l’état actuel du front (technos, écrans, limites) et explique comment les formulaires doivent appeler l’API `/api` dans le respect du contrat.
- `README_WORKFLOWS.md` décrit la logique n8n : modèle de données HubSpot, nodes requis, tronc commun, routes métiers, étapes concrètes de chaque action et la liste des nodes utilisés.
- `README_INTEGRATION.md` explique comment le front communique avec les workflows (POST `/api`, auth, règles de sécurité, réponses) et ce qui reste à implémenter pour sécuriser cette liaison.

## État d'avancement

- **Fonctionnel** : front-end statique complet pour prototyper les écrans ; scripts `Tools/pull.mjs` et `Tools/push.mjs` pour synchroniser les workflows.
- **En cours** : modélisation des workflows n8n à partir du contrat ET des règles métier HubSpot (authentification, deals, dashboard manager, pipeline, prospects, export).
- **À venir** : implémentation du POST `/api` aligné sur le contrat, ajout d’une couche d’authentification (JWT + cookies HttpOnly), automatisation des push/pull via CI/CD et tests d’intégration.

## Spécifications techniques

### 0. Contraintes globales

- Un seul workflow n8n centralise toute la logique métier.
- Un seul endpoint : `POST /api`.
- Pas de cache applicatif (Simple Fetch uniquement) ; chaque requête est directe.
- HubSpot est la source de vérité unique (contacts, deals).
- Toute la logique métier est contenue dans n8n (aucun traitement dans le front).

### 1. Modèle de données HubSpot (obligatoire)

#### 1.1 Objet Contact
- `email` (string)
- `password_hash` (string, bcrypt)
- `role_manager` (boolean)
- `team` (string)
- `access_tier` (string : `active` | `revoked`)
- `last_login_at` (datetime)

#### 1.2 Objet Deal
- `referral_partner_email` (string)
- `amount` (number)
- `dealstage` (string)
- `createdate` (datetime)
- `closedate` (datetime)

### 2. Contrat API unique

- Endpoint : `POST /api`.
- Payload attendu :
  ```
  {
    "entity": "auth | me | deals | manager | pipeline | prospects | export",
    "action": "login | profile | list | dashboard | kanban | csv | pdf",
    "params": {}
  }
  ```
- `entity.action` constitue la clef de routage du workflow n8n.

### 3. Workflow n8n – tronc commun (toujours exécuté)

1. **Node Webhook** (POST, path `/api`)
2. **Function Normalize Input** : lecture du body, normalisation de `entity`, `action`, construction de `routeKey = entity.action`.
3. **IF Validate Route** : ne permet que les routes listées (`auth.login`, `auth.logout`, `me.profile`, `deals.list`, `manager.dashboard`, `pipeline.kanban`, `prospects.list`, `export.csv`, `export.pdf`).
4. **Function + IF Auth Guard** : pour toute route autre que `auth.login`, lecture du cookie `session`, vérification du JWT, injection de `authContext` contenant `email`, `role_manager`, `team`.
5. **Switch Router** sur `routeKey` pour diriger vers les sous-workflows métiers.

### 4. Parcours métier

- **auth.login** : search HubSpot contact, vérification `access_tier`, bcrypt compare, génération du JWT (8 h), maj `last_login_at`, réponse avec `ok` et `redirect`.
- **me.profile** : récupération contact HubSpot, mapping profil, `Respond to Webhook`.
- **deals.list** : recherche Deals filtrés sur `referral_partner_email`, mapping + KPI, réponse JSON.
- **manager.dashboard** : recherche contacts du manager (`team`, `role_manager != true`), extraction des emails, boucle `Split in Batches` sur les deals filtrés par partner email, agrégation des KPI, réponse JSON.
- **pipeline.kanban** : fetch deals selon rôle, regroupement par `dealstage`, réponse JSON.
- **prospects.list** : fetch deals, format tableau, réponse JSON.
- **export.csv / export.pdf** : génération via `Spreadsheet File` ou `Respond to Webhook` selon la commande.

### 5. Nodes n8n utilisés

- Webhook
- Function
- IF
- Switch
- HubSpot
- Split In Batches
- Spreadsheet File
- Cron
- Email / SMTP
- Respond to Webhook

### 6. Règles de sécurité (non négociables)

- Aucun mot de passe ne circule en clair.
- Les erreurs restent génériques (anti-enumération).
- Les cookies de session sont `HttpOnly`.
- Accès strict basé sur `role_manager` et `team` dans le workflow (authContext).
