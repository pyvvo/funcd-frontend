import type { Meta, StoryObj } from '@storybook/react';
import { ActionIcon } from '@mantine/core';
import { IconFingerprint } from '@tabler/icons-react';

type Story = StoryObj<typeof ActionIcon>;

const meta: Meta<typeof ActionIcon> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Atoms/ActionIcon',
  component: ActionIcon,
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
    }
  },
  render: (args) => {
    return (
      <ActionIcon {...args}>
        <IconFingerprint size={20} />
      </ActionIcon>
    );
  }
};

export const _ActionIcon: Story = {
  args: {
    size: 'md',
    radius: 'xl'
  }
};

export default meta;

export const Showcase: Story = {
  name: 'Showcase',
  render: () => {
    function Main() {
      return (
        <div className="flex h-full flex-col  items-center justify-start space-y-10 rounded-xl bg-gray-100 p-6">
          <div className="w-full">
            <h6 className="font-semibold">Usage</h6>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white ">
              <ActionIcon>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon mod={{ color: 'secondary' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon mod={{ color: 'info' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon mod={{ color: 'alert' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon mod={{ color: 'warning' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <ActionIcon variant="secondary">
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="secondary" mod={{ color: 'secondary' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="secondary" mod={{ color: 'info' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="secondary" mod={{ color: 'alert' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="secondary" mod={{ color: 'warning' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <ActionIcon variant="default">
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="default" mod={{ color: 'secondary' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="default" mod={{ color: 'info' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="default" mod={{ color: 'alert' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="default" mod={{ color: 'warning' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <ActionIcon variant="subtle">
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" mod={{ color: 'default' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" mod={{ color: 'secondary' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" mod={{ color: 'info' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" mod={{ color: 'alert' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="subtle" mod={{ color: 'warning' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <ActionIcon variant="elevated">
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="elevated" mod={{ color: 'secondary' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="elevated" mod={{ color: 'info' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="elevated" mod={{ color: 'alert' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="elevated" mod={{ color: 'warning' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
            </div>
            <div className="mt-2 flex h-24 items-center justify-center space-x-4 rounded-xl bg-white">
              <ActionIcon variant="light">
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="light" mod={{ color: 'secondary' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="light" mod={{ color: 'info' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="light" mod={{ color: 'alert' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
              <ActionIcon variant="light" mod={{ color: 'warning' }}>
                <IconFingerprint size={20} />
              </ActionIcon>
            </div>
          </div>
        </div>
      );
    }
    return <Main />;
  }
};
