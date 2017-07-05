import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import moment from 'moment';

import { IconPlay, IconPause } from '../Icons';
import * as css from './SprintCard.scss';

const SprintCard = props => {
  const { sprint, ...other } = props;

  return (
    <div
      className={classnames([css.sprintCard], [css[sprint.status]])}
      {...other}
    >
      <Link to="/projects/1/sprints/1" className={css.sprintTitle}>
        {sprint.name}
      </Link>
      <p className={css.sprintMeta}>
        <span>Дата начала:</span>
        <span>
          {moment(sprint.factStartDate).format('DD.MM.YYYY')}
        </span>
      </p>
      {sprint.factFinishDate
        ? <p className={css.sprintMeta}>
            <span>Дата окончания:</span>
            <span>
              {moment(sprint.factFinishDate).format('DD.MM.YYYY')}
            </span>
          </p>
        : null}

      <p className={css.sprintMeta}>
        <span>Всего задач:</span>
        <span>
          {sprint.tasksTotal || 0}
        </span>
      </p>
      <p className={css.sprintMeta}>
        <span>Выполнено:</span>
        <span>
          {sprint.tasksDone || 0}
        </span>
      </p>
      <div
        className={classnames({
          [css.status]: true,
          [css.inprogress]: sprint.status === 'INPROGRESS',
          [css.inhold]: sprint.status === 'INHOLD'
        })}
        data-tip={sprint.status === 'INPROGRESS' ? 'Остановить' : 'Запустить'}
      >
        {sprint.status === 'INPROGRESS' ? <IconPause /> : <IconPlay />}
      </div>
    </div>
  );
};

SprintCard.propTypes = {
  sprint: PropTypes.object
};

SprintCard.defaultProps = {
  sprint: {
    name: 'Название спринта',
    dateStart: '00.00.00',
    dateEnd: '00.00.00',
    tasksTotal: '00',
    tasksDone: '00',
    status: 'INPROGRESS'
  }
};

export default SprintCard;
