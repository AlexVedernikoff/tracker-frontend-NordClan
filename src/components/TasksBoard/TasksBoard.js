import React, {PropTypes} from 'react';
import TasksBoardItem from '../TasksBoardItem/TasksBoardItem';
import {GridList} from 'material-ui/GridList';

const TasksBoard = (props) => {
  const { viewSettings, tasks } = props;

  const gridListStyles = {
    'width': '100%',
    'marginBottom': 24
  };

  const taskList = tasks.map( (item, key) => {
    return <TasksBoardItem key={key} itemData={item} containerElement="span" />;
  });

  return (
    <div>
      {viewSettings}
      <div className="tasksBoardWrap">
        <GridList cols={ 3 } padding={ 10 } style={gridListStyles} children={ taskList } />
      </div>
    </div>
  );
};

TasksBoard.propTypes = {
  viewSettings: PropTypes.object,
  tasks: PropTypes.array
};

export default TasksBoard;
