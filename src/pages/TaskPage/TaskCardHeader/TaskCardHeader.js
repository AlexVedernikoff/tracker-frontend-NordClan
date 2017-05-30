import React, {PropTypes} from 'react';
import Button from '../../../components/Button';
import Priority from '../Priority';
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
        <Priority/>
      </div>
      <h1 className={css.title}> {task.name}</h1>
      <ButtonGroup type="lifecircle" stage="middle" style={{marginRight: 32}}>
        <Button text="Develop" type="bordered" data-tip="Вернуть" data-place='bottom' />
        <ButtonGroup>
          <Button text="Code Review" type="green" icon='IconPause' data-tip="Приостановить" data-place='bottom' />
          <Button type="green-lighten" icon='IconClose' data-tip="Отменить" data-place='bottom' />
        </ButtonGroup>
        <Button text="QA" type="bordered" data-tip="Перевести в следующую стадию" data-place='bottom' />
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
