import React, {PropTypes} from 'react';

const TasksBoard = (props) => {
  const {viewSettings} = props;
  return (
    <div>
      {viewSettings}
      <div>
        Board view
      </div>
    </div>
  );
};

TasksBoard.propTypes = {
  viewSettings: PropTypes.object
};

export default TasksBoard;
