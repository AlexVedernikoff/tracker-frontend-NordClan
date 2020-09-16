import { createSelector } from 'reselect';
import moment from 'moment';
import get from 'lodash/get';
import { getAllTags } from './getAllTags';
import localize from '../pages/ProjectPage/AgileBoard/AgileBoard.json';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses, getLocalizedUsers } from './dictionaries';
import { getFullName } from '../utils/NameLocalisation';
import getSortedSprints from './sprints';
import sortPerformer from '../utils/sortPerformer';
import { TASK_STATUSES } from '../constants/TaskStatuses';

const selectTasks = state => state.Tasks.tasks;

const selectSprints = state => state.Project.project.sprints;

const selectSprintsFetching = state =>
  state.Project.isProjectInfoReceiving || state.Project.isSprintsReceiving || !state.Project.project.id;

const selectUserId = state => state.Auth.user.id;

const selectTaskType = state => getLocalizedTaskTypes(state);

const selectProjectUsers = state => getLocalizedUsers(state);

const filterTasks = array => {
  const taskArray: any = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };
  array.forEach((element: any) => {
    switch (element.statusId) {
      case TASK_STATUSES.NEW:
        taskArray.new.push(element);
        break;
      case TASK_STATUSES.DEV_PLAY:
      case TASK_STATUSES.DEV_STOP:
        taskArray.dev.push(element);
        break;
      case TASK_STATUSES.CODE_REVIEW_PLAY:
      case TASK_STATUSES.CODE_REVIEW_STOP:
        taskArray.codeReview.push(element);
        break;
      case TASK_STATUSES.QA_PLAY:
      case TASK_STATUSES.QA_STOP:
        taskArray.qa.push(element);
        break;
      case TASK_STATUSES.DONE:
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

export const getSortedTasks = createSelector([selectTasks], tasks => filterTasks(tasks));

const myTasks = (tasks, userId) =>
  tasks.filter(task => {
    return task.performer && task.performer.id === userId;
  });

export const getMyTasks = createSelector([selectTasks, selectUserId], (tasks, userId) =>
  filterTasks(myTasks(tasks, userId))
);

const getNoTagData = createSelector(
  (state: any) => state.Localize.lang,
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

  return createOptions(currentSprints.length ? currentSprints : processedSprints, 'name');
};

const getCurrentSprint = createSelector(
  [selectSprints, selectSprintsFetching],
  (sprints, fetching) => (fetching ? null : currentSprint(sprints))
);

const typeOptions = taskTypes => createOptions(taskTypes, 'name');
const authorOptions = projectUsers => createOptions(projectUsers, 'name');

export const getTypeOptions = createSelector([selectTaskType], taskTypes => typeOptions(taskTypes));
const getAuthorOptions = createSelector([selectProjectUsers], projectUsers => authorOptions(projectUsers));

const usersSelector = state => state.Project.project.users;
const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));

const agileBoardSelector = state => {
  return {
    devOpsUsers: state.UserList.devOpsUsers,
    tasks: getSortedTasks(state),
    myTasks: getMyTasks(state),
    tags: getAllTags(state),
    sortedSprints: getSortedSprints(state),
    currentSprint: getCurrentSprint(state),
    typeOptions: getTypeOptions(state),
    authorOptions: getAuthorOptions(state),
    noTagData: getNoTagData(state),
    isProjectInfoReceiving: state.Project.isProjectInfoReceiving,
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
