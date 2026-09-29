import { IReactiveFieldMeta } from '@/reactive-form';
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
import { FC, useCallback, useMemo } from 'react';
import {
  HeaderStatus,
  HmFlowBottom,
  HmFlowHeader,
  HmFlowHeaderStatus,
  HmFlowModal,
  HmFlowSideBar,
  IHmFlowBottomItem,
  IHmFlowHeaderItem,
  IHmFlowSideBarItem,
  NodeEditor,
  NodesSearch,
  Toolbar
} from './components';
import CanvasForm from './components/canvas-form/canvas-form';
import { IHeaderAction } from './components/header-status/header-status.types';
import { IToolbarAction } from './components/toolbar/toolbar.types';
import HmFlowBase from './hm-flow-base';
import { ICanvasConfigs, IHmFlowData, IHmFlowMetadata } from './hm-flow.types';
import { useNodesService } from './hooks';
import { useHmFlowService } from './hooks/use-hm-flow-service';
import {
  ActionHandlerDepsType,
  INodeAction,
  IPyNode,
  NodeWrapper,
  PyNode
} from './node';
import { HmFlowProvider } from './provider';

export interface IHmFlow {
  searchItems: IPyNode[];
  defaultHmFlowData: IHmFlowData;
  canvasConfig?: ICanvasConfigs;
  color?: HmFlowHeaderStatus;
  textStatus: string;
  onCanvasDoubleClicked?: (deps: ActionHandlerDepsType) => void;
  onHmflowSave?: (flow: IHmFlowData) => void;
  onHmflowRun?: (flow: IHmFlowData) => void;
  onHmflowDelete?: () => void;
}

export const defaultActions: INodeAction[] = [
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
    name: 'Align',
    variant: 'subtle',
    type: 'layout',
    position: 'right',
    icon: <IconLayoutDistributeVertical size={28} />,
    onClick: () => {}
  },
  {
    name: 'Delete',
    variant: 'subtle',
    type: 'deleteFlow',
    position: 'right',
    icon: <IconTrash color="red" size={28} />,
    onClick: () => {
      console.log('trash');
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

const flowMetadaForm: IReactiveFieldMeta<IHmFlowMetadata>[] = [
  {
    name: 'Flow Metadata',
    fields: [
      {
        fieldKey: 'name',
        label: 'Name',
        type: 'text',
        options: {
          required: true
        }
      },
      {
        fieldKey: 'version',
        label: 'Version',
        type: 'text'
      },
      {
        fieldKey: 'description',
        label: 'Description',
        type: 'textarea',
        options: {
          maxLength: 300
        },
        customProps: {
          minRows: 4,
          maxRows: 5
        }
      }
    ]
  }
];

const HmFlow: FC<IHmFlow> = (props) => {
  const {
    searchItems,
    defaultHmFlowData,
    canvasConfig = {},
    textStatus,
    color,
    onHmflowSave,
    onHmflowRun,
    onCanvasDoubleClicked,
    onHmflowDelete
  } = props;

  const { actions, onNodeDoubleClick, onUpdateNode, searchNode } =
    useNodesService({
      defaultActions
    });

  const { bottomAction, headerAction, hmflowData } = useHmFlowService({
    bottomActions,
    headerActions,
    onHmflowSave,
    onHmflowRun,
    onHmflowDelete,
    defaultHmFlowMetadata: defaultHmFlowData.metadata
  });

  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      pyNode: (args) => (
        <NodeWrapper {...args} NodeType={PyNode} actions={actions} />
      )
    }),
    [actions]
  );

  const sideItems: IHmFlowSideBarItem[] = [
    {
      name: 'nodesSearch',
      component: () => (
        <NodesSearch searchItems={searchItems} actions={actions} />
      )
    },
    {
      name: 'flowFormMetadata',
      component: () => (
        <CanvasForm
          submitButtonText={'Update'}
          meta={flowMetadaForm}
          defaultValues={hmflowData.current.metadata}
          onSubmit={(submittedData) =>
            (hmflowData.current.metadata = submittedData)
          }
        />
      )
    }
  ];

  // Memoised so the callbacks below have a stable identity; as plain array
  // literals these were rebuilt on every render.
  const headerItems: IHmFlowHeaderItem[] = useMemo(
    () => [
      {
        name: 'headerStatus',
        component: () => (
          <HeaderStatus
            title={hmflowData.current.metadata.name}
            textStatus={textStatus}
            color={color}
            actions={headerAction}
          />
        )
      }
    ],
    // `hmflowData` is a ref: it is intentionally not reactive, so its
    // `.current` is not a valid dependency (mutating it does not re-render).
    // oxlint-disable-next-line react-hooks/exhaustive-deps
    [textStatus, color, headerAction]
  );
  const bottomItems: IHmFlowBottomItem[] = useMemo(
    () => [
      {
        name: 'toolbar',
        component: () => <Toolbar actions={bottomAction} />
      }
    ],
    [bottomAction]
  );

  const modalItems = [
    {
      name: 'nodeEditor',
      component: () => <NodeEditor onUpdateNode={onUpdateNode} />
    }
  ];

  const MemoizedHeader = useCallback(() => {
    return <HmFlowHeader items={headerItems} />;
  }, [headerItems]);

  const MemoizedBottom = useCallback(() => {
    return <HmFlowBottom items={bottomItems} />;
  }, [bottomItems]);

  // Memoised because HmFlowBase loads and lays out `initialData` again each
  // time it changes, which reset the canvas on every render of HmFlow.
  const initialData = useMemo(
    () => ({
      edges: defaultHmFlowData.edges,
      nodes: defaultHmFlowData.nodes
    }),
    [defaultHmFlowData.edges, defaultHmFlowData.nodes]
  );

  return (
    <HmFlowProvider nodeTypes={nodeTypes}>
      <HmFlowBase
        initialData={initialData}
        canvasConfig={canvasConfig}
        onCanvasDoubleClicked={onCanvasDoubleClicked}
        onCanvasDoubleClick={searchNode}
        onNodeDoubleClick={onNodeDoubleClick}
        sideBarComponent={({ ...rest }) => (
          <HmFlowSideBar {...rest} items={sideItems} />
        )}
        headerComponent={MemoizedHeader}
        bottomComponent={MemoizedBottom}
        modalComponent={({ ...rest }) => (
          <HmFlowModal {...rest} items={modalItems} />
        )}
      />
    </HmFlowProvider>
  );
};

export default HmFlow;
