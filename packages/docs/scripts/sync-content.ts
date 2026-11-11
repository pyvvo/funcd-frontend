import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The site takes two things from funcd, where they change with the code: its
// pages (docs/guide) and the install script it serves as /install.sh. It
// copies them in before it runs: from a funcd checkout when FUNCD_DIR names
// one, else from funcd at FUNCD_REF.
const repo = 'https://github.com/pyvvo/funcd.git';
const copies = [
  { from: 'docs/guide', to: '../content/docs' },
  { from: 'scripts/install-funcdctl.sh', to: '../public/install.sh' }
].map(({ from, to }) => ({
  from,
  to: fileURLToPath(new URL(to, import.meta.url))
}));
const releaseFile = new URL('../content/release.json', import.meta.url);

// The sidebar names the release that the pages describe. funcd's release PR
// writes that version into its release-please manifest, so the site reads it
// from the same funcd as the pages. The site is published at each release, so
// it names the latest one.
const manifest = '.release-please-manifest.json';
const releaseOf = (funcd: string) => {
  const version = JSON.parse(readFileSync(join(funcd, manifest), 'utf8'))['.'];
  if (!version) throw new Error(`funcd's ${manifest} names no version`);
  return `v${version}`;
};

const cloneAt = (ref: string) => {
  const dir = mkdtempSync(join(tmpdir(), 'funcd-docs-'));
  const git = (...args: string[]) =>
    execFileSync('git', args, { stdio: ['ignore', 'ignore', 'inherit'] });
  git(
    'clone',
    '--depth=1',
    '--filter=blob:none',
    '--sparse',
    '--branch',
    ref,
    repo,
    dir
  );
  git(
    '-C',
    dir,
    'sparse-checkout',
    'set',
    '--no-cone',
    ...copies.map(({ from }) => `/${from}`),
    `/${manifest}`
  );
  return dir;
};

const root = process.env.FUNCD_DIR;
const ref = process.env.FUNCD_REF ?? 'main';
const clone = root ? undefined : cloneAt(ref);
const funcd = root ?? clone!;

try {
  for (const { from, to } of copies) {
    const source = join(funcd, from);
    if (!existsSync(source)) {
      throw new Error(`funcd has no ${from} at ${root ?? ref}`);
    }
    rmSync(to, { recursive: true, force: true });
    cpSync(source, to, { recursive: true });
  }
  console.log(
    `copied ${copies.map(({ from }) => from).join(' and ')} from ${root ?? `funcd ${ref}`}`
  );
  const latest = releaseOf(funcd);
  writeFileSync(releaseFile, `${JSON.stringify({ latest })}\n`);
  console.log(`the pages describe release ${latest}`);
} finally {
  if (clone) rmSync(clone, { recursive: true, force: true });
}
