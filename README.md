# Automatisation pour SAAS Apporteurs d’Affaires

Ce projet a pour objectif de proposer un socle opérationnel qui connecte une interface front-end à une couche de workflows n8n afin de supporter toute l’activité d’un SAAS d’apporteurs d’affaires (gestion des leads, qualification, suivi et remontée des actions vers les portails clients).

## Architecture générale

- **Front-end (`front-end/`)** : ensemble de pages HTML/CSS/JS basées sur une template prête à l’emploi, regroupant tableaux de bord, formulaires, listes et écrans d’administration. Le dossier embarque un gestionnaire de dépendances Node et une structure de composants statiques.
- **Workflows (n8n)** : les automatisations métier sont censées être définies dans n8n et manipulées par deux scripts principaux (`Tools/pull.mjs` et `Tools/push.mjs`) qui interagissent avec l’API `https://n8n.gdev.fr` en s’appuyant sur la clé `N8N_API_KEY`.
- **Orchestration** : la logique d’orchestration repose sur la boucle "pull / modification / push" : on importe un workflow depuis n8n, on l’adapte en local, puis on le renvoie. Le front-end doit à terme déclencher ou afficher les résultats de ces workflows via une couche d’intégration plus fine.

Ces trois sous-domaines sont documentés séparément : `README_FRONTEND.md` (front-end), `README_WORKFLOWS.md` (workflows) et `README_INTEGRATION.md` (connexion entre l’interface et les workflows). Consulte ces fichiers pour les détails techniques, les limitations actuelles et les suites à donner.

## Interactions entre les sous-systèmes

1. Les utilisateurs naviguent dans l’interface front-end pour créer des leads, visualiser des dashboards ou gérer des tâches.
2. Ces actions doivent être relayées vers n8n via des API ou des événements webhooks afin de déclencher les workflows métier (qualification, affectation, envoi d’emails, etc.).
3. Le repo fournit pour l’instant une boucle manuelle : `Tools/pull.mjs` récupère les définitions depuis n8n, les développeurs les modifient, puis `Tools/push.mjs` les remet sur l’instance. Cette boucle servira de base pour automatiser les déploiements futurs.

## Rôles des README secondaires

- `README_FRONTEND.md` décrit l’état actuel du front-end, ses composants disponibles, ses limites (notamment l’absence de véritable backend) et les étapes à venir.
- `README_WORKFLOWS.md` explique la logique attendue des workflows, l’infrastructure n8n et le statut des automatismes (ce qui tourne déjà, ce qui est en prototype).
- `README_INTEGRATION.md` détaille la connexion entre l’interface et les workflows : comment les appels doivent être orchestrés, ce qui fonctionne aujourd’hui, ce qui reste à mettre en place et les choix techniques déjà arrêtés.

## État d’avancement

- **Fonctionnel** : structure front-end complète (pages, assets, styles), scripts `Tools/pull.mjs` et `Tools/push.mjs` capables de synchroniser les définitions avec `n8n.gdev.fr`.
- **En cours** : création des workflows métier dans n8n (le dépôt ne contient pas encore de définitions fixes) et liaison front-end ↔ workflows (API/rest à écrire).
- **À venir** : implémentation de l’authentification, des appels dynamiques aux workflows, du stockage des résultats et des tableaux de bord réactifs (après avoir défini la logique métier complète).
