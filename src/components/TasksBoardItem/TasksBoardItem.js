import React, { PropTypes } from 'react';
import {Link} from 'react-router';
import Paper from 'material-ui/Paper';
import {MonthNames} from '../../constants/MonthNames';
import ButtonChangeStatus from '../../components/ButtonChangeStatus/ButtonChangeStatus';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';
import NewCommentBadge from '../../components/NewCommentBadge/NewCommentBadge';
import TaskReassignWidget from '../../components/TaskReassignWidget/TaskReassignWidget';
import { grey300, grey400, cyan700, pink300, pink700 } from 'material-ui/styles/colors';

const TaskBoardItem = (props, context) => {
  const {itemData, theme} = props;
  const { handleChangeStatus } = context;
  const styles = require('./TaskBoardItem.scss');
  const priorityColors = [pink700, pink300, cyan700, grey400, grey300];
  const inlineStyles = {
    priority: {
      borderLeftColor: priorityColors[itemData.priority - 1],
      color: theme.rawTheme.palette.alternateTextColor,
    },
    priorityBadge: {
      backgroundColor: priorityColors[itemData.priority - 1]
    },
    paper: {
      backgroundColor: theme.rawTheme.palette.alternateTextColor
    }
  };

  let date = new Date(itemData.beginDate);
  date = MonthNames[date.getMonth()] + ', ' + date.getDate();

  return (<Paper rounded={false} className={styles.paper} style={inlineStyles.paper}>
    <div className={styles.priority} style={inlineStyles.priority}>
      <div className={styles.priorityBadge} style={inlineStyles.priorityBadge}>{itemData.priority}</div>
    </div>
    <div className={styles.itemContent}>
      <div className={styles.itemHead}>
        <span className={styles.itemId}>{itemData.id}</span>
        <span className={styles.itemDate}>{date}</span>
      </div>
      <div className={styles.itemInfo}>
        <Link to={`/task/${itemData.id}`}>
          <div className={styles.taskLink}>{itemData.name}</div>
        </Link>
        <div className={styles.creatorText}>{`${itemData.projectName}, ${itemData.creatorName}`}</div>
      </div>
      <div className={styles.statusButton}>
        <ButtonChangeStatus status={itemData.status} compact id={itemData.id} handleChangeStatus={handleChangeStatus} />
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
          <TaskReassignWidget taskName={itemData.name} projectName={itemData.name} taskExpertise="Some expertise" />
        </div>
        <div className={styles.itemActionsInner}>
          <NewCommentBadge
            count={10}
            comment="Стоит ли оставлять комментарии, если их никто не читает"
            author="Яков Плэйсхолдер"
            date={itemData.planEndDate}
          />
        </div>
      </div>
    </div>
  </Paper>);
};

TaskBoardItem.propTypes = {
  itemData: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  handleChangeStatus: PropTypes.func
};

TaskBoardItem.contextTypes = {
  handleChangeStatus: PropTypes.func
};

export default TaskBoardItem;
