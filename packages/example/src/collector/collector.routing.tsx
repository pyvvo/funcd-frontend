/* oxlint-disable react/no-unescaped-entities */
import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import Collector from './collector';
import Collectors from './collectors';

// test
const CollectorRoutingModule: FC = () => {
  const route = useRoutes([
    {
      // index: true,
      path: '/',
      element: <Collectors />,
      children: [
        // {
        //   path: '/create-company',
        //   element: <AdminCreateCompany />
        // },
        {
          path: '/:id',
          element: <Collector />
        }
      ]
    }
  ]);
  return route;
};
export default CollectorRoutingModule;
