import proxyRequest from '../utils/proxyRequest';

export default function loadTasks(req) {
  return new Promise((resolve) => {
    proxyRequest('tasks/user/' + req.session.user.login, {},
      (error, response, body) => {
        if (!error && response.statusCode == 200 && body) {
          let tasks = JSON.parse(body);
          resolve(tasks);
        } else {
          reject();
        }
    });
  });
}
