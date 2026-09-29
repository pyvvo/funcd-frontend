import type { Meta, StoryObj } from '@storybook/react';
import { IconPencil } from '@tabler/icons-react';
import FlowCard from './card';

type Story = StoryObj<typeof FlowCard>;

const meta: Meta<typeof FlowCard> = {
  /* 👇 The title prop is optional.
   * See https://storybook.js.org/docs/7.0/react/configure/overview#configure-story-loading
   * to learn how to generate automatic titles
   */
  title: 'Molecules/FlowCard',
  component: FlowCard
};

export default meta;

export const _FlowCard: Story = {
  args: {
    flowName: 'Flow Name',
    lastUpdated: new Date(),
    onClick: (param: any) => {
      console.log('Selected Flow:', param);
    },
    onDelete: (id: string) => {
      console.log('Delete', id);
    }
  }
};

export const Basic: Story = {
  render: () => (
    <div>
      <FlowCard
        flowName="New workflow"
        leftIcon={<IconPencil size={18} />}
        withRightSection={false}
        subtitle="Create new workflow"
        onClick={() => {
          console.log('Clicked');
        }}
        onDelete={() => {
          console.log('Deleted');
        }}
      />
    </div>
  )
};
