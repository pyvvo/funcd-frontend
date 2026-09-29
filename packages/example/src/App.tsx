// import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import NiceModal from '@ebay/nice-modal-react';
import { cssVarResolver, pyTheme } from '@funcd-dev/ui';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import AppRouting from './app.routing';
import './register-reactive-charts';
import './register-reactive-fields';
import { client } from '@funcd-dev/lib';

client.setConfig({
  baseURL: 'http://localhost:8080'
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
