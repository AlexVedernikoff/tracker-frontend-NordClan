import proxyRequest from '../utils/proxyRequest';

export default function loadUser(req) {
  return new Promise((resolve, reject) => {
    proxyRequest('users/' + req.body.name, {},
      (error, response, body) => {
        if (!error && response.statusCode == 200 && body) {
          let user = JSON.parse(body);
          resolve(user);
        } else {
          reject();
        }
    });
  });
}
