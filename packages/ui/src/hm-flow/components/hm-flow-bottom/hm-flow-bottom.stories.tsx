import {
  HmFlowBase,
  HmFlowProvider,
  INodeAction,
  IPyNode,
  NodeWrapper,
  PyNode,
  useHmFlowService,
  useNodesService
} from '@/hm-flow';
import { nodeModels, parseNodes } from '@/story-utils/payload/workflow.payload';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconClick,
  IconCopy,
  IconDeviceFloppy,
  IconLayoutDistributeVertical,
  IconPencil,
  IconPlayerPlayFilled,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import { NodeTypes } from '@xyflow/react';
import { HmFlowHeader, IHmFlowHeaderItem } from '../hm-flow-header';
import { HmFlowModal, IHmFlowModalItem } from '../hm-flow-modal';
import { HmFlowSideBar, IHmFlowSideBarItem } from '../hm-flow-sidebar';
import { NodeEditor } from '../node-editor';
import { NodesSearch } from '../node-search';
import { Toolbar } from '../toolbar';
import { IToolbarAction } from '../toolbar/toolbar.types';
import HmFlowBottom, { IHmFlowBottomProps } from './hm-flow-bottom';
import { IHmFlowBottomItem } from './hm-flow-bottom.type';

type Story = StoryObj<IHmFlowBottomProps>;

const defaultActions: INodeAction[] = [
  {
    label: 'Edit',
    type: 'edit',
    icon: <IconPencil size={18} stroke={1.9} />,
    variant: 'subtle',
    onClick(id) {
      console.log('edit', id);
    }
  },
  {
    label: 'Duplicate',
    type: 'duplicate',
    icon: <IconCopy size={18} stroke={1.9} />,
    variant: 'subtle',
    onClick() {
      console.log('duplicate');
    }
  },
  {
    label: 'Delete',
    type: 'delete',
    icon: <IconTrash size={18} stroke={1.9} />,
    variant: 'filled',
    color: 'alert',
    onClick() {
      console.log('delete');
    }
  },
  {
    label: 'Add',
    type: 'add',
    icon: <IconPlus size={18} stroke={1.9} />,
    variant: 'filled',
    onClick() {
      console.log('add');
    }
  },
  {
    label: 'Select search Item',
    type: 'selectSearchItem',
    icon: <IconClick size={18} stroke={1.9} />,
    variant: 'filled',
    onClick() {
      console.log('add');
    }
  }
];

const bottomActions: IToolbarAction[] = [
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
  }
];

const meta: Meta<typeof HmFlowBottom> = {
  title: 'HmFlow/HmFlowBottom',
  component: HmFlowBottom,
  render: (args) => {
    const { items: _, ...restArgs } = args;
    const searchItems: IPyNode[] = parseNodes(nodeModels);
    const { actions, onNodeDoubleClick, onUpdateNode, searchNode } =
      useNodesService({
        defaultActions
      });

    const { bottomAction } = useHmFlowService({
      bottomActions
    });

    const nodeTypes: NodeTypes = {
      pyNode: (args) => (
        <NodeWrapper {...args} NodeType={PyNode} actions={actions} />
      )
    };

    const items: IHmFlowSideBarItem[] = [
      {
        name: 'nodesSearch',
        component: () => (
          <NodesSearch searchItems={searchItems} actions={actions} />
        )
      }
    ];

    const headerItems: IHmFlowHeaderItem[] = [];

    const bottomItems: IHmFlowBottomItem[] = [
      {
        name: 'toolbar',
        component: () => <Toolbar actions={bottomAction} />
      }
    ];

    const modalItems: IHmFlowModalItem[] = [
      {
        name: 'nodeEditor',
        component: (params) => (
          <NodeEditor {...params} onUpdateNode={onUpdateNode} />
        )
      }
    ];

    return (
      <div style={{ height: 'calc(100vh - 40px)' }}>
        <HmFlowProvider nodeTypes={nodeTypes}>
          <HmFlowBase
            onCanvasDoubleClick={searchNode}
            onNodeDoubleClick={onNodeDoubleClick}
            sideBarComponent={({ ...rest }) => (
              <HmFlowSideBar {...rest} items={items} />
            )}
            headerComponent={() => <HmFlowHeader items={headerItems} />}
            bottomComponent={() => {
              return <HmFlowBottom {...restArgs} items={bottomItems} />;
            }}
            modalComponent={({ ...rest }) => (
              <HmFlowModal {...rest} items={modalItems} />
            )}
          />
        </HmFlowProvider>
      </div>
    );
  }
};

export default meta;

export const Default: Story = {
  args: {}
};
