# Zvec-Grep workflow recreation

React recreation of the selected diagram at https://zvec.org/en/docs/zvec-grep/.
The component includes the source tiles, search engine, evidence card, audiences,
and benefit labels. The browser comment outline and marker are omitted.

A repeating six-second Motion for React clock highlights source ingestion, search,
retrieval, and delivery in sequence. The control below the diagram pauses or
resumes all animations. Reduced-motion preferences display the static diagram.

Uses the repository's installed React, Motion, Tabler icons, and Vite Plus dependencies.
Run from the repository root:

```sh
node_modules/.bin/vp dev output/zvec-grep --config output/zvec-grep/vite.config.ts
```

Open http://127.0.0.1:5178.

## Reusable components

- `main.tsx` only mounts the demo.
- `workflow.tsx` exports `ZvecGrepWorkflow`, `SourceTile`, `SearchEngine`,
  `EvidenceCard`, and `Audience`. The `timing` object coordinates the stages.
- `animation.tsx` exports `AnimationLoop`, `AnimatedBlock`, and smaller effects.
  Each loop owns a Motion value clock. Blocks use `useTransform` to derive their
  styles without React renders on every frame or CSS selector targeting.
- `AnimatedBlock` accepts a start time (`at`), duration, lift, scale, border,
  highlight, and glow. Place blocks inside an `AnimationLoop` to synchronize them.
  Its `paused` prop freezes the clock; reduced-motion preferences reset it to zero.

Import `ZvecGrepWorkflow` and `style.css` to reuse the diagram in another page.
For example, a custom animated block can be composed as:

```tsx
<AnimationLoop paused={false} duration={6}>
  <AnimatedBlock
    className="zg-source"
    at={1}
    lift={-5}
    border="#294e67"
    glow={18}>
    Custom source
  </AnimatedBlock>
</AnimationLoop>
```
