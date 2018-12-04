import { createSelector } from 'reselect';
import moment from 'moment';
import get from 'lodash/get';
import { getAllTags } from './getAllTags';
import localize from '../pages/ProjectPage/AgileBoard/AgileBoard.json';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses } from './dictionaries';
import { getFullName } from '../utils/NameLocalisation';
import getSortedSprints from './sprints';
import sortPerformer from '../utils/sortPerformer';

const selectTasks = state => state.Tasks.tasks;

const selectSprints = state => state.Project.project.sprints;

const selectSprintsFetching = state =>
  state.Project.isProjectInfoReceiving || state.Project.isSprintsReceiving || !state.Project.project.id;

const selectUserId = state => state.Auth.user.id;

const selectTaskType = state => getLocalizedTaskTypes(state);

const selectProjectUsers = state => state.Project.project.users;

const filterTasks = array => {
  const taskArray = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };
  array.forEach(element => {
    switch (element.statusId) {
      case 1:
        taskArray.new.push(element);
        break;
      case 2:
      case 3:
        taskArray.dev.push(element);
        break;
      case 4:
      case 5:
        taskArray.codeReview.push(element);
        break;
      case 6:
      case 7:
        taskArray.qa.push(element);
        break;
      case 8:
        taskArray.done.push(element);
        break;
      default:
        break;
    }
  });

  for (const key in taskArray) {
    taskArray[key].sort((a, b) => {
      return a.prioritiesId - b.prioritiesId;
    });
    taskArray[key].forEach(task => {
      if (!task.linkedTasks) {
        task.linkedTasks = [];
      }
      task.linkedTasks.concat(task.subTasks, task.parentTask).map(relatedTask => get(relatedTask, 'id', null));
    });
  }

  return taskArray;
};

const getSortedTasks = createSelector([selectTasks], tasks => filterTasks(tasks));

const myTasks = (tasks, userId) =>
  tasks.filter(task => {
    return task.performer && task.performer.id === userId;
  });

const getMyTasks = createSelector([selectTasks, selectUserId], (tasks, userId) => filterTasks(myTasks(tasks, userId)));

const getNoTagData = createSelector(
  state => state.Localize.lang,
  lang => ({
    label: localize[lang].WITHOUT_TAG,
    value: localize[lang].WITHOUT_TAG
  })
);

const createOptions = (array, labelField) => {
  return array.map(element => ({
    value: element.id,
    label: labelField === 'name' ? element[labelField] : getFullName(element)
  }));
};

const currentSprint = sprints => {
  const processedSprints = sprints.filter(sprint => {
    return sprint.statusId === 2;
  });

  const currentSprints = processedSprints.filter(sprint => {
    return moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]');
  });

  return createOptions(currentSprints.length ? currentSprints : processedSprints);
};

const getCurrentSprint = createSelector(
  [selectSprints, selectSprintsFetching],
  (sprints, fetching) => (fetching ? null : currentSprint(sprints))
);

const typeOptions = taskTypes => createOptions(taskTypes, 'name');
const authorOptions = projectUsers => createOptions(projectUsers);

const getTypeOptions = createSelector([selectTaskType], taskTypes => typeOptions(taskTypes));
const getAuthorOptions = createSelector([selectProjectUsers], projectUsers => authorOptions(projectUsers));

const usersSelector = state => state.Project.project.users;
const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));

const agileBoardSelector = state => {
  return {
    tasks: getSortedTasks(state),
    myTasks: getMyTasks(state),
    tags: getAllTags(state),
    sortedSprints: getSortedSprints(state),
    currentSprint: getCurrentSprint(state),
    typeOptions: getTypeOptions(state),
    authorOptions: getAuthorOptions(state),
    noTagData: getNoTagData(state),
    lastCreatedTask: state.Project.lastCreatedTask,
    lastUpdatedTask: state.Task.lastUpdatedTask,
    sprintTasks: state.Tasks.tasks,
    sprints: state.Project.project.sprints,
    project: state.Project.project,
    tracksChange: state.TimesheetPlayer.tracksChange,
    StatusIsEditing: state.Task.StatusIsEditing,
    UserIsEditing: state.Task.UserIsEditing,
    user: state.Auth.user,
    isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
    globalRole: state.Auth.user.globalRole,
    statuses: getLocalizedTaskStatuses(state),
    taskTypes: getLocalizedTaskTypes(state),
    lang: state.Localize.lang,
    users: sortedUsersSelector(state)
  };
};

export { agileBoardSelector };
