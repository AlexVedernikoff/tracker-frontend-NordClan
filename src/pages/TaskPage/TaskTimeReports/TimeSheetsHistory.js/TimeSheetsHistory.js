import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find } from 'lodash';

import * as css from '../TaskTimeReports.scss';

class TimeSheetsHistory extends Component {
  static propTypes = {
    taskStatuses: PropTypes.array,
    timesheets: PropTypes.array,
    users: PropTypes.array
  };

  render() {
    const { timesheets, users, taskStatuses } = this.props;

    return (
      <div className={css.history}>
        <h3>История:</h3>
        <ul>
          {timesheets.reverse().map(timesheet => (
            <li key={timesheet.id}>
              {find(users, user => timesheet.userId === user.id).fullNameRu}
              ({find(taskStatuses, taskStatus => timesheet.taskStatusId === taskStatus.id).name.replace(
                / play| stop/g,
                ''
              )}) :
              {timesheet.spentTime} ч.
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default TimeSheetsHistory;
