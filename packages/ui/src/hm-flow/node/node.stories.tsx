import {
  IReactFlowDecorator,
  ReactFlowDecorator
} from '@/story-utils/decorators/react-flow-decorator';
import type { Meta, StoryObj } from '@storybook/react';
import { IconCopy, IconPencil, IconTrash } from '@tabler/icons-react';
import { Edge, Node } from '@xyflow/react';
import PyNode from './node';
import { PyNodeType } from './types';

type ReactFlowComponetType<T> = { nodes: Node[]; edges: Edge[] } & T;

type PyNodeComponentType = typeof PyNode;

type Story = StoryObj<ReactFlowComponetType<PyNodeType>>;

const nodes = [
  {
    id: '1',
    type: 'defaultNode',
    position: { x: 0, y: 0 },
    data: { label: '1' }
  },
  {
    id: '2',
    type: 'defaultNode',
    position: { x: 0, y: 100 },
    data: { label: '2' }
  }
];

const edges = [{ id: 'e1-2', source: '1', target: '2' }];

const decoratorInput = {
  nodes,
  edges
} satisfies IReactFlowDecorator;

const meta: Meta<PyNodeComponentType> = {
  title: 'HmFlow/PyNode',
  component: PyNode,
  decorators: [ReactFlowDecorator(decoratorInput)],
  parameters: {
    deepControls: { enabled: true }
  },
  argTypes: {
    selected: { control: 'boolean' }
  }
};

export default meta;

export const _PyNode: Story = {
  args: {
    selected: false,

    data: {
      name: 'gmail',
      icon: 'https://mailmeteor.com/logos/assets/PNG/Gmail_Logo_512px.png',
      color: '#ff0000',
      label: 'Gmail',
      image: '',
      parameters: {},
      actions: [
        {
          label: 'Edit',
          variant: 'subtle',
          icon: <IconPencil size={18} stroke={1.9} />,
          onClick: () => console.log('edit'),
          type: 'edit'
        },
        {
          label: 'Duplicate',
          variant: 'subtle',
          icon: <IconCopy size={18} stroke={1.9} />,
          onClick: () => console.log('duplicate'),
          type: 'duplicate'
        },
        {
          label: 'Delete',
          icon: <IconTrash size={18} stroke={1.9} />,
          variant: 'filled',
          color: 'alert',
          onClick: () => console.log('delete'),
          type: 'delete'
        }
      ]
    }
  }
};
