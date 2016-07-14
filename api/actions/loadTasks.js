import proxyRequest from '../utils/proxyRequest';
import loadProjectsTree from './loadProjectsTree';
import loadUser from './loadUser';

export default function loadTasks(req) {
  return proxyRequest('tasks/user/' + req.session.user.login, {}).then((tasks) => {
// TODO растащить макароны
    let promises = [];
    tasks.map(task => (task.creator)).filter((value, index, self) => {
      return self.indexOf(value) === index;
    }).forEach(userName => {
      promises.push(
        loadUser(userName).then(user => {
          tasks.forEach(task => {
            if (task.creator == user.login) {
              task.creatorName =  [user.firstNameRu, user.lastNameRu].join(' ');
            }
          });
        })
      );
    });
    tasks.map(task => (task.idProj)).filter((value, index, self) => {
      return self.indexOf(value) === index;
    }).forEach(projectId => {
      promises.push(
        loadProjectsTree([projectId]).then(projects => {
          if (projects && projects[0]) {
            tasks.forEach(task => {
              if (task.idProj == projectId) {
                task.projectName =  projects[0].name;
              }
            });
          }
        })
      );
    });

    return Promise.all(promises).then(() => {
      return tasks;
    });
  });
}
