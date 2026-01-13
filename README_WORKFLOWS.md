# Workflows

## Objectif métier

Un unique workflow n8n gère toute la logique : il reçoit les requêtes `POST /api`, valide les routes, applique les règles métier basées sur HubSpot (contacts et deals) et répond au front-end. Les workflows gèrent l’authentification (`auth.login`), la mise à jour de profil (`me.profile`), la liste des deals partenaires, le dashboard manager, la pipeline kanban, la liste des prospects et les exports (CSV/PDF).

## Modèle de données HubSpot

- **Contact** : `email`, `password_hash` (bcrypt), `role_manager`, `team`, `access_tier` (`active` | `revoked`), `last_login_at`.
- **Deal** : `referral_partner_email`, `amount`, `dealstage`, `createdate`, `closedate`.
- HubSpot reste la source de vérité unique ; tout filtre ou extraction se base sur ces champs.

## Contrat API et routes autorisées

- Endpoint unique `POST /api` avec payload :
  ```
  {
    "entity": "auth | me | deals | manager | pipeline | prospects | export",
    "action": "login | profile | list | dashboard | kanban | csv | pdf",
    "params": {}
  }
  ```
- Le pair `entity.action` compose `routeKey`. Les routes autorisées sont : `auth.login`, `auth.logout`, `me.profile`, `deals.list`, `manager.dashboard`, `pipeline.kanban`, `prospects.list`, `export.csv`, `export.pdf`.

## Tronc commun du workflow n8n

1. **Webhook** (POST `/api`, seul point d’entrée).
2. **Function Normalize Input** : lecture du body, normalisation des fields `entity`/`action`, construction de `routeKey`.
3. **IF Validate Route** : permet uniquement les routes listées.
4. **Function + IF Auth Guard** : pour toute route ≠ `auth.login`, vérifie le cookie `session`, parse et vérifie le JWT (8h), injecte `authContext = { email, role_manager, team }`.
5. **Switch Router** sur `routeKey` vers les sous-branches métier.

## Routes métier détaillées

- **auth.login** : Search Contact HubSpot par email → IF `access_tier == revoked` retourne 403 → Function `bcrypt.compare` → IF false retourne 401 → Function génère JWT (8h) → Update `last_login_at` dans HubSpot → Respond with `ok: true` + `redirect`.
- **me.profile** : Get Contact par email → Function mappe les champs publics → Respond JSON.
- **deals.list** (partenaire) : Search Deals filtrés sur `referral_partner_email = contact.email` → Function map + KPI → Respond JSON.
- **manager.dashboard** : Search Contacts filtrés (`team = manager.team`, `role_manager != true`) → Function extrait les emails partenaires → Split in Batches sur les emails → chaque batch lance Search Deals (filter `referral_partner_email`) → Function agrège les KPI → Respond JSON.
- **pipeline.kanban** : Fetch deals selon rôle (`referral_partner_email` ou manager) → Function groupe par `dealstage` → Respond JSON.
- **prospects.list** : Fetch deals selon rôle → Function formate un tableau → Respond JSON.
- **export.csv / export.pdf** : Chaines d’extraction + `Spreadsheet File` / `Respond to Webhook` pour générer les fichiers.

## Nodes n8n requis (liste exacte)

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

## Contraintes et sécurité

- Aucun mot de passe ne circule en clair : uniquement `password_hash` comparés via bcrypt.
- Les erreurs exposées au front sont génériques (anti-enumération).
- Les cookies de session sont `HttpOnly`.
- Les accès sont strictement basés sur `role_manager` et `team` dans le workflow.
