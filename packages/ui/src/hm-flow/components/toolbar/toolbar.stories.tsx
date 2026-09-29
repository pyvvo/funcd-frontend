import type { Meta, StoryObj } from '@storybook/react';
import {
  IconAssembly,
  IconCopy,
  IconDeviceFloppy,
  IconLayoutDistributeVertical,
  IconPlayerPlayFilled
} from '@tabler/icons-react';
import Toolbar from './toolbar';

type Story = StoryObj<typeof Toolbar>;

const meta: Meta<typeof Toolbar> = {
  title: 'HmFlow/Toolbar',
  component: Toolbar
};

export default meta;

export const _Toolbar: Story = {
  render: (args) => (
    <div className="flex justify-center items-center h-screen ">
      <Toolbar {...args} />
    </div>
  ),
  args: {
    actions: [
      {
        name: 'Align',
        variant: 'subtle',
        type: 'layout',
        position: 'right',
        icon: <IconLayoutDistributeVertical size={28} />,
        onClick: () => {}
      },
      {
        name: 'Execute',
        type: 'run',
        position: 'main',
        icon: <IconPlayerPlayFilled size={40} />,
        onClick: () => {}
      },
      {
        name: 'Save',
        variant: 'subtle',
        type: 'save',
        position: 'right',
        icon: <IconDeviceFloppy size={28} />,
        onClick: () => {}
      },
      {
        name: 'Assembly',
        variant: 'subtle',
        type: 'save',
        position: 'right',
        icon: <IconAssembly size={28} />,
        onClick: () => {}
      },
      {
        name: 'Copy',
        variant: 'subtle',
        type: 'save',
        position: 'right',
        icon: <IconCopy size={28} />,
        onClick: () => {}
      }
    ]
  }
};
