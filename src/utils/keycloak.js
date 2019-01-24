import Keycloak from 'keycloak-js';
import { setCookies } from './cookies';

const keycloak = Keycloak({
  url: process.env.KEYCLOAK_URL || 'https://sso.simbirsoft:8080/auth',
  realm: process.env.KEYCLOAK_REALM || 'simbirsoft-dev',
  clientId: process.env.KEYCLOAK_CLIENTID || 'local-simtrack-public'
});

export const initSSO = () =>
  keycloak.init({ promiseType: 'native' }).then(authenticated => {
    if (authenticated) {
      setCookies('authorization', 'Bearer ' + keycloak.token);
    }
  });

export const getAuthUrl = () => {
  return keycloak.createLoginUrl();
};
