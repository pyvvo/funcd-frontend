# Funcd logo

The approved interlocking mark uses four Bézier paths and two circles. The
background, frame crossings, and diamond-shaped center are transparent. The
default colors are white (`#FFFFFF`) and the theme's primary shade 9, with brand
purple (`#6D5CE7`) as the fallback when no theme variables are present.

```tsx
import { FuncdLogo } from '@funcd-dev/ui';

<FuncdLogo size={48} />;
// Use a dark foreground on light surfaces.
<FuncdLogo size={48} color="#17151F" />;
// Use a UI theme palette color for the accent.
<FuncdLogo size={48} accentColor="var(--mantine-color-info-9)" />;
// Hide the mark from assistive technology when adjacent text names the brand.
<FuncdLogo aria-hidden="true" />;
```

`size` sets both dimensions and defaults to `48`. It accepts a pixel number or
a CSS length such as `"3rem"`. Separate `width` and `height` props are excluded
from the component API.

`color` controls the frame, lower ribbon, and output dot. `accentColor` controls
the upper ribbon and input dot; both support theme CSS variables or literal
colors. Standard SVG props, including `className`,
`style`, and `aria-label`, are supported.

The editable source is `funcd-logo.tsx`. Its `data-part` attributes identify each
shape. Coordinates follow the reference artwork; the square view box removes
excess outer margins while keeping the mark centered. There are no embedded
images, fonts, masks, or background-colored patches.

Run `yarn ui generate:logo` from the repository root after changing the source.
This produces the standalone vector file at `packages/ui/assets/funcd-logo.svg`.
Generation is manual. This asset is kept outside the build output and is not
exported or included in the published package.

Storybook examples are under **Atoms / Logos / Funcd**. The **Showcase** follows
the ActionIcon showcase's labeled-row layout, with light and dark usage,
24–128 px sizes, and accent/monochrome variants for `primary`, `secondary`,
`info`, `warning`, `alert`, and `stone-cold`. Individual stories also provide
controls for the primary logo, icon sizes, and light surfaces, with a palette
selector for the accent color.
