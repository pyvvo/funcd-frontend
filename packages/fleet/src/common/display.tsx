import { MantineColor } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
  IconBolt,
  IconDroplet,
  IconRipple,
  IconTemperature,
  TablerIcon
} from '@tabler/icons-react';
import { IApiError } from '../api/client';
import {
  AlertStatusType,
  DeviceKindType,
  DeviceStatusType,
  SeverityType
} from '../api/contract';

export const deviceTypeLabels = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  power: 'Power',
  water: 'Water'
} satisfies Record<DeviceKindType, string>;

export const deviceTypeIcons = {
  temperature: IconTemperature,
  humidity: IconDroplet,
  power: IconBolt,
  water: IconRipple
} satisfies Record<DeviceKindType, TablerIcon>;

export const deviceStatusColors = {
  online: 'green',
  warning: 'orange',
  offline: 'gray'
} satisfies Record<DeviceStatusType, MantineColor>;

export const severityColors = {
  info: 'blue',
  warning: 'orange',
  critical: 'red'
} satisfies Record<SeverityType, MantineColor>;

export const alertStatusColors = {
  open: 'red',
  acknowledged: 'orange',
  resolved: 'green'
} satisfies Record<AlertStatusType, MantineColor>;

export const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

// Notification colors: yellow for load errors, green for create, blue for
// update, red for delete and failures.
export const notifyError = (title: string, error: IApiError) =>
  notifications.show({ title, message: error.message, color: 'yellow' });

export const notifyDone = (
  title: string,
  message: string,
  color: 'green' | 'blue' | 'red'
) => notifications.show({ title, message, color });
