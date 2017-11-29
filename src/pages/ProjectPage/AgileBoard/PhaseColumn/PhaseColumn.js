import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { TASK_CARD } from '../../../../constants/DragAndDrop';
import classnames from 'classnames';

import InlineHolder from '../../../../components/InlineHolder';
import * as css from './PhaseColumn.scss';

const columnTarget = {
  canDrop (props, monitor) {
    return props.section === monitor.getItem().section;
  },

  drop (props, monitor) {
    props.onDrop(monitor.getItem(), props.title);
  }
};

function collect (connectDnd, monitor) {
  return {
    connectDropTarget: connectDnd.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class PhaseColumn extends React.Component {

  static propTypes = {
    allTasksLength: PropTypes.number.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isProjectLoading: PropTypes.bool,
    isTasksLoad: PropTypes.bool,
    onDrop: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    tasks: PropTypes.array,
    title: PropTypes.string.isRequired
  }

  render () {
    const {
      tasks,
      title,
      connectDropTarget,
      canDrop,
      isOver,
      isTasksLoad,
      allTasksLength,
      isProjectLoading
    } = this.props;

    return (
      connectDropTarget(
      <div className={classnames({'col-xs-6 col-sm': true, [css.dropColumn]: true, [css.canDropColumn]: isOver && canDrop, [css.cantDropColumn]: isOver && !canDrop})} >
        <h4>{title}</h4>
        {
          tasks.length
          ? tasks
          : isTasksLoad || isProjectLoading && !allTasksLength
          ? <div className={css.cardHolder}>
              <InlineHolder length={7} />
              <InlineHolder length={15} />
              <InlineHolder length={3} />
            </div>
          : <span className="text-info">Задачи в стадии {title} отсутсвуют</span>
        }
      </div>
      )
    );
  }
}

const mapStateToProps = state => ({
  isTasksLoad: state.Tasks.isReceiving,
  isProjectLoading: state.Project.isProjectInfoReceiving,
  allTasksLength: state.Tasks.tasks.length
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(DropTarget(TASK_CARD, columnTarget, collect)(PhaseColumn));
