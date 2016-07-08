import proxyRequest from '../utils/proxyRequest';

export default function loadUser(login) {
    return proxyRequest('users/' + login, {});
}
