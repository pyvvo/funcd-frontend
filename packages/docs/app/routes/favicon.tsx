import { FuncdLogo } from '@funcd-dev/ui/logo';
import { renderToStaticMarkup } from 'react-dom/server';

// The browser draws the tab icon on its own light or dark bar, so the frame
// takes the color that contrasts with it. Pre-rendered to favicon.svg.
const scheme =
  'svg { color: #0a0a0a } @media (prefers-color-scheme: dark) { svg { color: #fafafa } }';

export function loader() {
  const svg = renderToStaticMarkup(
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <style>{scheme}</style>
      <FuncdLogo size={48} color="currentColor" accentColor="#6c5ce7" />
    </svg>
  );

  return new Response(svg, {
    headers: { 'Content-Type': 'image/svg+xml' }
  });
}
