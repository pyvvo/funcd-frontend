import { Suspense, useEffect, useState, type ReactNode } from 'react';

// Renders its children in the browser only, once the page has hydrated.
const ClientOnly = ({ children }: { children: ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return mounted ? <Suspense fallback={null}>{children}</Suspense> : null;
};

export default ClientOnly;
