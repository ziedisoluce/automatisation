```mermaid
flowchart TD
  A[Webhook POST /api] --> B[Function Normalize Input<br/>entity + action → routeKey]
  B --> C[IF Validate Route<br/>autorise auth.login/auth.logout/me.profile/deals.list/manager.dashboard/pipeline.kanban/prospects.list/export.csv/export.pdf]
  C --> D{Auth Guard<br/>route ≠ auth.login ?}
  D -->|Oui| D1[Function lire cookie session + vérifier JWT<br/>injecte authContext {email, role_manager, team}]
  D -->|Non| E[Switch Router routeKey]
  D1 --> E
  E -->|auth.login| F1[Auth Login<br/>1. HubSpot Search Contact<br/>2. IF access_tier == revoked → 403<br/>3. Function bcrypt<br/>4. IF fail → 401<br/>5. Function JWT 8h<br/>6. HubSpot Update last_login_at<br/>7. Respond + Set-Cookie]
  E -->|me.profile| F2[Me Profile<br/>HubSpot Get Contact → Function mapping → Respond JSON]
  E -->|deals.list| F3[Deals list<br/>HubSpot Search Deals filter referral_partner_email → Function KPI → Respond JSON]
  E -->|manager.dashboard| F4[Manager Dashboard<br/>1. HubSpot Search Contacts (team=manager.team & role_manager!=true)<br/>2. Extract partner emails<br/>3. Split in Batches → HubSpot Search Deals → Function agrégation → Respond JSON]
  E -->|pipeline.kanban| F5[Pipeline Kanban<br/>Fetch deals selon rôle → Function group by dealstage → Respond JSON]
  E -->|prospects.list| F6[Prospects List<br/>Fetch deals → Function format tableau → Respond JSON]
  E -->|export.csv| F7[Export CSV<br/>Spreadsheet File + Respond to Webhook]
  E -->|export.pdf| F8[Export PDF<br/>Spreadsheet File + Respond to Webhook]
```
