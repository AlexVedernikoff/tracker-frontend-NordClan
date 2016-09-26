import React, {PropTypes} from 'react';
import Typography from 'material-ui/styles/typography';
import { Link } from 'react-router';

const TaskCardHeader = (props, context) => {
  const {task} = props;
  const {muiTheme} = context;
  const styles = {
    title: {
      color: muiTheme.rawTheme.palette.primary1Color,
      fontWeight: Typography.fontWeightMedium,
      fontSize: '34px',
      paddingTop: 20,
      margin: 0
    },
    info: {
      fontSize: '12px',
      color: muiTheme.rawTheme.palette.accent3Color,
      marginBottom: '30px'
    },
    a: {
      color: muiTheme.rawTheme.palette.primary1Color,
      textDecoration: 'none'
    }
  };

  return (
    <div>
      <h1 style={styles.title}>{task.id} {task.name}</h1>
      <p style={styles.info}>
        <Link to="#" style={styles.a}> {task.projectName}</Link>, создал(а)
        <Link to="#" style={styles.a}> {task.creator ? task.creator.name : ''}</Link> 28 мая 2016, выполнит -
        <Link to="#" style={styles.a}> {task.owner ? task.owner.name : ''}</Link>
      </p>
    </div>
  );
};

TaskCardHeader.propTypes = {
  task: PropTypes.object.isRequired
};

TaskCardHeader.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default TaskCardHeader;
