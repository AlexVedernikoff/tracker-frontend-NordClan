import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, get } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';

import UserCard from '../../../../components/UserCard';
import roundNum from '../../../../utils/roundNum';
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
        <table>
          <tbody>
            {timesheets
              .sort((a, b) => moment(a.onDate) - moment(b.onDate))
              .reverse()
              .map(timesheet => {
                const user = find(users, u => timesheet.userId === u.id);
                const status = find(taskStatuses, taskStatus => timesheet.taskStatusId === taskStatus.id).name.replace(
                  / play| stop/g,
                  ''
                );

                return (
                  <tr key={timesheet.id} className={css.historyItem}>
                    <td className={css.day}>{moment(timesheet.onDate).format('DD.MM.YYYY')}</td>
                    <td className={css.status}>{status} :</td>
                    <td className={css.time}>{roundNum(timesheet.spentTime, 2)} ч.</td>
                    <td className={css.user}>
                      <UserCard user={user}>
                        <Link>{get(user, 'fullNameRu')}</Link>
                      </UserCard>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default TimeSheetsHistory;
