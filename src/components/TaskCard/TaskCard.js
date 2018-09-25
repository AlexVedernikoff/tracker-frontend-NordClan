import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import * as css from './TaskCard.scss';
import RelatedTask from './RelatedTask';
import TaskCore from './TaskCore';
import classnames from 'classnames';
import { IconArrowUpThin } from '../Icons';
import { getLocalizedTaskTypes } from '../../selectors/dictionaries';

const iconStyles = {
  width: 11,
  height: 11,
  color: 'inherit',
  fill: 'currentColor'
};
const maxLength = 5;

class TaskCard extends PureComponent {
  state = {
    sub: false,
    linked: false
  };

  handleClick = name => {
    this.setState(state => ({ [name]: !state[name] }));
  };

  relatedTask = (t, mode) => {
    return (
      <RelatedTask
        key={t.id}
        onHover={this.props.lightTask}
        task={t}
        isLighted={this.props.lightedTaskId === t.id}
        mode={mode}
        prefix={this.props.task.prefix}
        projectId={this.props.task.projectId}
      />
    );
  };

  shortView = (array, mode, length = maxLength) => {
    if (array.length > length) {
      const open = array.slice(0, length);
      const hidden = array.slice(length);
      return (
        <div>
          {open.map(t => this.relatedTask(t, mode))}
          <div
            className={classnames({
              [css.subTasksBlock]: true,
              [css.subTasksShow]: this.state[mode],
              [css.subTasksHide]: !this.state[mode]
            })}
          >
            {hidden.map(t => this.relatedTask(t, mode))}
          </div>
          <div
            name={mode}
            onClick={this.handleClick.bind(this, mode)}
            className={classnames({
              [css.subTasksButton]: true,
              [css.linkedTasksButton]: mode === 'linked',
              [css.subTasksButtonOpen]: this.state[mode],
              [css.subTasksButtonClose]: !this.state[mode]
            })}
          >
            <IconArrowUpThin style={iconStyles} />
          </div>
        </div>
      );
    }
    return array.map(t => this.relatedTask(t, mode));
  };

  render() {
    const { task, lightTask, lightedTaskId, ...other } = this.props;

    const factPlanDivision = task.factExecutionTime / task.plannedExecutionTime;
    const isSubtasks = get(task, 'subTasks.length');
    const isLinkedTasks = get(task, 'linkedTasks.length');
    const isParent = task.parentTask;

    const classPriority = 'priority-' + task.prioritiesId;
    const isBug = [2, 4, 5].includes(task.typeId);
    return (
      <div className={css.taskWrapper}>
        {isParent ? (
          <RelatedTask
            onHover={lightTask}
            task={task.parentTask}
            isLighted={lightedTaskId === task.parentTask.id}
            mode="parent"
            prefix={task.prefix}
            projectId={task.projectId}
          />
        ) : null}

        <TaskCore
          {...{
            classPriority,
            lightTask,
            task,
            isBug,
            factPlanDivision,
            ...other
          }}
        />
        {isSubtasks ? <div className={css.subTasks}>{this.shortView(task.subTasks, 'sub')}</div> : null}
        {isLinkedTasks ? <div className={css.linkedTasks}>{this.shortView(task.linkedTasks, 'linked')}</div> : null}
      </div>
    );
  }
}

TaskCard.propTypes = {
  isExternal: PropTypes.bool,
  lightTask: PropTypes.func.isRequired,
  lighted: PropTypes.bool,
  lightedTaskId: PropTypes.number,
  myTaskBoard: PropTypes.any,
  onChangeStatus: PropTypes.func.isRequired,
  onOpenPerformerModal: PropTypes.func.isRequired,
  task: PropTypes.object,
  taskTypes: PropTypes.array
};

const mapStateToProps = state => ({
  taskTypes: getLocalizedTaskTypes(state)
});

export default connect(
  mapStateToProps,
  {}
)(TaskCard);
