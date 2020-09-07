import cn from 'classnames';

import { IN_PROGRESS, FINISHED } from '../../constants/SprintStatuses';
import * as css from './markers.scss';

export const getSprintMarkersClass = statusId =>
  cn({
    [css.green]: statusId === IN_PROGRESS,
    [css.gray]: statusId === FINISHED,
    [css.marker]: true
  });
