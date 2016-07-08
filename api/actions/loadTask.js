import proxyRequest from '../utils/proxyRequest';

export default function loadTask(req, params) {
  return proxyRequest('tasks/' + params[0], {}).then(task => {
    return task;
  });
}
