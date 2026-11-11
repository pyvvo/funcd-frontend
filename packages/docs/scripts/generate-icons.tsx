import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { renderToStaticMarkup } from 'react-dom/server';
import FuncdLogo from '../../ui/src/atoms/logo/funcd-logo';

// Safari draws no SVG favicon, so the mark is also rasterized to PNG: on a
// dark tile, which stays visible on a light or a dark tab bar.
const directory = new URL('../public/', import.meta.url);
const icons = [
  { file: 'favicon.png', size: 32, radius: 10 },
  { file: 'apple-touch-icon.png', size: 180, radius: 0 }
];

const Tile = ({ size, radius }: { size: number; radius: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 48 48"
    style={{ display: 'block' }}>
    <rect width="48" height="48" rx={radius} fill="#0a0a0a" />
    <FuncdLogo x={5} y={5} size={38} color="#fafafa" accentColor="#6c5ce7" />
  </svg>
);

mkdirSync(directory, { recursive: true });
// The installed Chrome renders the tiles, so the script downloads no browser.
const browser = await chromium.launch({ channel: 'chrome' });
// One window larger than every icon: each one is cropped from its top-left.
const page = await browser.newPage({ viewport: { width: 512, height: 512 } });
for (const { file, size, radius } of icons) {
  await page.setContent(
    `<body style="margin:0">${renderToStaticMarkup(<Tile size={size} radius={radius} />)}</body>`
  );
  await page.screenshot({
    path: fileURLToPath(new URL(file, directory)),
    omitBackground: true,
    clip: { x: 0, y: 0, width: size, height: size }
  });
}
await browser.close();
