# push.mjs

## Description
Sends a workflow JSON stored in Push/ (or any path you pass) back to the n8n API, either creating a new workflow or replacing the existing one if an ID is provided.

## Environment
- Requires N8N_API_KEY.

## Usage
`sh
node Tools/push.mjs <file.json> [workflowId]
`
The first argument is relative to Push/ unless you provide an absolute path; the optional workflowId forces an update instead of a create.
