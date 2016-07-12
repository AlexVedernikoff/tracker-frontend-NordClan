import proxyRequest from '../utils/proxyRequest';
import loadProjectsTree from './loadProjectsTree';

export default function loadTask(req, params) {
  return proxyRequest('tasks/' + params[0], {}).then(task => {
    return loadProjectsTree([task.idProj]).then(projects => {
      if (projects && projects[0]) {
        task.projectName = projects[0].name;
      }
      return task;
    })
  });
}
