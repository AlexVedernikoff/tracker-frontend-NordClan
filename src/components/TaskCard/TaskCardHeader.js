import React, {PropTypes} from 'react';
import StatusDropdown from '../StatusDropdown/StatusDropdown';
import PriorityDropdown from '../PriorityDropdown/PriorityDropdown';

const TaskCardHeader = (props) => {
  const {task} = props;

  const css = require('./TaskCardHeader.scss');

  return (
    <div>
      <div className={css.taskTopInfo}>
        <div>PPJ-56321</div>
        <div>
          <span>Фича / Задача</span>
        </div>
      </div>
      <h1 className={css.title}> {task.name}</h1>
        <StatusDropdown />
        <PriorityDropdown />
      <hr />
    </div>
  );
};

TaskCardHeader.propTypes = {
  task: PropTypes.object.isRequired,
  css: PropTypes.object
};

export default TaskCardHeader;
