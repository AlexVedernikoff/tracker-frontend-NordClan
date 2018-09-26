import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import * as css from './TaskCard.scss';
import RelatedTask from './RelatedTask';
import TaskCore from './TaskCore';
import classnames from 'classnames';
// import { IconPlus } from '../Icons';
import { IconArrowUpThin } from '../Icons';
import { IconArrowDownThin } from '../Icons';
import { getLocalizedTaskTypes } from '../../selectors/dictionaries';
class TaskCard extends PureComponent {
  state = {
    isOpen: false
  };

  handleClick = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { task, lightTask, lightedTaskId, ...other } = this.props;

    const factPlanDivision = task.factExecutionTime / task.plannedExecutionTime;
    const isSubtasks = get(task, 'subTasks.length');
    const isLinkedTasks = get(task, 'linkedTasks.length');
    const isParent = task.parentTask;

    const classPriority = 'priority-' + task.prioritiesId;
    const isBug = [2, 4, 5].includes(task.typeId);

    const iconStyles = {
      width: 11,
      height: 11,
      color: 'inherit',
      fill: 'currentColor'
    };

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

        {isSubtasks ? (
          <div className={css.subTasks}>
            {isSubtasks > 5 ? (
              <div>
                {task.subTasks.map(
                  (subTask, key) =>
                    key <= 4 ? (
                      <RelatedTask
                        key={subTask.id}
                        onHover={lightTask}
                        task={subTask}
                        isLighted={lightedTaskId === subTask.id}
                        mode="sub"
                        prefix={task.prefix}
                        projectId={task.projectId}
                      />
                    ) : null
                )}
                <div
                  className={classnames({
                    [css.subTasksBlock]: true,
                    [css.subTasksShow]: this.state.isOpen,
                    [css.subTasksHide]: !this.state.isOpen
                  })}
                >
                  {task.subTasks.map(
                    (subTask, key) =>
                      key > 4 ? (
                        <RelatedTask
                          key={subTask.id}
                          onHover={lightTask}
                          task={subTask}
                          isLighted={lightedTaskId === subTask.id}
                          mode="sub"
                          prefix={task.prefix}
                          projectId={task.projectId}
                        />
                      ) : null
                  )}
                </div>
                <div onClick={this.handleClick} className={css.subTasksButton}>
                  {this.state.isOpen ? (
                    <IconArrowUpThin style={iconStyles} />
                  ) : (
                    <IconArrowDownThin style={iconStyles} />
                  )}
                </div>
              </div>
            ) : (
              <div>
                {task.subTasks.map(subTask => (
                  <RelatedTask
                    key={subTask.id}
                    onHover={lightTask}
                    task={subTask}
                    isLighted={lightedTaskId === subTask.id}
                    mode="sub"
                    prefix={task.prefix}
                    projectId={task.projectId}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}

        {isLinkedTasks ? (
          <div className={css.linkedTasks}>
            {task.linkedTasks.map(linkedTask => (
              <RelatedTask
                key={linkedTask.id}
                onHover={lightTask}
                task={linkedTask}
                isLighted={lightedTaskId === linkedTask.id}
                mode="linked"
                prefix={task.prefix}
                projectId={task.projectId}
              />
            ))}
          </div>
        ) : null}
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
