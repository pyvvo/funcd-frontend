import NiceModal from '@ebay/nice-modal-react';
import { cssVarResolver, pyTheme } from '@funcd-dev/ui';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import AppRouting from './app.routing';
import './register-reactive-charts';
import './register-reactive-fields';

function App() {
  return (
    <MantineProvider
      theme={{ ...pyTheme }}
      cssVariablesResolver={cssVarResolver}>
      <Notifications />
      <NiceModal.Provider>
        <AppRouting />
      </NiceModal.Provider>
    </MantineProvider>
  );
}

export default App;
