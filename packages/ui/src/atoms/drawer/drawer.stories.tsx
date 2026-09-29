/* oxlint-disable @typescript-eslint/no-shadow */
/* oxlint-disable react/button-has-type */
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Drawer } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

type Story = StoryObj<typeof Drawer>;

const meta: Meta<typeof Drawer> = {
  title: 'Atoms/Drawer',
  component: Drawer,
  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', '100%'],
      control: { type: 'select' },
      description: 'Change the size of the Drawer'
    },
    radius: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
      description: 'Adjust the border radius of the Drawer'
    },
    position: {
      options: ['left', 'top', 'bottom', 'right'],
      control: { type: 'select' },
      description: 'Set the position of the Drawer'
    },
    offset: {
      control: { type: 'number' },
      description: 'The drawer offset'
    }
  }
};

export default meta;

export const _Drawer: Story = {
  render: (args) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Button onClick={open}>Open Drawer</Button>
        <Drawer
          opened={opened}
          onClose={close}
          size={args.size}
          radius={args.radius}
          position={args.position}
          offset={args.offset}
          styles={{ inner: { left: 0 } }}>
          <p>This is the content of the Drawer. Customize me!</p>
        </Drawer>
      </>
    );
  },
  args: {
    size: 'md',
    radius: 'md',
    position: 'right'
  }
};
