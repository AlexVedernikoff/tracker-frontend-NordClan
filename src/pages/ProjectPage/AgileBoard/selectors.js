import { createSelector } from 'reselect';
import _ from 'lodash';
import moment from 'moment';
import classnames from 'classnames';
import * as css from './AgileBoard.scss';

const selectTasks = state => state.Tasks.tasks;

const isFilterEmpty = (initialFilters, filtersState) => {
  const filterKeys = [...Object.keys(initialFilters), 'isOnlyMine'];
  let isEmpty = true;
  filterKeys.forEach(key => {
    if (Array.isArray(filtersState[key]) && filtersState[key].length === 0) {
      return;
    } else if ([null, '', false].indexOf(filtersState[key]) === -1) {
      isEmpty = false;
    }
  });
  return isEmpty;
};

const getAllTags = tasks => {
  let allTags = tasks.reduce((arr, task) => {
    return arr.concat(task.tags ? task.tags.map(tags => tags.name) : []);
  }, []);

  allTags = _.uniq(allTags);

  return allTags.map(tag => ({
    value: tag,
    label: tag
  }));
};

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
      task.linkedTasks.concat(task.subTasks, task.parentTask).map(relatedTask => _.get(relatedTask, 'id', null));
    });
  }

  return taskArray;
};

export const getTasks = createSelector([selectTasks], tasks => filterTasks(tasks));

const getSprints = () => {
  let sprints = _.sortBy(this.props.sprints, sprint => {
    return new moment(sprint.factFinishDate);
  });

  sprints = sprints.map(sprint => ({
    value: sprint.id,
    label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${
      sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}` : '- ...'
    })`,
    statusId: sprint.statusId,
    className: classnames({
      [css.INPROGRESS]: sprint.statusId === 2,
      [css.sprintMarker]: true,
      [css.FINISHED]: sprint.statusId === 1
    })
  }));

  sprints.push({
    value: 0,
    label: 'Backlog',
    className: classnames({
      [css.INPROGRESS]: false,
      [css.sprintMarker]: true
    })
  });
  return sprints;
};

const getCurrentSprint = sprints => {
  const processedSprints = sprints.filter(sprint => {
    return sprint.statusId === 2;
  });

  const currentSprints = processedSprints.filter(sprint => {
    return moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]');
  });

  return currentSprints.length ? currentSprints[0].id : processedSprints.length ? processedSprints[0].id : 0;
};

const getSprintTime = sprintId => {
  if (!sprintId) return false;
  let currentSprint = {};
  this.props.sprints.forEach(sprint => {
    if (sprint.id === sprintId) {
      currentSprint = sprint;
    }
  });
  return `${currentSprint.spentTime || 0} / ${currentSprint.riskBudget || 0}`;
};
