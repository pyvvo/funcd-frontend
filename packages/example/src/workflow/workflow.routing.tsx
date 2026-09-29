import { FC } from 'react';
import { useRoutes } from 'react-router-dom';

import Workflow from './workflow';
import Workflows from './workflows';
import workflowStore from './workflow.store';

// test
const WorkflowRoutingModule: FC = () => {
  const route = useRoutes([
    {
      path: '/',
      element: <Workflows store={workflowStore} />
    },
    {
      path: '/:id',
      element: <Workflow />
    }
  ]);
  return route;
};
export default WorkflowRoutingModule;
