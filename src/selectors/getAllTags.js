import uniq from 'lodash/uniq';
import { createSelector } from 'reselect';

const getTagsByTask = tasks => {
  let allTags = tasks.reduce((arr, task) => {
    return arr.concat(task.tags ? task.tags.map(tags => tags.name) : []);
  }, []);

  allTags = uniq(allTags);

  return allTags.map(tag => ({
    value: tag,
    label: tag
  }));
};

const selectTasks = state => state.Tasks.tasks;

export const getAllTags = createSelector([selectTasks], tasks => {
  return getTagsByTask(tasks);
});
