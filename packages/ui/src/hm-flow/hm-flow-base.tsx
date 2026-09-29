import {
  Background,
  Controls,
  MiniMap,
  Node,
  Panel,
  ReactFlow
} from '@xyflow/react';
import {
  FC,
  MouseEvent,
  ReactNode,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState
} from 'react';

import type { NodeBase } from '@xyflow/system';
import styles from './hm-flow.module.css';
import { HmFlowChildrenDepsType } from './hm-flow-base.types';
import { HmFlowDepsProvider } from './provider';
import { IHmFlowModalProps, IHmFlowSideBarProps } from './components';
import { IInitialNodeData, ICanvasConfigs } from './hm-flow.types';
import {
  useHmFlow,
  useNodeAndEdgeHandlers,
  useHmFlowInteractions
} from './hooks';
import { ActionHandlerDepsType, PyNodeDataWithActionType } from './node';

export interface IHmFlowBase {
  initialData?: IInitialNodeData;
  canvasConfig?: ICanvasConfigs;
  sideBarComponent: (params: Omit<IHmFlowSideBarProps, 'items'>) => ReactNode;
  modalComponent: (params: Omit<IHmFlowModalProps, 'items'>) => ReactNode;
  bottomComponent: () => ReactNode;
  headerComponent: () => ReactNode;
  onCanvasDoubleClick: (deps: ActionHandlerDepsType) => void;
  onCanvasDoubleClicked?: (deps: ActionHandlerDepsType) => void;
  onNodeDoubleClick: (
    event: React.MouseEvent,
    node: NodeBase<PyNodeDataWithActionType>,
    deps: ActionHandlerDepsType
  ) => void;
}

