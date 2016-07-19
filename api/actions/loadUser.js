import proxyRequest from '../utils/proxyRequest';

export default function loadUser(login) {
    return proxyRequest('users/' + login, {}).then(user => {
      user.fullNameRu = [user.firstNameRu, user.lastNameRu].join(' ');
      return user;
    });
}
