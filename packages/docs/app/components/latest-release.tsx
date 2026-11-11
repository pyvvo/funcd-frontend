import release from '../../content/release.json';

// The pages describe the latest release; the top of the sidebar names it.
const LatestRelease = () => (
  <a
    href={`https://github.com/pyvvo/funcd/releases/tag/${release.latest}`}
    className="flex items-center justify-between gap-2 rounded-lg border bg-fd-secondary/50 px-2.5 py-1.5 text-xs text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground">
    <span>Latest release</span>
    <span className="font-medium text-fd-foreground">{release.latest}</span>
  </a>
);

export default LatestRelease;
