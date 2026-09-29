import { createContext } from 'react';
import { HmFlowChildrenDepsType } from '../hm-flow-base.types';

export interface HmFlowChildrenDepsContextType {
  deps: HmFlowChildrenDepsType;
}

export const HmFlowChildrenDepsContext =
  createContext<HmFlowChildrenDepsContextType>(
    {} as HmFlowChildrenDepsContextType
  );
