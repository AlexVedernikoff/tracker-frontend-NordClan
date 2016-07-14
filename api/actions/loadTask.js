import proxyRequest from '../utils/proxyRequest';
import loadProjectsTree from './loadProjectsTree';
import loadUser from './loadUser';

export default function loadTask(req, params) {
  return proxyRequest('tasks/' + params[0], {}).then(task => {
    let promises = [
      loadProjectsTree([task.idProj]).then(projects => {
        if (projects && projects[0]) {
          task.projectName = projects[0].name;
        }
      }),
      loadUser(task.creator).then(creator => {
        task.creatorName = [creator.firstNameRu, creator.lastNameRu].join(' ');
      }),
      loadUser(task.owner).then(owner => {
        task.ownerName = [owner.firstNameRu, owner.lastNameRu].join(' ');
      })
    ];
    return Promise.all(promises).then(() => {
      return task;
    })
  });
}
