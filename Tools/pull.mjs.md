# pull.mjs

## Description
Downloads a workflow by id from the n8n API and drops it into both Pull/ (raw copy) and Push/ (editable copy) so you can inspect or modify it before pushing it back.

## Environment
- Depends on N8N_API_KEY being defined.

## Usage
`sh
node Tools/pull.mjs <workflowId>
`
Run from the repo root so the default Pull and Push folders are created and populated with <workflow-name>.json.
