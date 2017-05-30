import React, {PropTypes} from 'react';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

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
      <ButtonGroup type="lifecircle" stage="middle">
        <Button text="Develop" type="bordered" />
        <div style={{display: 'inline-block'}}>
          <Button text="Code Review" type="green" icon='IconPlay' />
          <Button type="green-lighten" icon='IconClose' />
        </div>
        <Button text="QA" type="bordered" />
      </ButtonGroup>
      <hr />
    </div>
  );
};

TaskCardHeader.propTypes = {
  css: PropTypes.object,
  task: PropTypes.object.isRequired
};

export default TaskCardHeader;
