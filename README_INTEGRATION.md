# Connexion Interface ↔ Workflows

## Mode de communication envisagé

Le front-end doit communiquer avec les workflows via des appels HTTP/REST (ou des webhooks) exposés depuis n8n. Chaque formulaire ou action utilisateur déclencherait un nœud HTTP ou webhook, qui enchaîne la qualification, les notifications et le suivi métier. À ce stade, cette communication est encore théorique : aucun endpoint n’est exposé ni sécurisé dans n8n.

## Ce qui fonctionne actuellement

- Les scripts `Tools/pull.mjs` et `Tools/push.mjs` permettent de synchroniser manuellement les définitions de workflows avec `https://n8n.gdev.fr`.
- Le front-end contient les écrans requis pour déclencher des actions (formulaires, boutons), mais ils restent inactifs tant que l’API n8n n’est pas disponible.
- La documentation du cahier des charges (`docs/Cahier des charges - SAAS Apporteur d’Affaires.pdf`) sert de référence pour décrire les événements attendus.

## Ce qui est partiellement connecté

- La boucle de développement « extraire / modifier / renvoyer » est en place, mais aucun flux automatisé n’est encore exposé au front-end.
- Le front-end peut servir de maquette pour concevoir les payloads (ex. données d’un lead) qui seront fournis à n8n lors du développement futur.

## Ce qui n’est pas encore implémenté

- Aucun endpoint REST ou webhook n’expose les données front-end vers les workflows.
- Il n’existe pas encore de couche d’authentification partagée (tokens, API keys) entre les deux mondes.
- Les réponses n8n (statuts, erreurs, suivis) ne sont pas propagées vers le front-end, donc pas de notifications en temps réel.

## Choix techniques réalisés

1. Utiliser l’API `https://n8n.gdev.fr/api/v1/workflows` pour extraire ou publier des workflows via `Tools/pull.mjs` et `Tools/push.mjs`.
2. Gérer l’accès via la variable `N8N_API_KEY` pour simplifier l’authentification côté scripts.
3. Prévoir des dossiers `Pull/` et `Push/` pour garder une trace des définitions téléchargées et des versions prêtes à être envoyées.

## Améliorations et sécurisations prévues

1. Mettre en place des webhooks authentifiés pour que le front-end puisse déclencher les workflows sans exposer la clé API.
2. Ajouter une couche de journalisation/monitoring pour tracer les appels front-end → n8n et détecter les erreurs.
3. Ajouter des tests d’intégration (mock n8n ou environnements de staging) pour vérifier le bon passage des données.
4. Centraliser la gestion des secrets (API key, URL) via des variables d’environnement documentées dans ce dépôt.
