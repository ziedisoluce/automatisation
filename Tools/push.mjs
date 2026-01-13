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

const args = process.argv.slice(2);
const workflowFile = args[0];
const workflowId = args[1];

if (!workflowFile) {
  console.error('Usage: node scripts/push.mjs <fichier-workflow> [workflowId]');
  process.exit(1);
}

const resolvedPath = path.isAbsolute(workflowFile) ? workflowFile : path.resolve('Push', workflowFile);

if (!fs.existsSync(resolvedPath)) {
  console.error(`Fichier introuvable : ${resolvedPath}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'));
const endpoint = workflowId
  ? `${BASE_URL}${API_PREFIX}/workflows/${workflowId}`
  : `${BASE_URL}${API_PREFIX}/workflows`;
const method = workflowId ? 'PUT' : 'POST';
const agent = new https.Agent({ rejectUnauthorized: false });

async function pushWorkflow() {
  const response = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-N8N-API-KEY': API_KEY,
    },
    body: JSON.stringify(payload),
    agent,
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Échec ${response.status} : ${body}`);
  }

  const json = body ? JSON.parse(body) : {};
  console.log(`Workflow envoyé : ${json.id || json.name || workflowId || 'nouveau'}.`);
}

pushWorkflow().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
