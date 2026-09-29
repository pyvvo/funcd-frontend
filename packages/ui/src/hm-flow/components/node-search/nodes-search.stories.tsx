import type { Meta, StoryObj } from '@storybook/react';
import { nodeModels, parseNodes } from '@/story-utils/payload/workflow.payload';
import NodesSearch from './nodes-search';
import { defaultActions } from '@/hm-flow/hm-flow';
import { IPyNode } from '@/hm-flow/node';

type Story = StoryObj<typeof NodesSearch>;

const meta: Meta<typeof NodesSearch> = {
  title: 'HmFlow/NodesSearch',
  component: NodesSearch
};

export default meta;

const searchItems: IPyNode[] = parseNodes(nodeModels);

export const _NodesSearch: Story = {
  args: {
    searchItems: searchItems,
    actions: defaultActions
  }
};
