import React, { PropTypes } from 'react';
import Typography from 'material-ui/styles/typography';
import { Link } from 'react-router';

const TaskCardHeader = (props, context) => {
  const { task, css } = props;
  const { muiTheme } = context;
  const styles = {
    title: {
      color: muiTheme.rawTheme.palette.primary1Color,
      fontWeight: Typography.fontWeightMedium
    },
    info: {
      color: muiTheme.rawTheme.palette.accent3Color
    },
    a: {
      color: muiTheme.rawTheme.palette.primary1Color
    }
  };

  return (
    <div>
      <h1 className={css.title} style={styles.title}>{task.id} {task.name}</h1>
      <p className={css.info} style={styles.info}>
        <Link to="#" style={styles.a}> {task.projectName}</Link>, создал(а)
        <Link to="#" style={styles.a}> {task.creator ? task.creator.name : ''}</Link> 28 мая 2016, выполнит -
        <Link to="#" style={styles.a}> {task.owner ? task.owner.name : ''}</Link>
      </p>
    </div>
  );
};

TaskCardHeader.propTypes = {
  task: PropTypes.object.isRequired,
  css: PropTypes.object
};

TaskCardHeader.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

TaskCardHeader.defaultProps = {
  css: require('./cardHeader.scss')
};

export default TaskCardHeader;
