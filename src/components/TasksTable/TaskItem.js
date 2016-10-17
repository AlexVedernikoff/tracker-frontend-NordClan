import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import ButtonChangeStatus from '../../components/ButtonChangeStatus/ButtonChangeStatus';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';
import DeadlineDate from '../../components/DeadlineDate/DeadlineDate';
import NewCommentBadge from '../../components/NewCommentBadge/NewCommentBadge';
import TaskReassignWidget from '../../components/TaskReassignWidget/TaskReassignWidget';
import { grey300, grey400, cyan700, pink300, pink700 } from 'material-ui/styles/colors';

import css from './TasksTable.scss';

const priorityColors = [pink700, pink300, cyan700, grey400, grey300];

const TaskItem = (props, context) => {
  const { task, displayBorder, displayPriorityBadge, showTasks } = props;
  const { muiTheme, handleChangeStatus } = context;
  const styles = {
    priority: {
      height: '100%',
      borderLeftColor: priorityColors[task.priority-1],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
      position: 'relative',
      color: 'white'
    }
  };
  return (
    <TableRow selectable displayBorder={displayBorder}
      style={showTasks.hasOwnProperty(task.idProj) && !showTasks[task.idProj] ? {display: 'none'} : ''}>

      <TableRowColumn className={css.priorityBadge}>
        <div style={styles.priority}>
            <div style={displayPriorityBadge ? {backgroundColor: priorityColors[task.priority-1]} : {}}
              className={displayPriorityBadge ? css.displayTaskPriority : ''}>{task.priority}</div>
        </div>
      </TableRowColumn>

      <TableRowColumn className={css.width_50}>{task.id}</TableRowColumn>

      <TableRowColumn className={css.columnTask}>
        <ButtonChangeStatus status={task.status} compact handleChangeStatus={handleChangeStatus}/>
      </TableRowColumn>

      <TableRowColumn className={css.width_500}>
        <div>
          <Link to={`/task/${task.id}`} className={css.taskLink}>{task.name}</Link>
          <div style={{color: 'rgba(0, 0, 0, 0.54)'}}>Создал(а) задачу {task.creator.name}</div>
        </div>
      </TableRowColumn>

      <TableRowColumn className={css.columnDefault}>
        <TaskProgressBar spent={task.currentTime} planned={task.plannedTime} spentLabel={'Потрачено'}
                         plannedLabel={'Планируемое'}
                         style={{marginBottom: 10}}/>
      </TableRowColumn>

      <TableRowColumn className={css.columnDefault}>
        <DeadlineDate date={task.planEndDate} style={{fontSize: 18}}/>
      </TableRowColumn>

      <TableRowColumn className={css.columnDefault}>
        <NewCommentBadge count={10} comment="И стоит ли оставлять комментарии, если их никто не читает" author="Яков Плэйсхолдер" date={task.planEndDate} />
      </TableRowColumn>

      <TableRowColumn className={css.columnDefault}>
        <TaskReassignWidget taskName={task.name} projectName={task.name} taskExpertise="Some expertise" />
      </TableRowColumn>

    </TableRow>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    priority: PropTypes.number.isRequired,
    creator: PropTypes.object.isRequired,
    plannedTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    planEndDate: PropTypes.number,
    // TODO Еще не поддерживаются или не используются
    type: PropTypes.string,
    gainTime: PropTypes.number,
    complete: PropTypes.boolean,
    owner: PropTypes.object,
    beginDate: PropTypes.number,
    factEndDate: PropTypes.number,
    updateDate: PropTypes.number,
    idProj: PropTypes.string,
    attachments: PropTypes.array
  }),
  displayBorder: PropTypes.bool,
  displayPriorityBadge: PropTypes.bool,
  showTasks: PropTypes.object,
  handleChangeStatus: PropTypes.func
};

TaskItem.contextTypes = {
  muiTheme: PropTypes.object.isRequired,
  handleChangeStatus: PropTypes.func
};

export default TaskItem;
