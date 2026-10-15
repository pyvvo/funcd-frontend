import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import Device from './device';
import DeviceForm from './device-form';
import deviceStore from './device.store';
import Devices from './devices';

// The form is a child route: it opens in a drawer over the list (new) or
// over the device (edit), which the page shows through its <Outlet />.
const DevicesRoutingModule: FC = () =>
  useRoutes([
    {
      path: '/',
      element: <Devices store={deviceStore} />,
      children: [{ path: 'new', element: <DeviceForm store={deviceStore} /> }]
    },
    {
      path: '/:id',
      element: <Device store={deviceStore} />,
      children: [{ path: 'edit', element: <DeviceForm store={deviceStore} /> }]
    }
  ]);

export default DevicesRoutingModule;
