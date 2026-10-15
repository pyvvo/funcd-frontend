import { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import Device from './device';
import DeviceForm from './device-form';
import deviceStore from './device.store';
import Devices from './devices';

const DevicesRoutingModule: FC = () =>
  useRoutes([
    { path: '/', element: <Devices store={deviceStore} /> },
    { path: '/new', element: <DeviceForm store={deviceStore} /> },
    { path: '/:id', element: <Device store={deviceStore} /> },
    { path: '/:id/edit', element: <DeviceForm store={deviceStore} /> }
  ]);

export default DevicesRoutingModule;
