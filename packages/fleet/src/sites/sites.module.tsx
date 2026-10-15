import { FC } from 'react';
import siteStore from './site.store';
import Sites from './sites';

const SitesModule: FC = () => <Sites store={siteStore} />;
export default SitesModule;
