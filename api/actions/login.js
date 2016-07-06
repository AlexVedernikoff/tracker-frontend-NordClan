import proxyRequest from '../utils/proxyRequest';
import loadUser from './loadUser';

export default function login(req) {
  return new Promise((resolve, reject) => {
    loadUser(req).then((user) => {
      req.session.user = user;
      resolve(user);
    }, () => {
      reject();
    });
  });
}
