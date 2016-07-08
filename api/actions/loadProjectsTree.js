import proxyRequest from '../utils/proxyRequest';

export default function loadProjectsTree (req, params) {
  const projectId = (params && params[0]) ? params[0] : req;
  //TODO переписать под запрос данных по многим проектам одним запросом
  return proxyRequest('projects/tree/', {qs: {id: projectId}}).then(projects => {
    return projects;
  });
}
