import { FC } from 'react';
import { useRoutes } from 'react-router-dom';

import nodeStore from './node.store';
import WorkflowCanvas from './workflow-canvas';
import workflowStore from './workflow.store';
import Workflows from './workflows';

const WorkflowRoutingModule: FC = () => {
  const route = useRoutes([
    {
      path: '/',
      element: <Workflows store={workflowStore} />
    },
    {
      path: '/:id',
      element: (
        <div style={{ marginLeft: 8 }}>
          <WorkflowCanvas store={workflowStore} nodeStore={nodeStore} />
        </div>
      )
    }
  ]);
  return route;
};
export default WorkflowRoutingModule;
