import { SiteType } from '../../api/contract';

// The device count is computed by the database.
export const sites: Omit<SiteType, 'deviceCount'>[] = [
  { id: 'lyon-warehouse', name: 'Lyon warehouse', city: 'Lyon' },
  { id: 'paris-hq', name: 'Paris HQ', city: 'Paris' },
  { id: 'nantes-plant', name: 'Nantes plant', city: 'Nantes' },
  { id: 'lille-depot', name: 'Lille depot', city: 'Lille' },
  { id: 'marseille-port', name: 'Marseille port', city: 'Marseille' }
];
