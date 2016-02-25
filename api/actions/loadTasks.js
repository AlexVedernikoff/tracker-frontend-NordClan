import tasks from '../utils/data';

export default function loadTasks() {
  return new Promise((resolve) => {
    resolve(tasks());
  });
}
