import proxyRequest from '../utils/proxyRequest';
import PromiseQueue from '../utils/promiseQueue';
import loadProjectsTree from './loadProjectsTree';
import loadUser from './loadUser';
import {findUniques} from '../utils/collections';

export default function loadTasks(req) {
  return proxyRequest('tasks/user/' + req.session.user.login, {}).then((tasks) => {
// TODO растащить макароны
    let queue = new PromiseQueue();
    findUniques(tasks, 'creator').forEach(userName => {
      queue.add(loadUser, userName).then(user => {
        tasks.forEach(task => {
          if (task.creator == user.login) {
            task.creatorName =  [user.firstNameRu, user.lastNameRu].join(' ');
          }
        });
      })
    });
    findUniques(tasks, 'idProj').forEach(projectId => {
      queue.add(loadProjectsTree, [projectId]).then(projects => {
        if (projects && projects[0]) {
          tasks.forEach(task => {
            if (task.idProj == projectId) {
              task.projectName =  projects[0].name;
            }
          });
        }
      })
    });
    return Promise.all(queue).then(() => {
      return tasks;
    });
  });
}
