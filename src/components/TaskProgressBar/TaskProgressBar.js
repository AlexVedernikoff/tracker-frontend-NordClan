/* компонент для отображения прогрессбара с временем задачи */
import React, {PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';

const TaskProgressBar = (props, context) => {
  const {style, spentLabel, spent, plannedLabel, planned} = props;
  const {muiTheme} = context;
  const styles = {
    container: {
      width: '100%',
      textAlign: 'center',
      ...style
    },
    label: {
      fontSize: 12,
      color: muiTheme.rawTheme.palette.primary3Color,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      margin: 0
    },
    hours: {
      fontSize: 20,
      lineHeight: '14px',
      marginBottom: 10
    }
  };
  return (
    <div style={styles.container}>
      {() => {
        if (spentLabel && plannedLabel) return (<p style={styles.label}>{spentLabel} / {plannedLabel}</p>);
      }}
      <p style={styles.hours}>{spent}/{planned}</p>
      <LinearProgress mode="determinate" min={0} max={planned} value={spent}
                      color={(planned < spent) ? muiTheme.rawTheme.palette.accent1Color : muiTheme.rawTheme.palette.primary1Color }/>
    </div>
  );
};

TaskProgressBar.propTypes = {
  spent: PropTypes.number,
  planned: PropTypes.number,
  spentLabel: PropTypes.string.isRequired,
  plannedLabel: PropTypes.string.isRequired,
  style: PropTypes.object
};

TaskProgressBar.defaultProps = {
  spent: 0,
  planned: 0
};

TaskProgressBar.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};
export default TaskProgressBar;
