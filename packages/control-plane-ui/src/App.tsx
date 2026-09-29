import NiceModal from '@ebay/nice-modal-react';
import { cssVarResolver, pyTheme } from '@humaapi/ui';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import AppRouting from './app.routing';
import './register-reactive-fields';

import { client } from '@humaapi/lib';

client.setConfig({
  baseURL: 'http://localhost:8800'
});

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
