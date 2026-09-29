import { useContext } from 'react';
import Keycloak from 'keycloak-js';
import KeycloakContext from './auth.context';

function useKeycloak(): Keycloak {
  const keycloak = useContext(KeycloakContext);
  if (!keycloak) {
    throw new Error('useKeycloak must be used within a KeycloakProvider');
  }
  return keycloak;
}

export default useKeycloak;
