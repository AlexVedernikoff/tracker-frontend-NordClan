import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';

import { IconPlay, IconPause } from '../Icons';
import * as css from './SprintCard.scss';

const SprintCard = (props) => {
  const {
    sprint,
    ...other
  } = props;

  return (
    <div className={css.sprintCard} {...other}>
      <Link to="/projects/1/sprints/1" className={css.sprintTitle}>Спринт №1</Link>
      <p className={css.sprintMeta}>
        <span>Дата начала:</span>
        <span>05.06.2017</span>
      </p>
      <p className={css.sprintMeta}>
        <span>Дата окончания:</span>
        <span>30.06.2017</span>
      </p>
      <p className={css.sprintMeta}>
        <span>Всего задач:</span>
        <span>35</span>
      </p>
      <p className={css.sprintMeta}>
        <span>Выполнено:</span>
        <span>11</span>
      </p>
      <div className={css.status}>
        <IconPlay/>
      </div>
    </div>
  );
};

SprintCard.propTypes = {
  sprint: PropTypes.object
};

export default SprintCard;
