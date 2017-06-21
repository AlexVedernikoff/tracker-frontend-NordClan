import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { DropTarget } from 'react-dnd';
import { ItemTypes } from '../Constants';

const collumnTarget = {
  canDrop (props, monitor) {
    return props.section === monitor.getItem().section;
  },

  drop (props, monitor) {
    props.onDrop(monitor.getItem(), props.section, props.phase);
    ReactTooltip.rebuild();
  }
};

function collect (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class PhaseCollumn extends React.Component {
  renderOverlay (color) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        zIndex: 1,
        opacity: 0.5,
        backgroundColor: color
      }} />
    );
  }

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
        <div className="col-xs" style={{position: 'relative', width: '100%', height: 'inherit'}} >
          <h4>{title}</h4>
          {tasks}
          {isOver && !canDrop && this.renderOverlay('red')}
          {isOver && canDrop && this.renderOverlay('yellow')}
        </div>
        )
      );
  }
};

PhaseCollumn.propTypes = {
  canDrop: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  onDrop: PropTypes.func.isRequired,
  phase: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
  tasks: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

export default DropTarget(ItemTypes.TASK_CARD, collumnTarget, collect)(PhaseCollumn);
