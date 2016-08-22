import proxyRequest from '../utils/proxyRequest';
import PromiseQueue from '../utils/promiseQueue';
import loadProjectsTree from './loadProjectsTree';
import loadUser from './loadUser';
import {findUnique, conditionalForEach} from '../utils/collections';

export default function loadTasks(req) {
  return proxyRequest('tasks/user/' + req.session.user.login, {}).then((tasks) => {
    let queue = new PromiseQueue();
    findUnique(tasks, 'creator').forEach(userName => {
      queue.add(loadUser, userName).then(user => {
        conditionalForEach(tasks, user,
          (task, user)=>(task.creator === user.login),
          (task, user)=>{task.creatorName = user.fullNameRu}
        );
      })
    });
    findUnique(tasks, 'idProj').forEach(projectId => {
      queue.add(loadProjectsTree, [projectId]).then(projects => {
        conditionalForEach(tasks, projects[0],
          (task, project)=>(!!project && (task.idProj == projectId)),
          (task, project)=>{task.projectName =  project.name}
        )
      })
    });
    return Promise.all(queue).then(() => {
      return tasks;
    });
  });
}
