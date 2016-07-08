import proxyRequest from '../utils/proxyRequest';
import loadProjectsTree from './loadProjectsTree';

export default function loadTask(req, params) {
  return proxyRequest('tasks/' + params[0], {}).then(task => {
    //TODO Переписать с поддержкой дерева проектов
    return loadProjectsTree(task.idProj).then(project => {
      task.projectName = project.name;
      return task;
    })
  });
}
