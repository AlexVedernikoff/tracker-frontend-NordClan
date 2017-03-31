import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import StatusDropdown from '../StatusDropdown/StatusDropdown';

const TaskCardHeader = (props) => {
  const {task} = props;

  const css = require('./TaskCardHeader.scss');

  return (
    <div>
      <div className={css.taskId}>
        <StatusDropdown />
        <span className={css.status + ' ' + css.inProgress}>В процессе</span>
        PPJ-56321
      </div>
      <h1 className={css.title}> {task.name}</h1>
      <p className={css.info}>
        <Link to="#"> {task.projectName}</Link>, создал(а)
        <Link to="#"> {task.creator ? task.creator.name : ''}</Link> 28 мая 2016, выполнит -
        <Link to="#"> {task.owner ? task.owner.name : ''}</Link>
      </p>
    </div>
  );
};

TaskCardHeader.propTypes = {
  task: PropTypes.object.isRequired,
  css: PropTypes.object
};

export default TaskCardHeader;
