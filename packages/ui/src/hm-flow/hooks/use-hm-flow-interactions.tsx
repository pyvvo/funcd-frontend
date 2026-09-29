import { useReactFlow, Node } from '@xyflow/react';

import { Dispatch, RefObject, SetStateAction, useState } from 'react';
import { PyNodeDataWithActionType } from '../node';

interface IUseHMFlowInteractions {
  reactFlowWrapper: RefObject<HTMLDivElement>;
  setDrawerOpened: Dispatch<SetStateAction<boolean>>;
  setCurrentTab: Dispatch<SetStateAction<string | null>>;
}

export const useHmFlowInteractions = (params: IUseHMFlowInteractions) => {
  const { reactFlowWrapper, setDrawerOpened, setCurrentTab } = params;
  const { screenToFlowPosition, toObject, setViewport } =
    useReactFlow<Node<PyNodeDataWithActionType>>();

  const [clickedPosition, setClickedPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  return {
    clickedPosition,
    reactFlowWrapper,
    setClickedPosition,
    setDrawerOpened,
    setCurrentTab,
    screenToFlowPosition,
    toObject,
    setViewport
  };
};
