import proxyRequest from '../utils/proxyRequest';

export default function loadUsers(login) {
    return proxyRequest('users/' + login, {}).then(user => {
      return user;
    });
}
