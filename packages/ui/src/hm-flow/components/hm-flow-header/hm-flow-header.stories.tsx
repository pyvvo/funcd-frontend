import {
  HmFlowBase,
  HmFlowProvider,
  INodeAction,
  IPyNode,
  NodeWrapper,
  PyNode,
  useNodesService
} from '@/hm-flow';
import { nodeModels, parseNodes } from '@/story-utils/payload/workflow.payload';
import type { Meta, StoryObj } from '@storybook/react';
import {
  IconClick,
  IconCopy,
  IconPencil,
  IconPlus,
  IconTrash
} from '@tabler/icons-react';
import { NodeTypes } from '@xyflow/react';
import { HeaderStatus } from '../header-status';
import { HmFlowBottom, IHmFlowBottomItem } from '../hm-flow-bottom';
import { HmFlowModal, IHmFlowModalItem } from '../hm-flow-modal';
import { HmFlowSideBar, IHmFlowSideBarItem } from '../hm-flow-sidebar';
import { NodeEditor } from '../node-editor';
import { NodesSearch } from '../node-search';
import HmFlowHeader, { IHmFlowHeaderProps } from './hm-flow-header';
import { IHmFlowHeaderItem } from './hm-flow-header.type';
import { IHeaderAction } from '../header-status/header-status.types';

type Story = StoryObj<IHmFlowHeaderProps>;

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

const headerActions: IHeaderAction[] = [
  {
    name: 'Edit Canvas Config',
    type: 'edit',
    icon: <IconPencil size={16} stroke={1.5} />,
    onClick: () => {}
  }
];

const meta: Meta<typeof HmFlowHeader> = {
  title: 'HmFlow/HmFlowHeader',
  component: HmFlowHeader,
  render: (args) => {
    const { items: _, ...restArgs } = args;
    const searchItems: IPyNode[] = parseNodes(nodeModels);
    const { actions, onNodeDoubleClick, onUpdateNode, searchNode } =
      useNodesService({
        defaultActions
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

    const bottomItems: IHmFlowBottomItem[] = [];

    const headerItems: IHmFlowHeaderItem[] = [
      {
        name: 'headerStatus',
        component: () => (
          <HeaderStatus
            title="My first workflow 😎"
            textStatus="success"
            color="orange"
            actions={headerActions}
          />
        )
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
            headerComponent={() => (
              <HmFlowHeader {...restArgs} items={headerItems} />
            )}
            bottomComponent={() => <HmFlowBottom items={bottomItems} />}
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
