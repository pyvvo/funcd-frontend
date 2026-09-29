import { NodeTypes, ReactFlowProvider } from '@xyflow/react';
import { FC, ReactNode } from 'react';
import { HmFlowContext } from './hm-flow-context';

interface IHMFlowProvider {
  children: ReactNode;
  nodeTypes: NodeTypes;
}

const HmFlowProvider: FC<IHMFlowProvider> = (props) => {
  const { children, nodeTypes } = props;

  return (
    <HmFlowContext.Provider value={{ nodeTypes }}>
      {children}
    </HmFlowContext.Provider>
  );
};

const HmFlowProviderWithXFlow: FC<IHMFlowProvider> = (props) => {
  const { children } = props;
  return (
    <ReactFlowProvider>
      <HmFlowProvider {...props}>{children}</HmFlowProvider>
    </ReactFlowProvider>
  );
};

export default HmFlowProviderWithXFlow;
