import React, {PropTypes} from 'react';
import Button from '../../../components/Button';

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
        <Button text="Предыдущий статус" type="primary" />
        <Button text="Текущий статус" type="secondary" />
        <Button text="Следующий статус" type="primary" />
      <hr />
    </div>
  );
};

TaskCardHeader.propTypes = {
  css: PropTypes.object,
  task: PropTypes.object.isRequired
};

export default TaskCardHeader;
