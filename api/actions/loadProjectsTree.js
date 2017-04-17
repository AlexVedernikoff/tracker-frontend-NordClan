import proxyRequest from '../utils/proxyRequest';

export default function loadProjectsTree(req, params) {
  if (!(req instanceof Array) && !(params && params[0])) {
    return Promise.reject('No request ids specified');
  }
  const projectIds = (params && params[0]) ? params[0] : req.join(',');
  return proxyRequest('projects/tree/', { qs: { id: projectIds } }).then(projects => projects);
}
