import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import Automation from './automation';
import automationStore from './automation.store';
import Automations from './automations';

const AutomationsRoutingModule: FC = () =>
  useRoutes([
    { path: '/', element: <Automations store={automationStore} /> },
    { path: '/:id', element: <Automation store={automationStore} /> }
  ]);

export default AutomationsRoutingModule;
