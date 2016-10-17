import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import {MonthNames} from '../../constants/MonthNames';
import ButtonChangeStatus from '../../components/ButtonChangeStatus/ButtonChangeStatus';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';
import NewCommentBadge from '../../components/NewCommentBadge/NewCommentBadge';
import TaskReassignWidget from '../../components/TaskReassignWidget/TaskReassignWidget';
import { grey300, grey400, cyan700, pink300, pink700 } from 'material-ui/styles/colors';

const TaskBoardItem = (props) => {
  const {itemData, theme} = props;
  const styles = require('./TaskBoardItem.scss');
  const priorityColors = [pink700, pink300, cyan700, grey400, grey300];
  const inlineStyles = {
    priority: {
      height: '100%',
      borderLeftColor: priorityColors[itemData.priority-1],
      borderLeftWidth: 5,
      borderLeftStyle: 'solid',
      position: 'absolute',
      zIndex: 2,
      top: 0,
      left: 0,
      color: theme.rawTheme.palette.alternateTextColor,
      width: 20
    },
    priorityBadge: {
      backgroundColor: priorityColors[itemData.priority-1],
      height: 20,
      textAlign: 'center',
      borderBottomRightRadius: 2,
      borderTopRightRadius: 2
    },
    taskLink: {
      color: 'rgba(0, 0, 0, 0.87)',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    },
    creatorText: {
      color: 'rgba(0, 0, 0, 0.54)',
      fontSize: '0.75em'
    },
    paper: {
      backgroundColor: theme.rawTheme.palette.alternateTextColor,
      height: 160,
      position: 'relative',
      marginBottom: 2
    }
  };

  let date = new Date(itemData.beginDate);
  date = MonthNames[date.getMonth()] + ', ' + date.getDate();

  return (<Paper rounded={false} style={inlineStyles.paper}>
    <div style={inlineStyles.priority}>
      <div style={inlineStyles.priorityBadge}>{itemData.priority}</div>
    </div>
    <div className={styles.itemContent}>
      <div className={styles.itemHead}>
        <span className={styles.itemId}>{itemData.id}</span>
        <span className={styles.itemDate}>{date}</span>
      </div>
      <div className={styles.itemInfo}>
        <Link to={`/task/${itemData.id}`}>
          <div style={inlineStyles.taskLink}>{itemData.name}</div>
        </Link>
        <div style={inlineStyles.creatorText}>{`${itemData.projectName}, ${itemData.creatorName}`}</div>
      </div>
      <div className={styles.statusButton}>
        <ButtonChangeStatus status={itemData.status} compact />
      </div>
      <div className={styles.itemProgressBar}>
        <TaskProgressBar
          spent={itemData.currentTime} planned={itemData.plannedTime}
          spentLabel={'Потрачено'}
          plannedLabel={'Планируемое'}
          style={{marginBottom: 10}}
        />
      </div>
      <div className={styles.itemActions}>
        <div className={styles.itemActionsInner}>
          <NewCommentBadge
            count={10}
            comment="Стоит ли оставлять комментарии, если их никто не читает"
            author="Яков Плэйсхолдер"
            date={itemData.planEndDate}
          />
        </div>
        <div className={styles.itemActionsInner}>
          <TaskReassignWidget taskName={itemData.name} projectName={itemData.name} taskExpertise="Some expertise" />
        </div>
      </div>
    </div>
  </Paper>);
};

TaskBoardItem.propTypes = {
  itemData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired
};

export default TaskBoardItem;
