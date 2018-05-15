import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, get, sortBy } from 'lodash';
import moment from 'moment';
import { Link } from 'react-router';
import classnames from 'classnames';

import NewLine from './NewLine';
import UserCard from '../../../../components/UserCard';
import SimplePie from '../../../../components/SimplePie';
import roundNum from '../../../../utils/roundNum';
import * as css from '../TaskTimeReports.scss';

class TimeSheetsHistory extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    taskStatuses: PropTypes.array,
    timesheets: PropTypes.array,
    users: PropTypes.array
  };

  render() {
    const { timesheets, users, taskStatuses, currentUser } = this.props;
    const sortedTimesheets = sortBy(timesheets, ['onDate', 'id']).reverse();

    return (
      <div className={css.history}>
        <table>
          <tbody>
            <NewLine currentUser={currentUser} taskStatuses={taskStatuses} />
            {sortedTimesheets.map(timesheet => {
              const user = find(users, u => timesheet.userId === u.id);
              const status = find(taskStatuses, taskStatus => timesheet.taskStatusId === taskStatus.id).name.replace(
                / play| stop/g,
                ''
              );
              const pieValue = timesheet.spentTime < 12 ? timesheet.spentTime / 12 : 1;

              return (
                <tr key={timesheet.id} className={css.historyItem}>
                  <td className={css.day}>{moment(timesheet.onDate).format('DD.MM.YYYY')}</td>
                  <td className={css.status}>{status} :</td>
                  <td className={css.pie}>
                    <SimplePie value={pieValue} size={16} />
                  </td>
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
