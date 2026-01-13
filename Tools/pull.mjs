import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import https from 'https';

dotenv.config();

const BASE_URL = 'https://n8n.gdev.fr';
const API_PREFIX = '/api/v1';
const API_KEY = process.env.N8N_API_KEY;

if (!API_KEY) {
  console.error("Défini la variable d'environnement N8N_API_KEY avant d'exécuter ce script.");
  process.exit(1);
}

const pullDir = path.resolve('Pull');
const pushDir = path.resolve('Push');
const agent = new https.Agent({ rejectUnauthorized: false });

const args = process.argv.slice(2);
const workflowId = args[0];

if (!workflowId) {
  console.error('Usage: node scripts/pull.mjs <workflowId>');
  process.exit(1);
}

const headers = {
  'Content-Type': 'application/json',
  'X-N8N-API-KEY': API_KEY,
};

function sanitizeName(name) {
  const cleaned = (name || '').trim().toLowerCase().replace(/[^a-z0-9-_]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || `workflow-${workflowId}`;
}

async function fetchWorkflow(id) {
  const url = `${BASE_URL}${API_PREFIX}/workflows/${id}`;
  const response = await fetch(url, { headers, agent });
  if (!response.ok) {
    throw new Error(`Échec du téléchargement (${response.status})`);
  }
  return response.json();
}

async function ensureDirectories() {
  await fs.promises.mkdir(pullDir, { recursive: true });
  await fs.promises.mkdir(pushDir, { recursive: true });
}

async function main() {
  await ensureDirectories();
  const workflow = await fetchWorkflow(workflowId);
  const baseName = sanitizeName(workflow.name || workflow.id);
  const pullPath = path.join(pullDir, `${baseName}.json`);
  const pushPath = path.join(pushDir, `${baseName}.json`);

  await fs.promises.writeFile(pullPath, JSON.stringify(workflow, null, 2));
  console.log(`Workflow téléchargé dans ${pullPath}.`);

  await fs.promises.writeFile(pushPath, JSON.stringify(workflow, null, 2));
  console.log(`Copie éditable disponible dans ${pushPath}.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
