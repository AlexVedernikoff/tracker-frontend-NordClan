import proxyRequest from '../utils/proxyRequest';
import loadUser from './loadUser';

export default function login(req) {
  return loadUser(req.body.name).then((user) => {
    req.session.user = user;
    return user;
  });
}
