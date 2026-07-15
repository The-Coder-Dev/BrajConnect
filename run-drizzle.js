const { spawnSync } = require('child_process');
const hints = JSON.stringify([
  { type: 'create', kind: 'column', entity: ['public', 'business_documents', 'verificationStatus'] },
  { type: 'create', kind: 'column', entity: ['public', 'business_documents', 'rejectionReason'] }
]);
const result = spawnSync('npx.cmd', ['drizzle-kit', 'generate', '--hints', hints], {
  stdio: 'inherit',
  shell: false
});
process.exit(result.status);
