import Chance from 'chance';
import dayjs from 'dayjs';
import { DeviceKindType, DeviceType } from '../../api/contract';
import { sites } from './sites';

// A fixed seed: the same fleet on every reload.
const chance = new Chance(42);

const zones = [
  'Cold room',
  'Loading bay',
  'Server room',
  'Boiler room',
  'Office',
  'Roof',
  'Basement',
  'Lab'
];

const typeLabels = {
  temperature: 'temperature',
  humidity: 'humidity',
  power: 'power meter',
  water: 'water meter'
} satisfies Record<DeviceKindType, string>;

const types = Object.keys(typeLabels) as DeviceKindType[];

export const devices: DeviceType[] = Array.from({ length: 40 }, (_, index) => {
  const type = types[index % types.length];
  const site = sites[index % sites.length];
  const status = chance.weighted(
    ['online', 'offline', 'warning'] as const,
    [80, 10, 10]
  );
  return {
    id: `dev-${String(index + 1).padStart(3, '0')}`,
    name: `${chance.pickone(zones)} ${typeLabels[type]}`,
    type,
    siteId: site.id,
    status,
    firmware: `2.${chance.integer({ min: 0, max: 4 })}.${chance.integer({ min: 0, max: 9 })}`,
    battery:
      status === 'warning'
        ? chance.integer({ min: 4, max: 15 })
        : chance.integer({ min: 30, max: 100 }),
    lastSeenAt: dayjs()
      .subtract(
        status === 'offline'
          ? chance.integer({ min: 120, max: 2880 })
          : chance.integer({ min: 0, max: 20 }),
        'minute'
      )
      .toISOString(),
    reportingIntervalSec: chance.pickone([30, 60, 300, 900]),
    tags: chance.pickset(['critical', 'outdoor', 'battery', 'legacy'], 1)
  };
});
