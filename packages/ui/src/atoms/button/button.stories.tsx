/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type Story = StoryObj<typeof Button>;

const meta: Meta<typeof Button> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/Button',
  component: Button
};
export default meta;

export const _Button: Story = {
  args: {
    size: 'md',
    radius: 'xl',
    children: 'Buttons'
  },
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    'data-color': {
      control: {
        type: 'select'
      },
      options: ['secondary', 'alert', 'info', 'warning']
    },
    radius: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' }
    },
    variant: {
      options: ['default', 'elevated', 'filled', 'secondary', 'subtle'],
      control: { type: 'select' }
    },
    disabled: {
      options: ['true', 'false'],
      control: { type: 'boolean' }
    },
    children: {
      control: { type: 'text' }
    }
  },
  render: (args) => {
    return <Button {...args} />;
  }
};

export const Showcase: Story = {
  name: 'Showcase',
  render: () => {
    function Main() {
      return (
        <div className="flex h-full flex-col  items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6">
          <div className="w-full">
            <h6 className="font-semibold">Usage</h6>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <Button>Primary</Button>
              <Button mod={{ color: 'secondary' }}>Secondary color</Button>
              <Button mod={{ color: 'info' }}>Info color</Button>
              <Button mod={{ color: 'alert' }}>Alert color</Button>
              <Button mod={{ color: 'warning' }}>Warning color</Button>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <Button variant="secondary">Secondary button</Button>
              <Button variant="secondary" mod={{ color: 'secondary' }}>
                Secondary color
              </Button>
              <Button variant="secondary" mod={{ color: 'info' }}>
                Info color
              </Button>
              <Button variant="secondary" mod={{ color: 'alert' }}>
                Alert color
              </Button>
              <Button variant="secondary" mod={{ color: 'warning' }}>
                Warning color
              </Button>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <Button variant="default">Default button</Button>
              <Button variant="default" mod={{ color: 'secondary' }}>
                Secondary color
              </Button>
              <Button variant="default" mod={{ color: 'info' }}>
                Info color
              </Button>
              <Button variant="default" mod={{ color: 'alert' }}>
                Alert color
              </Button>
              <Button variant="default" mod={{ color: 'warning' }}>
                Warning color
              </Button>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <Button variant="subtle">Subtitle button</Button>
              <Button variant="subtle" mod={{ color: 'secondary' }}>
                Secondary color
              </Button>
              <Button variant="subtle" mod={{ color: 'info' }}>
                Info color
              </Button>
              <Button variant="subtle" mod={{ color: 'alert' }}>
                Alert color
              </Button>
              <Button variant="subtle" mod={{ color: 'warning' }}>
                Warning color
              </Button>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <Button variant="elevated">Elevated button</Button>
              <Button variant="elevated" mod={{ color: 'secondary' }}>
                Secondary color
              </Button>
              <Button variant="elevated" mod={{ color: 'info' }}>
                Info color
              </Button>
              <Button variant="elevated" mod={{ color: 'alert' }}>
                Alert color
              </Button>
              <Button variant="elevated" mod={{ color: 'warning' }}>
                Warning color
              </Button>
            </div>
          </div>
        </div>
      );
    }
    return <Main />;
  }
};
