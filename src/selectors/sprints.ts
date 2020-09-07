import { createSelector } from 'reselect';
import sortBy from 'lodash/sortBy';
import moment from 'moment';
import classnames from 'classnames';
import * as css from '../pages/ProjectPage/AgileBoard/AgileBoard.scss';

const selectSprints = state => state.Project.project.sprints;

const getSprints = unsortedSprints => {
  let sprints = sortBy(unsortedSprints, sprint => {
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

const getSortedSprints = createSelector([selectSprints], sprints => getSprints(sprints));

export default getSortedSprints;
