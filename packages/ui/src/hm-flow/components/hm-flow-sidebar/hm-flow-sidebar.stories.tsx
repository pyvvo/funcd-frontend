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
import { HmFlowBottom, IHmFlowBottomItem } from '../hm-flow-bottom';
import { HmFlowHeader, IHmFlowHeaderItem } from '../hm-flow-header';
import { HmFlowModal, IHmFlowModalItem } from '../hm-flow-modal';
import { NodeEditor } from '../node-editor';
import { NodesSearch } from '../node-search';
import HmFlowSideBar, { IHmFlowSideBarProps } from './hm-flow-sidebar';
import { IHmFlowSideBarItem } from './hm-flow-sidebar.type';

type Story = StoryObj<IHmFlowSideBarProps>;

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

const meta: Meta<typeof HmFlowSideBar> = {
  title: 'HmFlow/HmFlowSideBar',
  component: HmFlowSideBar,
  render: (args) => {
    const { items: _, ...restArgs } = args;
    const searchItems: IPyNode[] = parseNodes(nodeModels);
    const { actions, onNodeDoubleClick, onUpdateNode, searchNode } =
      useNodesService({
        defaultActions
      });

    const modalItems: IHmFlowModalItem[] = [
      {
        name: 'nodeEditor',
        component: (params) => (
          <NodeEditor {...params} onUpdateNode={onUpdateNode} />
        )
      }
    ];

    const headerItems: IHmFlowHeaderItem[] = [];

    const bottomItems: IHmFlowBottomItem[] = [];

    const nodeTypes: NodeTypes = {
      pyNode: (args) => (
        <NodeWrapper {...args} NodeType={PyNode} actions={actions} />
      )
    };

    const items: IHmFlowSideBarItem[] = [
      {
        name: 'nodesSearch',
        component: (params) => {
          return (
            <NodesSearch
              {...params}
              searchItems={searchItems}
              actions={actions}
            />
          );
        }
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
            bottomComponent={() => <HmFlowBottom items={bottomItems} />}
            modalComponent={(params) => {
              return (
                <HmFlowModal {...restArgs} {...params} items={modalItems} />
              );
            }}
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
