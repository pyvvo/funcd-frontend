import type { Meta, StoryObj } from '@storybook/react';
import { IconPencil } from '@tabler/icons-react';
import HeaderStatus from './header-status';

type Story = StoryObj<typeof HeaderStatus>;

const meta: Meta<typeof HeaderStatus> = {
  title: 'HmFlow/HeaderStatus',
  component: HeaderStatus,
  argTypes: {
    color: {
      control: {
        type: 'select'
      },
      options: ['green', 'red', 'yellow', 'purple', 'orange']
    }
  }
};

export default meta;

export const _HeaderStatus: Story = {
  render: (args) => {
    return (
      <div className="flex justify-center items-center h-screen ">
        <HeaderStatus {...args} />
      </div>
    );
  },
  args: {
    title: 'My Workflow',
    textStatus: 'Running',
    color: 'green',
    actions: [
      {
        name: 'Edit Canvas Config',
        type: 'edit',
        icon: <IconPencil size={16} stroke={1.5} />,
        onClick: () => {}
      }
    ]
  }
};
