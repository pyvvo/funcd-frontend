import Chance from 'chance';
import dayjs from 'dayjs';
import { AlertRuleType, AlertType, DeviceType } from '../../api/contract';

const chance = new Chance(7);

const messages = {
  online: ['Value above threshold', 'Value below threshold'],
  warning: ['Battery below 15%', 'Unstable readings'],
  offline: ['No data for 2 hours', 'Connection lost']
} satisfies Record<DeviceType['status'], string[]>;

export const alertsFor = (devices: DeviceType[]): AlertType[] =>
  chance
    .pickset(devices, 15)
    .map(
      (device, index): AlertType => ({
        id: `alert-${String(index + 1).padStart(3, '0')}`,
        deviceId: device.id,
        deviceName: device.name,
        severity:
          device.status === 'offline'
            ? ('critical' as const)
            : chance.pickone(['info', 'warning'] as const),
        message: chance.pickone(messages[device.status]),
        status: chance.weighted(
          ['open', 'acknowledged', 'resolved'] as const,
          [50, 25, 25]
        ),
        createdAt: dayjs()
          .subtract(chance.integer({ min: 5, max: 4320 }), 'minute')
          .toISOString()
      })
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

export const alertRules: AlertRuleType[] = [
  {
    id: 'rule-cold-room',
    name: 'Cold room too warm',
    metric: 'temperature',
    operator: '>',
    threshold: 8,
    severity: 'critical',
    enabled: true
  },
  {
    id: 'rule-humidity',
    name: 'Humidity too high',
    metric: 'humidity',
    operator: '>',
    threshold: 70,
    severity: 'warning',
    enabled: true
  },
  {
    id: 'rule-power-peak',
    name: 'Power peak',
    metric: 'power',
    operator: '>',
    threshold: 1500,
    severity: 'info',
    enabled: false
  }
];
