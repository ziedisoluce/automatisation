import { execFileSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const readmePath = resolve('README.md');
const startMarker = '<!-- branches-start -->';
const endMarker = '<!-- branches-end -->';

const doc = readFileSync(readmePath, 'utf8');

const markerStartIndex = doc.indexOf(startMarker);
const markerEndIndex = doc.indexOf(endMarker);

if (markerStartIndex === -1 || markerEndIndex === -1 || markerEndIndex <= markerStartIndex) {
  throw new Error(
    'README.md must contain valid branch section markers. Add both <!-- branches-start --> and <!-- branches-end -->.'
  );
}

const gitList = execFileSync('git', [
  'for-each-ref',
  '--sort=-committerdate',
  '--format=%(refname:short)|%(committerdate:iso-strict)|%(objectname:short)|%(contents:subject)',
  'refs/heads',
], { encoding: 'utf8' });

const branches = gitList
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [name, date, sha, message] = line.split('|');
    return {
      name,
      date,
      sha,
      message,
    };
  });

const tableLines = [
  '| Branch | Dernier commit | Date |',
  '| --- | --- | --- |',
  ...branches.map(
    (branch) =>
      `| \`${branch.name}\` | \`${branch.sha}\` ${branch.message ? `- ${branch.message}` : ''} | ${branch.date} |`
  ),
];

const updatedSection = [
  startMarker,
  '',
  'La liste ci-dessous est regeneree automatiquement via `scripts/update-readme-branches.mjs` quand les hooks suivent les branches.',
  '',
  ...tableLines,
  '',
  endMarker,
].join('\n');

const before = doc.slice(0, markerStartIndex);
const after = doc.slice(markerEndIndex + endMarker.length);

writeFileSync(readmePath, `${before}${updatedSection}${after}`, 'utf8');
