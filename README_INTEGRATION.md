# Connexion Interface ↔ Workflows

## Principe de communication

- L’interface appelle un unique endpoint `POST /api` (cf. spécification) avec un payload `{ entity, action, params }`. Chaque combinaison devient `routeKey = entity.action` dans n8n, autorisée uniquement si elle figure dans la liste valide.
- Le front est responsable de construire des payloads alignés avec le modèle HubSpot : contact (`email`, `team`, `access_tier`), deal (`referral_partner_email`, `dealstage`, `amount`), etc.
- Les requêtes utilisent `fetch` simple (pas de cache), conformément aux contraintes (Simple Fetch uniquement) ; les réponses n8n sont consommées telles quelles (JSON, redirect, erreurs génériques).

## Ce qui fonctionne actuellement

- Les pages front-end ont des formulaires prêts (login, lead, dashboard, exports) et peuvent être enrichies pour envoyer `entity`/`action`.
- Les scripts `Tools/pull.mjs` / `Tools/push.mjs` permettent de synchroniser les définitions n8n (Pull/ → Push/), ce qui garantit qu’on sait exactement ce qui tourne côté n8n.
- Les contraintes de sécurité sont mises en évidence dans la doc technique : cookie `session` HttpOnly, JWT (8h), aucun mot de passe en clair, accès par `role_manager` et `team`.

## Ce qui reste à implémenter

- Aucun appel n’est encore réalisé dans le front ; il faut implémenter chaque `entity.action` en construisant `params` précis (auth.login → `{email, password}`, deals.list → filtres `referral_partner_email`, etc.).
- L’authentification front-end doit récupérer le JWT renvoyé par `auth.login` et le stocker uniquement via cookie HttpOnly (pas dans localStorage).
- La propagation des erreurs doit rester générique (pas d’énumération des raisons), en cohérence avec les règles de sécurité du workflow.
- Les réponses de n8n (redirect, JSON, fichiers via `Spreadsheet File`) doivent être affichées dans l’interface (dashboards, notifications, exports).

## Choix techniques déjà pris

1. Un unique webhook `POST /api` dans n8n (pas de multiples endpoints).
2. Validation et routage des `entity.action` (`routeKey`) via un Node IF puis un Switch.
3. Auth guard intégré pour vérifier le cookie `session` et injecter le contexte (`email`, `role_manager`, `team`).
4. Tous les accès HubSpot passent par les nodes spécialisés (HubSpot, Split in Batches, Spreadsheet File) avec `spreadsheet` pour exports et `Respond to Webhook` pour renvoi.

## Améliorations et sécurisations prévues

1. Expliquer comment chaque écran construit ses `params` (auth, profil, deals, pipeline, prospects, export) pour standardiser les appels.
2. Ajouter un proxy ou middleware si besoin pour masquer l’URL n8n et gérer les en-têtes (`Access-Control`, CSRF).
3. Automatiser la vérification des cookies JWT (8h) côté front via un middleware JS léger.
4. Documenter la gestion des secrets (`N8N_API_KEY`, `CLIENT_SLUG`, `URL n8n`) dans un `.env` central et ne les exposer qu’aux scripts `Tools/pull.mjs`/`push.mjs`.
