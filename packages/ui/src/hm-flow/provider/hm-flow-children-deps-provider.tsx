import { FC, ReactNode } from 'react';
import { HmFlowChildrenDepsType } from '../hm-flow-base.types';
import { HmFlowChildrenDepsContext } from './hm-flow-children-deps-context';

interface IHMFlowChildrenDepsProvider {
  children: ReactNode;
  deps: HmFlowChildrenDepsType;
}

const HmFlowDepsProvider: FC<IHMFlowChildrenDepsProvider> = (props) => {
  const { children, deps } = props;

  return (
    <HmFlowChildrenDepsContext.Provider value={{ deps }}>
      {children}
    </HmFlowChildrenDepsContext.Provider>
  );
};

export default HmFlowDepsProvider;
