/**
 * Created by ira on 24.02.16.
 */

export default function getTaskById(taskId, tasks) {
  return tasks.filter((task) => task._id === taskId);
}
