import dayjs from 'dayjs';
import { DeviceKindType, ReadingsType } from '../../api/contract';

interface ICurve {
  unit: string;
  base: number;
  amplitude: number;
  noise: number;
}

const curves = {
  temperature: { unit: '°C', base: 21, amplitude: 4, noise: 0.6 },
  humidity: { unit: '%', base: 50, amplitude: 10, noise: 2 },
  power: { unit: 'W', base: 800, amplitude: 400, noise: 60 },
  water: { unit: 'L/h', base: 120, amplitude: 80, noise: 15 }
} satisfies Record<DeviceKindType, ICurve>;

// A small deterministic noise, so a device's curve is the same on every call.
const noiseAt = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x) - 0.5;
};

// A daily curve (low at night, high in the afternoon) plus noise.
export const readingsFor = (
  deviceId: string,
  type: DeviceKindType,
  range: '24h' | '7d'
): ReadingsType => {
  const { unit, base, amplitude, noise } = curves[type];
  const [count, stepMinutes] = range === '24h' ? [48, 30] : [56, 180];
  const seed = deviceId
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const now = dayjs().startOf('minute');
  const points = Array.from({ length: count }, (_, index) => {
    const time = now.subtract((count - 1 - index) * stepMinutes, 'minute');
    const hour = time.hour() + time.minute() / 60;
    const daily = Math.sin(((hour - 9) / 24) * 2 * Math.PI);
    const value =
      base + amplitude * daily + noise * 2 * noiseAt(seed * 1000 + index);
    return {
      timestamp: time.toISOString(),
      value: Math.round(value * 10) / 10
    };
  });
  return { deviceId, unit, points };
};
