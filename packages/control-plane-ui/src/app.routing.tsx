import { AppLayout } from '@humaapi/ui';
import { Spotlight, SpotlightProps } from '@mantine/spotlight';
import {
  IconCell,
  IconDashboard,
  IconFileText,
  IconHome,
  IconJumpRope
} from '@tabler/icons-react';
import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import WorkflowModule from './workflow/workflow.module';
import NodeRegistryModule from './node-registry/node-registry.module';

const modules = [
  {
    icon: IconJumpRope,
    label: 'Workflows',
    to: '/workflows'
  },
  {
    icon: IconCell,
    label: 'Node Registry',
    to: '/node-registry'
  }
];
const actions: SpotlightProps['actions'] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Get to home page',
    onClick: () => console.log('Home'),
    leftSection: <IconHome size={18} />
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Get full information about current system status',
    onClick: () => console.log('Dashboard'),
    leftSection: <IconDashboard size={18} />
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Visit documentation to lean more about all features',
    onClick: () => console.log('Documentation'),
    leftSection: <IconFileText size={18} />
  }
];

const headerMatches = [
  {
    matchPath: '/workflows/',
    label: 'Editor'
  }
];

const AppRouting: FC = () => {
  const route = useRoutes([
    {
      path: '/',
      element: (
        <>
          <Spotlight actions={actions} />
          <AppLayout
            modules={modules}
            imageSrc={''}
            offset={10}
            headerMatches={headerMatches}
          />
        </>
      ),
      children: [
        {
          path: 'workflows/*',
          element: <WorkflowModule />
        },
        {
          path: 'node-registry/*',
          element: <NodeRegistryModule />
        },
        {
          path: '/'
        }
      ]
    }
  ]);
  return route;
};

export default AppRouting;
