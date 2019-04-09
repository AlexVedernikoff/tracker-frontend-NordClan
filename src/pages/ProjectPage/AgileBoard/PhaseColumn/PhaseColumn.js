import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { connect } from 'react-redux';
import { TASK_CARD } from '../../../../constants/DragAndDrop';
import classnames from 'classnames';

import InlineHolder from '../../../../components/InlineHolder';
import * as css from './PhaseColumn.scss';
import localize from './PhaseColumn.json';
import { LOADING_FINISH } from '../../../../constants/Loading';

const columnTarget = {
  canDrop(props, monitor) {
    return props.section === monitor.getItem().section;
  },

  drop(props, monitor) {
    props.onDrop(monitor.getItem(), props.title);
  }
};

function collect(connectDnd, monitor) {
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
    lang: PropTypes.string,
    onDrop: PropTypes.func.isRequired,
    section: PropTypes.string.isRequired,
    tasks: PropTypes.array,
    title: PropTypes.string.isRequired
  };

  render() {
    const {
      tasks,
      title,
      connectDropTarget,
      canDrop,
      isOver,
      isTasksLoad,
      allTasksLength,
      isProjectLoading,
      lang,
      isLoading
    } = this.props;

    return connectDropTarget(
      <div
        className={classnames({
          [css.dropColumn]: true,
          [css.canDropColumn]: isOver && canDrop,
          [css.cantDropColumn]: isOver && !canDrop
        })}
      >
        <h4>{`${title} (${tasks.length})`}</h4>
        {tasks.length ? (
          tasks
        ) : isLoading && !allTasksLength ? (
          <div className={css.cardHolder}>
            <InlineHolder length="70%" />
            <InlineHolder length="100%" />
            <InlineHolder length="30%" />
          </div>
        ) : (
          <span className="text-info">
            {localize[lang].TASKS_ON_STAGE} {title} {localize[lang].EXISTS}
          </span>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.Loading.loading,
  isTasksLoad: state.Tasks.isReceiving,
  isProjectLoading: state.Project.isProjectInfoReceiving,
  allTasksLength: state.Tasks.tasks.length,
  lang: state.Localize.lang
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DropTarget(TASK_CARD, columnTarget, collect)(PhaseColumn));
