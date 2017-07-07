import React from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { TASK_ROW } from '../../../../constants/DragAndDrop';
import TaskRow from '../../../../components/TaskRow';

const taskRowSource = {
  beginDrag (props) {
    return {
      id: props.task.id,
      previousSprint: props.task.sprint
    };
  }
};

function collect (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

class DraggableTaskRow extends React.Component {

  constructor (props) {
    super(props);
  }

  render () {
    const {
      connectDragSource,
      ...other
    } = this.props;

    return (
      connectDragSource(
        <div>
          <TaskRow {...other}/>
        </div>
      )
    );
  }
}

DraggableTaskRow.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(TASK_ROW, taskRowSource, collect)(DraggableTaskRow);
