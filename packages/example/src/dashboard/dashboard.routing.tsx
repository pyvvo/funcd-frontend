/* oxlint-disable react/no-unescaped-entities */
import { FC } from 'react';
import { useRoutes } from 'react-router-dom';

import Dashboard from './dashboard';

// test
const DashboardRoutingModule: FC = () => {
  const route = useRoutes([
    {
      index: true,
      element: <Dashboard />
    }
  ]);
  return route;
};
export default DashboardRoutingModule;
