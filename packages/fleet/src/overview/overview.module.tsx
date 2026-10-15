import { FC } from 'react';
import Overview from './overview';
import overviewStore from './overview.store';

const OverviewModule: FC = () => <Overview store={overviewStore} />;
export default OverviewModule;
