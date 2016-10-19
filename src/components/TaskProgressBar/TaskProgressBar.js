/* компонент для отображения прогрессбара с временем задачи */
import React, {PropTypes} from 'react';
import LinearProgress from 'material-ui/LinearProgress';

const TaskProgressBar = (props, context) => {
  const css = require('./progressBar.scss');
  const {style, spentLabel, spent, plannedLabel, planned} = props;
  const {muiTheme} = context;
  const palette = muiTheme.rawTheme.palette;
  const labelStyle = {
    color: palette.primary3Color,
  };

  const renderLabel = (
    <p className={css.label} style={labelStyle}>{spentLabel} / {plannedLabel}</p>
  );
  const renderLinearProgress = (
    <LinearProgress mode="determinate" min={0} max={planned} value={spent}
      color={(planned < spent) ? palette.accent1Color : palette.primary1Color }/>
  );

  return (
    <div className={css.container} style={{...style}}>
      {() => {
        if (spentLabel && plannedLabel) return (renderLabel);
      }}
      <p className={css.hours}>{spent}/{planned}</p>
      {renderLinearProgress}
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
