import type { Meta, StoryObj } from '@storybook/react';
import type { PyColorsType } from '../../mantine.theme';
import FuncdLogo from './funcd-logo';

const paletteColors: PyColorsType[] = [
  'primary',
  'secondary',
  'info',
  'warning',
  'alert',
  'stone-cold'
];

const paletteValues = Object.fromEntries(
  paletteColors.map((color) => [color, `var(--mantine-color-${color}-9)`])
);

const meta: Meta<typeof FuncdLogo> = {
  title: 'Atoms/Logos/Funcd',
  component: FuncdLogo,
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
  args: { accentColor: 'primary' },
  argTypes: {
    size: { control: { type: 'number', min: 1 } },
    color: { control: 'color' },
    accentColor: {
      options: paletteColors,
      mapping: paletteValues,
      control: { type: 'select' }
    }
  }
};

export default meta;
type Story = StoryObj<typeof FuncdLogo>;

export const Primary: Story = {
  args: { size: 320 }
};

export const Showcase: Story = {
  name: 'Showcase',
  parameters: { layout: 'padded' },
  globals: { backgrounds: { value: 'funcd-light' } },
  render: () => {
    function Main() {
      return (
        <div className="flex h-full flex-col items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6 text-gray-900">
          <div className="w-full">
            <h6 className="font-semibold">Usage</h6>
            <div className="mt-2 grid gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-center space-x-4 rounded-xl bg-white p-6">
                <FuncdLogo size={72} color="#17151F" aria-hidden="true" />
                <span className="text-2xl font-semibold">funcd</span>
              </div>
              <div
                className="flex items-center justify-center space-x-4 rounded-xl p-6 text-white"
                style={{ background: '#17151F' }}>
                <FuncdLogo size={72} aria-hidden="true" />
                <span className="text-2xl font-semibold">funcd</span>
              </div>
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Sizes</h6>
            <div className="mt-2 flex flex-wrap items-end justify-center gap-8 rounded-xl bg-white p-6">
              {[24, 32, 48, 64, 128].map((size) => (
                <div key={size} className="flex flex-col items-center gap-3">
                  <FuncdLogo size={size} color="#17151F" />
                  <span className="text-sm text-gray-600">{size}px</span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full">
            <h6 className="font-semibold">Colors</h6>
            <p className="mt-2 text-sm text-gray-600">Theme accents</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-8 rounded-xl bg-white p-6">
              {paletteColors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-3">
                  <FuncdLogo
                    size={80}
                    color="#17151F"
                    accentColor={paletteValues[color]}
                    aria-label={`Funcd ${color} accent`}
                  />
                  <span className="text-sm capitalize text-gray-600">
                    {color.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600">Monochrome</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-8 rounded-xl bg-white p-6">
              {paletteColors.map((color) => (
                <div key={color} className="flex flex-col items-center gap-3">
                  <FuncdLogo
                    size={80}
                    color={paletteValues[color]}
                    accentColor={paletteValues[color]}
                    aria-label={`Funcd ${color} monochrome`}
                  />
                  <span className="text-sm capitalize text-gray-600">
                    {color.replace('-', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return <Main />;
  }
};

export const IconSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {[24, 32, 48, 64, 128].map((size) => (
        <div key={size} style={{ color: '#FFFFFF', textAlign: 'center' }}>
          <FuncdLogo {...args} size={size} />
          <div style={{ fontSize: 12, marginTop: 12 }}>{size}px</div>
        </div>
      ))}
    </div>
  )
};

export const LightSurface: Story = {
  args: { size: 192, color: '#17151F' },
  globals: { backgrounds: { value: 'funcd-light' } }
};
