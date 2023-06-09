import React from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { TASK_ROW } from '../../../../constants/DragAndDrop';
import Pagination from '../../../../components/Pagination';
import classnames from 'classnames';

import css from './SprintColumn.scss';

const columnTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem(), props.sprint);
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

class SprintColumn extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1
    };
  }

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      () => this.props.loadTasks(e, this.props.name, this.state.activePage)
    );
  };

  render() {
    const { tasks, connectDropTarget, isOver } = this.props;

    return connectDropTarget(
      <div className={classnames({ [css.dropColumn]: true, [css.canDropColumn]: isOver })}>
        {tasks}
        {this.props.pagesCount > 1 ? (
          <Pagination
            itemsCount={this.props.pagesCount}
            activePage={this.state.activePage}
            onItemClick={this.handlePaginationClick}
          />
        ) : null}
      </div>
    );
  }
}

(SprintColumn as any).propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  loadTasks: PropTypes.func,
  name: PropTypes.string,
  onDrop: PropTypes.func.isRequired,
  pagesCount: PropTypes.number,
  sprint: PropTypes.number.isRequired,
  tasks: PropTypes.array.isRequired
};

export default DropTarget(TASK_ROW, columnTarget, collect)(SprintColumn);
