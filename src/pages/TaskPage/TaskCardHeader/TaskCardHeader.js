import React, {PropTypes} from 'react';
import StatusDropdown from '../StatusDropdown';
import PriorityDropdown from '../PriorityDropdown';

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
  css: PropTypes.object,
  task: PropTypes.object.isRequired
};

export default TaskCardHeader;
