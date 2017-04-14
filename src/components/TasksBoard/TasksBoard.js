import React, { PropTypes } from 'react';
import TasksBoardItem from '../TasksBoardItem/TasksBoardItem';

const TasksBoard = (props) => {
  const { viewSettings, tasks, theme, styles } = props;
  const firstColumn = [];
  const middleColumn = [];
  const lastColumn = [];

  tasks.map((item, key) => {
    switch (item.priority) {
      case 1:
      case 2:
        firstColumn.push(<TasksBoardItem key={key} itemData={item} theme={theme} />);
        break;
      case 3:
        middleColumn.push(<TasksBoardItem key={key} itemData={item} theme={theme} />);
        break;
      case 4:
      case 5:
        lastColumn.push(<TasksBoardItem key={key} itemData={item} theme={theme} />);
        break;
      default:
        break;
    }
  });

  return (
    <div>
      {viewSettings}
      <div className={styles.gridListStyles}>
        <div style={{ width: '30%' }}>
          {firstColumn.map(jsxItem => jsxItem)}
        </div>
        <div style={{ width: '30%' }}>
          {middleColumn.map(jsxItem => jsxItem)}
        </div>
        <div style={{ width: '30%' }}>
          {lastColumn.map(jsxItem => jsxItem)}
        </div>
      </div>
    </div>
  );
};

TasksBoard.propTypes = {
  viewSettings: PropTypes.object,
  theme: PropTypes.object,
  tasks: PropTypes.array,
  styles: PropTypes.object
};

TasksBoard.defaultProps = {
  styles: require('./taskBoard.scss')
};

export default TasksBoard;
