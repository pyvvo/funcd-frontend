import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { includesOf } from './includes';

// The site takes from funcd what changes with the code: its pages
// (docs/guide), the example manifests and the go.mod that pages include from,
// and the install script it serves as /install.sh. It mirrors funcd's layout
// under content/funcd, so that a page's relative include path resolves as in
// funcd (funcd ADR-0325). It copies them from a funcd checkout when FUNCD_DIR
// names one, else from funcd at FUNCD_REF.
const mirror = fileURLToPath(new URL('../content/funcd', import.meta.url));
const copies = [
  { from: 'docs/guide', to: join(mirror, 'docs/guide') },
  // funcd has example manifests since ADR-0325; an older ref has none.
  {
    from: 'api/types/v1alpha1/examples',
    to: join(mirror, 'api/types/v1alpha1/examples'),
    optional: true
  },
  { from: 'go.mod', to: join(mirror, 'go.mod') },
  {
    from: 'scripts/install-funcdctl.sh',
    to: fileURLToPath(new URL('../public/install.sh', import.meta.url))
  }
];
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

const git = (...args: string[]) =>
  execFileSync('git', args, { stdio: ['ignore', 'ignore', 'inherit'] });

const sparseClone = (url: string, ref: string, paths: string[]) => {
  const dir = mkdtempSync(join(tmpdir(), 'funcd-docs-'));
  git(
    'clone',
    '--depth=1',
    '--filter=blob:none',
    '--sparse',
    '--branch',
    ref,
    url,
    dir
  );
  git(
    '-C',
    dir,
    'sparse-checkout',
    'set',
    '--no-cone',
    ...paths.map((path) => `/${path}`)
  );
  return dir;
};

// A page includes a file of a repo that funcd pins in go.mod as if that repo
// sat at funcd's root, under _repos/<repo>/. Each such file is fetched at the
// pinned tag, and the tag that git checked out is recorded beside the files,
// for check-includes.ts to compare with go.mod.
const repos = join(mirror, '_repos');
const pinnedTag = (name: string) => {
  const pin = readFileSync(join(mirror, 'go.mod'), 'utf8').match(
    new RegExp(`^\\s*github\\.com/pyvvo/${name}\\s+(v\\S+)`, 'm')
  );
  if (!pin) throw new Error(`funcd's go.mod pins no github.com/pyvvo/${name}`);
  return pin[1];
};
const fetchIncluded = () => {
  rmSync(repos, { recursive: true, force: true });
  const wanted = new Map<string, Set<string>>();
  for (const { target } of includesOf(join(mirror, 'docs/guide'))) {
    const path = relative(repos, target);
    if (path.startsWith('..')) continue;
    const [name, ...rest] = path.split(sep);
    wanted.set(name, (wanted.get(name) ?? new Set()).add(rest.join('/')));
  }
  for (const [name, files] of wanted) {
    const dir = sparseClone(
      `https://github.com/pyvvo/${name}.git`,
      pinnedTag(name),
      [...files]
    );
    try {
      for (const file of files) {
        const to = join(repos, name, file);
        mkdirSync(dirname(to), { recursive: true });
        cpSync(join(dir, file), to);
      }
      const fetched = execFileSync(
        'git',
        ['-C', dir, 'describe', '--tags', '--exact-match'],
        {
          encoding: 'utf8'
        }
      ).trim();
      writeFileSync(join(repos, name, '.tag'), `${fetched}\n`);
      console.log(
        `fetched ${files.size} included file(s) of ${name} at ${fetched}`
      );
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  }
};

const root = process.env.FUNCD_DIR;
const ref = process.env.FUNCD_REF ?? 'main';
const clone = root
  ? undefined
  : sparseClone('https://github.com/pyvvo/funcd.git', ref, [
      ...copies.map(({ from }) => from),
      manifest
    ]);
const funcd = root ?? clone!;

try {
  for (const { from, to, optional } of copies) {
    const source = join(funcd, from);
    rmSync(to, { recursive: true, force: true });
    if (!existsSync(source)) {
      if (optional) continue;
      throw new Error(`funcd has no ${from} at ${root ?? ref}`);
    }
    mkdirSync(dirname(to), { recursive: true });
    cpSync(source, to, { recursive: true });
  }
  console.log(
    `copied ${copies.map(({ from }) => from).join(', ')} from ${root ?? `funcd ${ref}`}`
  );
  fetchIncluded();
  const latest = releaseOf(funcd);
  writeFileSync(releaseFile, `${JSON.stringify({ latest })}\n`);
  console.log(`the pages describe release ${latest}`);
} finally {
  if (clone) rmSync(clone, { recursive: true, force: true });
}
