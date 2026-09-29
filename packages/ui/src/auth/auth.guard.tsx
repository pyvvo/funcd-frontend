import { useEffect, useState, useCallback, ReactNode, FC } from 'react';
import KeycloakContext from './auth.context';
import useKeycloak from './auth.hooks';

interface IKeycloakGuard {
  children: ReactNode;
  fallback?: ReactNode;
}
const KeycloakGuard: FC<IKeycloakGuard> = ({ children, fallback }) => {
  const keycloak = useKeycloak();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Memoised so the effect below can depend on it without re-running on every
  // render (an inline function would be a new value each time).
  const checkIfIsAuthenticated = useCallback(() => {
    const { authenticated } = keycloak;
    setIsAuthenticated(authenticated ?? false);
    return authenticated ?? false;
  }, [keycloak]);

  useEffect(() => {
    if (keycloak) {
      checkIfIsAuthenticated();
    }
  }, [keycloak, checkIfIsAuthenticated]);

  if (isAuthenticated) {
    // oxlint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
  return fallback ? (
    <>{fallback}</>
  ) : (
    <div>Please log in to access this content.</div>
  );
};

export default KeycloakGuard;
