import { AppLayout, IModuleLink } from '@funcd-dev/ui';
import { Spotlight, SpotlightActionData } from '@mantine/spotlight';
import {
  IconAlertTriangle,
  IconBuildingWarehouse,
  IconDevices,
  IconLayoutDashboard,
  IconRobot
} from '@tabler/icons-react';
import { FC } from 'react';
import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
import AlertsModule from './alerts/alerts.module';
import AutomationsModule from './automations/automations.module';
import DevicesModule from './devices/devices.module';
import OverviewModule from './overview/overview.module';
import SitesModule from './sites/sites.module';

const modules: IModuleLink[] = [
  { icon: IconLayoutDashboard, label: 'Overview', to: '/' },
  { icon: IconDevices, label: 'Devices', to: '/devices' },
  { icon: IconAlertTriangle, label: 'Alerts', to: '/alerts' },
  { icon: IconBuildingWarehouse, label: 'Sites', to: '/sites' },
  { icon: IconRobot, label: 'Automations', to: '/automations' }
];

// Nested pages keep their section's name in the header.
const headerMatches = [
  { matchPath: '/devices', label: 'Devices' },
  { matchPath: '/automations', label: 'Automations' }
];

const AppRouting: FC = () => {
  const navigate = useNavigate();
  const actions: SpotlightActionData[] = modules.map((module) => ({
    id: module.label,
    label: module.label,
    leftSection: <module.icon size={18} />,
    onClick: () => navigate(module.to ?? '/')
  }));

  const route = useRoutes([
    {
      path: '/',
      element: (
        <>
          <Spotlight actions={actions} />
          <AppLayout
            offset={60}
            imageSrc=""
            modules={modules}
            headerMatches={headerMatches}
          />
        </>
      ),
      children: [
        { index: true, element: <OverviewModule /> },
        { path: 'devices/*', element: <DevicesModule /> },
        { path: 'alerts', element: <AlertsModule /> },
        { path: 'sites', element: <SitesModule /> },
        { path: 'automations/*', element: <AutomationsModule /> },
        { path: '*', element: <Navigate to="/" replace /> }
      ]
    }
  ]);
  return route;
};

export default AppRouting;
