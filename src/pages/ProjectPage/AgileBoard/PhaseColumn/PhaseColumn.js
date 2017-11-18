import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { TASK_CARD } from '../../../../constants/DragAndDrop';
import classnames from 'classnames';

import * as css from './PhaseColumn.scss';

const columnTarget = {
  canDrop (props, monitor) {
    return props.section === monitor.getItem().section;
  },

  drop (props, monitor) {
    props.onDrop(monitor.getItem(), props.title);
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class PhaseColumn extends React.Component {

  render () {
    const {
      tasks,
      title,
      connectDropTarget,
      canDrop,
      isOver
    } = this.props;

    return (
      connectDropTarget(
      <div className={classnames({'col-xs-6 col-sm': true, [css.dropColumn]: true, [css.canDropColumn]: isOver && canDrop, [css.cantDropColumn]: isOver && !canDrop})} >
        <h4>{title}</h4>
        {tasks}
      </div>
      )
    );
  }
}

PhaseColumn.propTypes = {
  canDrop: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  section: PropTypes.string.isRequired,
  tasks: PropTypes.array,
  title: PropTypes.string.isRequired
};

export default DropTarget(TASK_CARD, columnTarget, collect)(PhaseColumn);
