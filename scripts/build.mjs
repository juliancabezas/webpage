import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const expected = readFileSync('.hugo-version', 'utf8').trim();
const version = spawnSync('hugo', ['version'], { encoding: 'utf8' });
if (version.error) throw version.error;
if (version.status !== 0 || !version.stdout.includes(`v${expected}-`)) {
  throw new Error(`Se requiere Hugo ${expected}. Versión encontrada: ${version.stdout}`);
}
console.log(version.stdout.trim());

const preview = ['deploy-preview', 'branch-deploy'].includes(process.env.CONTEXT)
  || process.env.HUGO_ENVIRONMENT === 'preview';
const args = ['--gc', '--minify', '--cleanDestinationDir', '--environment', preview ? 'preview' : 'production'];
if (preview) {
  if (!process.env.DEPLOY_PRIME_URL) throw new Error('Falta DEPLOY_PRIME_URL para la vista previa.');
  const url = new URL(process.env.DEPLOY_PRIME_URL);
  if (url.protocol !== 'https:') throw new Error('La vista previa debe utilizar HTTPS.');
  args.push('--baseURL', `${url.origin}/`);
}
run('hugo', args);
run(process.execPath, ['node_modules/pagefind/lib/runner/bin.cjs', '--site', 'public']);
run(process.execPath, ['scripts/verify-build.mjs']);
