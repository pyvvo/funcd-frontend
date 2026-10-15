import dayjs from 'dayjs';
import {
  AlertRuleInputType,
  AlertStatusType,
  AutomationInputType,
  DeviceInputType,
  DeviceStatusType,
  StatsType
} from '../api/contract';
import { alertRules, alertsFor } from './data/alerts';
import { automations } from './data/automations';
import { devices } from './data/devices';
import { readingsFor } from './data/readings';
import { sites } from './data/sites';

// The mock API's data, in memory: changes last until the page reloads.
const state = {
  devices: structuredClone(devices),
  alerts: alertsFor(devices),
  rules: structuredClone(alertRules),
  automations: structuredClone(automations)
};

interface IDeviceQuery {
  search?: string;
  siteId?: string;
  status?: DeviceStatusType;
  offset?: number;
  limit?: number;
}

const nextId = (prefix: string, count: number) =>
  `${prefix}-${String(count + 1).padStart(3, '0')}-${Date.now().toString(36)}`;

const findDevice = (id: string) =>
  state.devices.find((device) => device.id === id);

export const db = {
  sites: () =>
    sites.map((site) => ({
      ...site,
      deviceCount: state.devices.filter((device) => device.siteId === site.id)
        .length
    })),

  listDevices: (query: IDeviceQuery) => {
    const { search, siteId, status, offset = 0, limit = 10 } = query;
    const term = search?.toLowerCase();
    const matches = state.devices.filter(
      (device) =>
        (!term ||
          device.name.toLowerCase().includes(term) ||
          device.id.includes(term)) &&
        (!siteId || device.siteId === siteId) &&
        (!status || device.status === status)
    );
    return {
      items: matches.slice(offset, offset + limit),
      total: matches.length,
      offset,
      limit
    };
  },
  findDevice,
  createDevice: (input: DeviceInputType) => {
    const device = {
      ...input,
      id: nextId('dev', state.devices.length),
      status: 'online' as const,
      firmware: '2.4.0',
      battery: 100,
      lastSeenAt: dayjs().toISOString()
    };
    state.devices.unshift(device);
    return device;
  },
  updateDevice: (id: string, input: DeviceInputType) => {
    const device = findDevice(id);
    return device && Object.assign(device, input);
  },
  removeDevice: (id: string) => {
    const device = findDevice(id);
    state.devices = state.devices.filter((item) => item.id !== id);
    return device && { id };
  },
  restartDevice: (id: string) => {
    const device = findDevice(id);
    return (
      device &&
      Object.assign(device, {
        status: 'online' as const,
        lastSeenAt: dayjs().toISOString()
      })
    );
  },
  readings: (id: string, range: '24h' | '7d') => {
    const device = findDevice(id);
    return device && readingsFor(device.id, device.type, range);
  },

  listAlerts: (query: { status?: AlertStatusType; deviceId?: string }) =>
    state.alerts.filter(
      (alert) =>
        (!query.status || alert.status === query.status) &&
        (!query.deviceId || alert.deviceId === query.deviceId)
    ),
  setAlertStatus: (id: string, status: AlertStatusType) => {
    const alert = state.alerts.find((item) => item.id === id);
    return alert && Object.assign(alert, { status });
  },

  listRules: () => state.rules,
  createRule: (input: AlertRuleInputType) => {
    const rule = { ...input, id: nextId('rule', state.rules.length) };
    state.rules.push(rule);
    return rule;
  },
  updateRule: (id: string, input: AlertRuleInputType) => {
    const rule = state.rules.find((item) => item.id === id);
    return rule && Object.assign(rule, input);
  },

  listAutomations: () => state.automations,
  findAutomation: (id: string) =>
    state.automations.find((automation) => automation.id === id),
  updateAutomation: (id: string, input: AutomationInputType) => {
    const automation = state.automations.find((item) => item.id === id);
    return (
      automation &&
      Object.assign(automation, input, { updatedAt: dayjs().toISOString() })
    );
  },
  removeAutomation: (id: string) => {
    const automation = state.automations.find((item) => item.id === id);
    state.automations = state.automations.filter((item) => item.id !== id);
    return automation && { id };
  },

  stats: (): StatsType => {
    const count = (status: DeviceStatusType) =>
      state.devices.filter((device) => device.status === status).length;
    const reporting = state.devices.filter(
      (device) => device.status !== 'offline'
    );
    const readingsPerHour = reporting.reduce(
      (sum, device) => sum + Math.round(3600 / device.reportingIntervalSec),
      0
    );
    const types = ['temperature', 'humidity', 'power', 'water'] as const;
    return {
      online: count('online'),
      offline: count('offline'),
      warning: count('warning'),
      openAlerts: state.alerts.filter((alert) => alert.status === 'open')
        .length,
      readingsPerHour,
      byType: types.map((type) => ({
        type,
        count: state.devices.filter((device) => device.type === type).length
      })),
      // Busier during the day, when more devices report on events.
      activity: Array.from({ length: 24 }, (_, index) => {
        const time = dayjs()
          .startOf('hour')
          .subtract(23 - index, 'hour');
        const daily =
          1 + 0.15 * Math.sin(((time.hour() - 9) / 24) * 2 * Math.PI);
        return {
          hour: time.format('HH:mm'),
          readings: Math.round(readingsPerHour * daily)
        };
      })
    };
  }
};
