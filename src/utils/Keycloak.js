import Keycloak from 'keycloak-js';
import { setCookies } from './Cookies';

const keycloak = Keycloak({
  /*"realm": "simbirsoft-dev",
  "auth-server-url": "http://sso.simbirsoft:8080/auth",
  "ssl-required": "external",
  "resource": "local-simtrack-public",
  "public-client": true,
  "confidential-port": 0*/
  url: 'http://sso.simbirsoft:8080/auth',
  realm: 'simbirsoft-dev',
  clientId: 'local-simtrack-public'
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
