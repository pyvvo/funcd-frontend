import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import NodeRegistry from './node-registry';
import nodeRegistryStore from './node-registry-store';

const NodeRegistryRoutingModule: FC = () => {
  const route = useRoutes([
    {
      path: '/',
      element: <NodeRegistry store={nodeRegistryStore} />
    }
  ]);
  return route;
};
export default NodeRegistryRoutingModule;
