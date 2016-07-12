import proxyRequest from '../utils/proxyRequest';
import loadUser from './loadUser';

export default function loadTasks(req) {
  return proxyRequest('tasks/user/' + req.session.user.login, {}).then((tasks) => {

    let userRequests = [];
    tasks.map(task => {
      return task.creator;
    }).filter((value, index, self) => {
      return self.indexOf(value) === index;
    }).forEach(userName => {
      userRequests.push(
        loadUser(userName).then(user => {
          tasks.forEach(task => {
            if (task.creator == user.login) {
              task.creatorName =  [user.firstNameRu, user.lastNameRu].join(' ');
            }
          });
        })
      );
    });

    return Promise.all(userRequests).then(() => {
      return tasks;
    });
  });
}
