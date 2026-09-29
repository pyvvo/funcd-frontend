import { AppLayout } from '@funcd-dev/ui';
import { Spotlight, SpotlightProps } from '@mantine/spotlight';
import {
  IconAffiliate,
  IconCloudComputing,
  IconDashboard,
  IconDots,
  IconFileText,
  IconHome,
  IconHome2,
  IconJumpRope,
  IconSettings,
  IconShieldHalfFilled
} from '@tabler/icons-react';
import Chance from 'chance';
import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import CollectorModule from './collector/collector.module';
import DashboardModule from './dashboard/dashboard.module';
import WorkflowModule from './workflow/workflow.module';

const modules = [
  {
    icon: IconHome2,
    label: 'Dashboard',
    color: 'indigo',
    isBottom: false,
    to: '/dashboard'
  },
  {
    icon: IconCloudComputing,
    label: 'Collector',
    color: 'indigo',
    to: '/collector'
  },
  {
    icon: IconAffiliate,
    label: 'Dispatcher',
    color: 'grape',
    to: '/dispatcher'
  },
  {
    icon: IconShieldHalfFilled,
    label: 'IAM',
    to: '/iam'
  },
  {
    icon: IconDots,
    label: 'More',
    to: '/'
  },
  {
    icon: IconJumpRope,
    label: 'Workflows',
    to: '/workflows'
  },
  {
    icon: IconSettings,
    label: 'Settings',
    isBottom: true,
    to: '/settings'
  }
];

const chance = new Chance();
const avatarUrl = chance.avatar({ protocol: 'https' });

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
const AppRouting: FC = () => {
  const route = useRoutes([
    {
      path: '/',
      // oxlint-disable-next-line react/jsx-no-undef
      element: (
        <>
          <Spotlight actions={actions} />
          <AppLayout offset={60} imageSrc={avatarUrl} modules={modules} />
        </>
      ),
      children: [
        {
          path: 'dashboard',
          element: <DashboardModule />
        },
        {
          path: 'collector/*',
          element: <CollectorModule />
        },

        {
          path: 'dispatcher',
          element: (
            <main className="bg-slate-500" style={{ padding: '1rem' }}>
              <p>Dispatcher!</p>
            </main>
          )
        },
        {
          path: 'iam',
          element: (
            // <main style={{ padding: '1rem' }}>
            <p>Iam!</p>
            // </main>
          )
        },
        {
          path: 'workflows',
          element: <WorkflowModule />
        },
        {
          path: 'settings',
          element: (
            <main style={{ padding: '1rem' }}>
              <p>Settings!</p>
            </main>
          )
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
