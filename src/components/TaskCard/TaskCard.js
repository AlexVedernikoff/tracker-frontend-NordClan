import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconPlus, IconClose } from '../Icons';
import * as css from './TaskCard.scss';

const TaskCard = (props) => {
  const {
    task,
    ...other
  } = props;

  const classPriority = 'priority-' + task.priority;

  return (
    <div className={classnames([css.taskCard], [css[classPriority]])}>
      <h5>{task.name}</h5>
      {/*<p>{task.status}</p>*/}
      {/*<p>{task.priority}</p>*/}
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.object
};

export default TaskCard;
