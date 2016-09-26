import proxyRequest from '../utils/proxyRequest';
import PromiseQueue from '../utils/promiseQueue';
import loadProjectsTree from './loadProjectsTree';
import loadUsers from './loadUsers';

export default function loadTask(req, params) {
  return proxyRequest('tasks/' + params[0], {}).then(task => {
    let queue = new PromiseQueue();
    queue.add(loadProjectsTree, [task.idProj]).then(projects => {
      if (projects && projects[0]) {
        task.projectName = projects[0].name;
      }
    });
    return Promise.all(queue).then(() => {
      return task;
    })
  });
}
