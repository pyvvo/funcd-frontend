import { PyColorsType } from '@/mantine.theme';
import type { Meta, StoryObj } from '@storybook/react';
import FuncdWordmark from './funcd-wordmark';

const paletteColors: PyColorsType[] = [
  'primary',
  'secondary',
  'info',
  'warning',
  'alert',
  'stone-cold'
];

const meta: Meta<typeof FuncdWordmark> = {
  title: 'Atoms/Logos/Funcd Wordmark',
  component: FuncdWordmark,
  parameters: {
    layout: 'centered',
    backgrounds: {
      options: {
        'funcd-dark': { name: 'Funcd dark', value: '#17151F' },
        'funcd-light': { name: 'Light', value: '#FFFFFF' }
      }
    }
  },
  globals: { backgrounds: { value: 'funcd-dark' } },
  args: { width: 240 },
  argTypes: {
    width: { control: { type: 'number', min: 1 } },
    height: { control: 'text' },
    color: { control: 'color' }
  }
};

export default meta;
type Story = StoryObj<typeof FuncdWordmark>;

export const _FuncdWordmark: Story = {};

export const LightSurface: Story = {
  args: { color: '#17151F' },
  globals: { backgrounds: { value: 'funcd-light' } }
};

export const ThemeColors: Story = {
  globals: { backgrounds: { value: 'funcd-light' } },
  render: (args) => (
    <div className="flex flex-wrap items-center justify-center gap-8">
      {paletteColors.map((color) => (
        <div key={color} className="flex flex-col items-center gap-3">
          <FuncdWordmark
            {...args}
            width={144}
            color={`var(--mantine-color-${color}-9)`}
            aria-label={`Funcd ${color} wordmark`}
          />
          <span className="text-sm capitalize text-gray-600">
            {color.replace('-', ' ')}
          </span>
        </div>
      ))}
    </div>
  )
};