// ---- Main NodeMenu Component ---- //
const HmFlowBase: FC<IHmFlowBase> = (props) => {
  const {
    initialData,
    canvasConfig = {},
    sideBarComponent,
    modalComponent,
    bottomComponent,
    headerComponent,
    onCanvasDoubleClick,
    onCanvasDoubleClicked,
    onNodeDoubleClick
  } = props;

  const {
    miniMap = false,
    controls = false,
    background = false,
    colorMode = 'light'
  } = canvasConfig || {};

  const [drawerOpened, setDrawerOpened] = useState(false);
  const [modalOpened, setModalOpened] = useState(false);
  const [currentTab, setCurrentTab] = useState<string | null>(null);
  const [currentModalTab, setCurrentModalTab] = useState<string | null>(null);
  const [stateJoinsNode, setStateJoinsNode] = useState<boolean>(false);
  const [nodeCounters, setNodeCounters] = useState<Record<string, number>>({});

  const { nodeTypes } = useHmFlow();

  const {
    nodes,
    setNodes,
    selectedNodes,
    currentNode,
    setCurrentNode,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onLayout
  } = useNodeAndEdgeHandlers({ initialData });

  const reactFlowWrapper = useRef<HTMLDivElement>(null!); // Référence pour le conteneur React Flow
  const {
    clickedPosition,
    setClickedPosition,
    screenToFlowPosition,
    toObject,
    setViewport
  } = useHmFlowInteractions({
    reactFlowWrapper,
    setDrawerOpened,
    setCurrentTab
  });

  useEffect(() => {
    if (selectedNodes.length === 1) {
      const selectedNodeId = selectedNodes[0];
      const node = nodes.find((n) => n.id === selectedNodeId);
      if (node) {
        setCurrentNode(node);
      } else {
        console.warn('Aucun nœud correspondant trouvé pour l’ ID sélectionné.');
      }
    }
  }, [selectedNodes, nodes, setCurrentNode]);

  const MemoizedSidebar = useCallback(
    (params: Omit<IHmFlowSideBarProps, 'items'>) => {
      const { drawerOpened, onDrawerClose } = params;

      const SideBar = sideBarComponent({
        drawerOpened,
        onDrawerClose,
        currentTab
      });
      return SideBar;
    },
    [sideBarComponent, currentTab]
  );
  const MemoizedModal = useCallback(
    (params: Omit<IHmFlowModalProps, 'items'>) => {
      const { currentModalTab, modalOpened, setModalOpened, testMode } = params;

      const Modal = modalComponent({
        currentModalTab,
        modalOpened,
        setModalOpened,
        testMode
      });
      return Modal;
    },
    [modalComponent]
  );

  // Memoised like the sidebar and modal: as plain functions these were new
  // component types on every render, so React remounted the header and the
  // toolbar on each drag frame and selection change.
  const Bottom = useCallback(() => {
    const _ = bottomComponent();
    return _;
  }, [bottomComponent]);

  const HeaderStatus = useCallback(() => {
    const _ = headerComponent();
    return _;
  }, [headerComponent]);

  const handleDrawerClose = useCallback(() => setDrawerOpened(false), []);

  // Memoised: as a plain object literal this was a new value on every render,
  // which made every callback depending on it unstable.
  const deps: HmFlowChildrenDepsType = useMemo(
    () => ({
      currentNode,
      nodeCounters,
      clickedPosition,
      nodes,
      edges,
      reactFlowWrapper,
      stateJoinsNode,
      setCurrentModalTab,
      setCurrentTab,
      setModalOpened,
      setCurrentNode,
      setNodes,
      setEdges,
      setNodeCounters,
      setClickedPosition,
      setDrawerOpened,
      setStateJoinsNode,
      screenToFlowPosition,
      toObject,
      onLayout,
      setViewport
    }),
    [
      currentNode,
      nodeCounters,
      clickedPosition,
      nodes,
      edges,
      reactFlowWrapper,
      stateJoinsNode,
      setCurrentModalTab,
      setCurrentTab,
      setModalOpened,
      setCurrentNode,
      setNodes,
      setEdges,
      setNodeCounters,
      setClickedPosition,
      setDrawerOpened,
      setStateJoinsNode,
      screenToFlowPosition,
      toObject,
      onLayout,
      setViewport
    ]
  );

  const handleCanvasDoubleClick = useCallback(
    (event: MouseEvent) => {
      const {
        reactFlowWrapper,
        screenToFlowPosition,
        setClickedPosition,
        setDrawerOpened,
        setCurrentTab
      } = deps;
      const targetElement = event.target as HTMLElement;
      if (
        targetElement.closest('.react-flow__controls') ||
        targetElement.closest('.react-flow__node') ||
        targetElement.closest('.react-flow__panel') ||
        !targetElement.closest('.react-flow')
      ) {
        return;
      }

      if (!reactFlowWrapper.current) return;

      const { clientX, clientY } = event;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = screenToFlowPosition({
        x: clientX - bounds.left,
        y: clientY - bounds.top
      });

      setClickedPosition(position);

      onCanvasDoubleClick(deps);
      onCanvasDoubleClicked?.(deps);
    },
    [deps, onCanvasDoubleClick, onCanvasDoubleClicked]
  );

  const handleNodeDoubleClick = useCallback(
    (event: React.MouseEvent, node: Node) =>
      onNodeDoubleClick(
        event,
        node as NodeBase<PyNodeDataWithActionType>,
        deps
      ),
    [onNodeDoubleClick, deps]
  );

  return (
    <HmFlowDepsProvider deps={deps}>
      <div
        className={styles.root}
        ref={reactFlowWrapper}
        onDoubleClick={handleCanvasDoubleClick}>
        <ReactFlow
          colorMode={colorMode}
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          zoomOnDoubleClick={false}
          nodeTypes={nodeTypes}
          proOptions={{ hideAttribution: true }}
          fitView
          onNodeDoubleClick={handleNodeDoubleClick}>
          {miniMap && <MiniMap {...canvasConfig.mapAttr} />}
          {background && <Background {...(canvasConfig.bgAttr as any)} />}
          {controls && <Controls {...canvasConfig.ctlAttr} />}
          <Panel position="top-center">
            <HeaderStatus />
          </Panel>

          <Panel position="bottom-center">
            <Bottom />
          </Panel>
        </ReactFlow>

        <MemoizedSidebar
          drawerOpened={drawerOpened}
          onDrawerClose={handleDrawerClose}
          currentTab={currentTab}
        />

        <MemoizedModal
          modalOpened={modalOpened}
          currentModalTab={currentModalTab}
          setModalOpened={setModalOpened}
        />
      </div>
    </HmFlowDepsProvider>
  );
};

export default HmFlowBase;
