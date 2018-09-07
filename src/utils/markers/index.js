import cn from 'classnames';

import { IN_PROGRESS, FINISHED } from '../../constants/SprintStatuses';
import * as css from './markers.scss';

export const getMarkerClass = config => {
  const activeColor = Object.keys(config).find(color => config[color]);
  const classObj = {
    [css.marker]: true
  };

  if (activeColor) {
    classObj[css[activeColor]] = true;
  }

  return cn(classObj);
};

export const getSprintMarkersClass = statusId =>
  getMarkerClass({
    green: statusId === IN_PROGRESS,
    gray: statusId === FINISHED
  });
