import proxyRequest from '../utils/proxyRequest';
import loadUsers from './loadUsers';

export default function login(req) {
  return loadUsers(req.body.name).then((user) => {
    if (user.length) {
      req.session.user = user[0];
    }
    return user[0];
  });
}
