import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import * as css from './TaskCard.scss';
import RelatedTask from './RelatedTask';
import TaskCore from './TaskCore';
class TaskCard extends PureComponent {
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

        {isSubtasks ? (
          <div className={css.subTasks}>
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
  taskTypes: state.Dictionaries.taskTypes
});

export default connect(
  mapStateToProps,
  {}
)(TaskCard);
