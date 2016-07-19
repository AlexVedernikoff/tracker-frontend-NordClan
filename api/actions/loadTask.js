import proxyRequest from '../utils/proxyRequest';
import PromiseQueue from '../utils/promiseQueue';
import loadProjectsTree from './loadProjectsTree';
import loadUser from './loadUser';

export default function loadTask(req, params) {
  return proxyRequest('tasks/' + params[0], {}).then(task => {
    let queue = new PromiseQueue();
    queue.add(loadProjectsTree, [task.idProj]).then(projects => {
      if (projects && projects[0]) {
        task.projectName = projects[0].name;
      }
    });
    queue.add(loadUser, task.creator).then(creator => {
      task.creatorName = [creator.firstNameRu, creator.lastNameRu].join(' ');
    });
    queue.add(loadUser, task.owner).then(owner => {
      task.ownerName = [owner.firstNameRu, owner.lastNameRu].join(' ');
    });
    return Promise.all(queue).then(() => {
      return task;
    })
  });
}
