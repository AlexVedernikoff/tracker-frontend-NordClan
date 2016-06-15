import tasks from '../utils/data';

export default function loadTask(req, params) {
  return new Promise((resolve, reject) => {
    const currentTask = tasks().filter((task) => task._id === params[0])[0];
    if (currentTask) {
      resolve(currentTask);
    } else {
      reject();
    }
  });
}
