import { createContext } from 'react';
import Keycloak from 'keycloak-js';

// Assuming Keycloak type is available from the Keycloak JS library
type KeycloakInstance = Keycloak;

const KeycloakContext = createContext<KeycloakInstance>({} as KeycloakInstance);

export default KeycloakContext;
