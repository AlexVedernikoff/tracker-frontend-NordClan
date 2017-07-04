import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../Constants';
import classnames from 'classnames';

import * as css from './SprintColumn.scss';

const columnTarget = {
  drop (props, monitor) {
    props.onDrop(monitor.getItem(), props.sprint);
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class SprintColumn extends React.Component {

  render () {
      const {
        tasks,
        connectDropTarget,
        isOver
      } = this.props;

      return (
        connectDropTarget(
          <div className={classnames({[css.dropColumn]: true, [css.canDropColumn]: isOver})} >
            {tasks}
          </div>
        )
      );
  }
}

SprintColumn.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  sprint: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired
};

export default DropTarget(ItemTypes.TASK_ROW, columnTarget, collect)(SprintColumn);
