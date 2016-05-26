import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';
import DeadlineDate from '../../components/DeadlineDate/DeadlineDate';
import Add from 'material-ui/svg-icons/content/add';
import NewCommentBadge from '../../components/NewCommentBadge/NewCommentBadge';
import {AccountSwitch} from '../../components/Icons/Icons';

const TaskItem = (props, context) => {
  const { index, task, displayBorder, hasSamePriorityAsPrevious } = props;
  const { muiTheme } = context;
  const styles = {
    status: {
      height: '100%',
      borderLeftColor: muiTheme.rawTheme.palette.primary1Color,
      borderLeftWidth: '5px',
      borderLeftStyle: 'solid',
      position: 'relative',
      color: 'white'
    },
    statusBadge: {
      backgroundColor: muiTheme.rawTheme.palette.primary1Color,
      height: 20,
      textAlign: 'center',
      borderBottomRightRadius: 2,
      borderTopRightRadius: 2
    },
  };

  return (
    <TableRow selectable displayBorder={displayBorder}>
      <TableRowColumn style={{width: 20, padding: 0}}>
        <div style={styles.status}>
          {
            hasSamePriorityAsPrevious &&
            <div style={styles.statusBadge}>2</div>
          }
        </div>
      </TableRowColumn>
      <TableRowColumn style={{padding: 0, minWidth: 50}}>{index}1234</TableRowColumn>
      <TableRowColumn style={{minWidth: 64, padding: 5, textAlign: 'center'}}><Add /></TableRowColumn>
      <TableRowColumn style={{minWidth: 310, padding: 0}}>
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <Link to={`/task/${task._id}`} style={{color: 'rgba(0, 0, 0, 0.87)'}}>Нарисовать макет сайта под все разрешения</Link>
          <div style={{color: 'rgba(0, 0, 0, 0.54)'}}>Создал(а) задачу {task.name}</div>
        </div>
      </TableRowColumn>
      <TableRowColumn style={{minWidth: 110, padding: 0}}>
        <TaskProgressBar spent={10} planned={100} spentLabel={'Потрачено'}
                         plannedLabel={'Планируемое'}
                         style={{marginBottom: 10}}/>
      </TableRowColumn>
      <TableRowColumn style={{width: 210, minWidth: 110, padding: '0px 5px', textAlign: 'center'}}>
        <DeadlineDate date={{day: 16, month: 'мая'}} style={{fontSize: 18}}/>
      </TableRowColumn>
      <TableRowColumn style={{minWidth: 60, padding: '0px 5px', textAlign: 'center'}}>
        <NewCommentBadge/>
      </TableRowColumn>
      <TableRowColumn style={{minWidth: 60, padding: '0px 5px', textAlign: 'center'}}>
        <AccountSwitch/>
      </TableRowColumn>
    </TableRow>
  );
};

TaskItem.propTypes = {
  index: PropTypes.number,
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    isActive: PropTypes.bool.isRequired,
    status: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    about: PropTypes.string.isRequired,
    deadline: PropTypes.string.isRequired
  }),
  displayBorder: PropTypes.bool,
  hasSamePriorityAsPrevious: PropTypes.bool
};

TaskItem.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default TaskItem;
