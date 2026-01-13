# Workflows

## Logique métier portée par les workflows

L’ambition est de piloter toute la chaîne d’apport d’affaires via n8n : réception d’un lead, qualification (scoring, vérification), assignation à un apporteur ou à un manager, notification par email/sms et synchronisation vers les outils clients. C’est également via les workflows que les actions front-end doivent être prises en charge (ex. validation de formulaire, génération de documents, envoi de relances).

## Technologies et outils utilisés

- n8n hébergé sur `https://n8n.gdev.fr` pour définir les automatisations.
- Scripts Node pour synchroniser les définitions avec l’API n8n : `Tools/pull.mjs` (télécharge un workflow) et `Tools/push.mjs` (publie un JSON modifié).
- Variables d’environnement (`N8N_API_KEY`) pour authentifier chaque interaction avec l’API REST de n8n.

## Workflows opérationnels

- Pour le moment, aucun workflow métier n’est codé dans ce dépôt : l’essentiel du travail consiste à préparer la boucle de développement (pull/push) pour itérer sur les définitions côté n8n.
- La logique métier reste donc à formaliser dans n8n avant d’être considérée comme « opérationnelle ».

## Workflows en cours ou prototypes

- Aucun prototype codé dans le dépôt. On prévoit de créer les workflows suivants : qualification des leads, notification des apporteurs, génération de contrats, reporting vers la plateforme clients.
- Chaque workflow devra respecter les schémas définis par `docs/Cahier des charges - SAAS Apporteur d’Affaires.pdf` (lead → transaction → suivi d’activité).

## Points bloquants ou techniques

- Les workflows n’existent pas encore : il faut d’abord définir les nœuds (HTTP, webhook, SQL, email) et tester les scénarios manuellement.
- L’API n8n nécessite une clé sécurisée ; il faut centraliser sa gestion (vault, variables d’environnement, CI/CD).
- Aucun mécanisme de test automatisé n’est mis en place pour valider les workflows (mocks, fixtures, etc.).

## Évolutions prévues

1. Définir et versionner les workflows dans le dépôt (JSON exportés) afin de les rollerbacks facilement.
2. Implémenter une suite de tests (via n8n-runner ou scripts Node) pour vérifier que les workflows exécutent les étapes critiques.
3. Automatiser le déploiement des workflows via CI/CD (push automatique après validation).
4. Documenter les entrées/sorties de chaque workflow pour les consommateurs front-end et API externes.
