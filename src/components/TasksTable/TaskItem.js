import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import ButtonChangeStatus from '../../components/ButtonChangeStatus/ButtonChangeStatus';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';
import DeadlineDate from '../../components/DeadlineDate/DeadlineDate';
import NewCommentBadge from '../../components/NewCommentBadge/NewCommentBadge';
import TaskReassignWidget from '../../components/TaskReassignWidget/TaskReassignWidget';

const TaskItem = (props, context) => {
  const { task, displayBorder, displayPriorityBadge } = props;
  const { muiTheme } = context;
  const styles = {
    priority: {
      height: '100%',
      borderLeftColor: muiTheme.rawTheme.palette.primary1Color,
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
      position: 'relative',
      color: 'white'
    },
    priorityBadge: {
      backgroundColor: muiTheme.rawTheme.palette.primary1Color,
      height: 20,
      textAlign: 'center',
      borderBottomRightRadius: 2,
      borderTopRightRadius: 2
    },
    taskLink: {
      color: 'rgba(0, 0, 0, 0.87)',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }
  };
  return (
    <TableRow selectable displayBorder={displayBorder}>
      <TableRowColumn style={{width: 20, padding: 0}}>
        <div style={styles.priority}>
            <div style={displayPriorityBadge ? styles.priorityBadge : {}}>{task.priority}</div>
        </div>
      </TableRowColumn>
      <TableRowColumn style={{padding: 0, minWidth: 50}}>{task.id}</TableRowColumn>
      <TableRowColumn style={{minWidth: 64, padding: 5, textAlign: 'center'}}>
        <ButtonChangeStatus status={task.status} compact/>
      </TableRowColumn>
      <TableRowColumn style={{padding: 0}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Link to={`/task/${task.id}`} style={styles.taskLink}>{task.name}</Link>
          <div style={{color: 'rgba(0, 0, 0, 0.54)'}}>Создал(а) задачу {task.creatorName}</div>
        </div>
      </TableRowColumn>
      <TableRowColumn style={{minWidth: 110, padding: 0}}>
        <TaskProgressBar spent={task.currentTime} planned={task.plannedTime} spentLabel={'Потрачено'}
                         plannedLabel={'Планируемое'}
                         style={{marginBottom: 10}}/>
      </TableRowColumn>
      <TableRowColumn style={{width: 210, minWidth: 110, padding: '0px 5px', textAlign: 'center'}}>
        <DeadlineDate date={task.planEndDate} style={{fontSize: 18}}/>
      </TableRowColumn>
      <TableRowColumn style={{minWidth: 60, padding: '0px 5px', textAlign: 'center'}}>
        <NewCommentBadge count={10} comment="Стоит ли оставлять комментарии, если их никто не читает" author="Яков Плэйсхолдер" date={task.planEndDate} />
      </TableRowColumn>
      <TableRowColumn style={{minWidth: 60, padding: '0px 5px', textAlign: 'center'}}>
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
    creator: PropTypes.string.isRequired,
    plannedTime: PropTypes.number.isRequired,
    currentTime: PropTypes.number.isRequired,
    planEndDate: PropTypes.number,
    creatorName: PropTypes.string.isRequired,
    // TODO Еще не поддерживаются или не используются
    type: PropTypes.string,
    gainTime: PropTypes.number,
    complete: PropTypes.boolean,
    owner: PropTypes.string,
    beginDate: PropTypes.number,
    factEndDate: PropTypes.number,
    updateDate: PropTypes.number,
    idProj: PropTypes.string,
    attachments: PropTypes.array
  }),
  displayBorder: PropTypes.bool,
  displayPriorityBadge: PropTypes.bool
};

TaskItem.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default TaskItem;
