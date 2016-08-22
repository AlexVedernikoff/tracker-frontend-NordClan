import React, { PropTypes } from 'react';

const TaskBoardItem = (props) => {
  const { itemData } = props;
  const styles = require('./TasksBoardItem.scss');

  return (
    <div className={styles.TaskBoardItem}>{itemData.name}</div>
  );
};

TaskBoardItem.propTypes = {
  itemData: PropTypes.object.isRequired
};

export default TaskBoardItem;
