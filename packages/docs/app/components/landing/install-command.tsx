import { IconCheck, IconCopy } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

const command = 'curl -fsSL https://pyvvo.github.io/funcd/install.sh | sh';

const InstallCommand = ({ className = '' }: { className?: string }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div
      className={`flex max-w-full items-center gap-3 rounded-full border bg-fd-card/70 py-1.5 pl-4 pr-1.5 font-mono text-[13px] backdrop-blur ${className}`}>
      <span aria-hidden className="select-none text-fd-primary">
        $
      </span>
      <code className="min-w-0 truncate text-fd-foreground">{command}</code>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard.writeText(command).then(() => setCopied(true))
        }
        aria-label={copied ? 'Copied' : 'Copy the install command'}
        className="grid size-8 shrink-0 place-items-center rounded-full text-fd-muted-foreground transition-colors hover:bg-fd-accent hover:text-fd-foreground">
        {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
      </button>
    </div>
  );
};

export default InstallCommand;
