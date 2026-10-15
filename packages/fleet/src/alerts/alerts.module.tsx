import { FC } from 'react';
import alertStore from './alert.store';
import Alerts from './alerts';

const AlertsModule: FC = () => <Alerts store={alertStore} />;
export default AlertsModule;
