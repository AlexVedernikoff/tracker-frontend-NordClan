import React, {PropTypes} from 'react';
import Button from '../../../components/Button';
import Priority from '../Priority';
import ButtonGroup from '../../../components/ButtonGroup';
import TaskTitle from '../TaskTitle';

const TaskHeader = (props) => {
  const {task} = props;
  const css = require('./TaskHeader.scss');

  return (
    <div>
      <div className={css.parentTask}>
        <div className={css.prefix} data-tip="Родительская задача ">PPJ-56320</div><a href="#" className={css.parentTaskName}>UI: Add to gulp build tasks for css and js minification</a>
      </div>
      <div className={css.taskTopInfo}>
        <div className={css.prefix}>PPJ-56321</div>
        <div>
          <span>Фича / Задача</span>
        </div>
        <Priority/>
      </div>
      <TaskTitle name={task.name} />
      <ButtonGroup type="lifecircle" stage="full" style={{marginRight: 32}}>
        <Button text="New" type="bordered" data-tip="Перевести в стадию New" data-place='bottom' />
        <Button text="Develop" type="bordered" data-tip="Перевести в стадию Develop" data-place='bottom' />
        <ButtonGroup>
          <Button text="Code Review" type="green" icon='IconPause' data-tip="Приостановить" data-place='bottom' />
          <Button type="green-lighten" icon='IconClose' data-tip="Отменить" data-place='bottom' />
        </ButtonGroup>
        <Button text="QA" type="bordered" data-tip="Перевести в стадию QA" data-place='bottom' />
        <Button text="Done" type="bordered" data-tip="Перевести в стадию Done" data-place='bottom' />
      </ButtonGroup>
      <hr />
    </div>
  );
};

TaskHeader.propTypes = {
  css: PropTypes.object,
  task: PropTypes.object.isRequired
};

export default TaskHeader;
