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
import createHash from '../../../../utils/createHash';
import * as css from '../TaskTimeReports.scss';

class TimeSheetsHistory extends Component {
  static propTypes = {
    createTimesheet: PropTypes.func.isRequired,
    currentTask: PropTypes.object,
    currentUser: PropTypes.object,
    preloaders: PropTypes.object,
    taskStatuses: PropTypes.array,
    timesheets: PropTypes.array,
    users: PropTypes.array
  };

  addTimesheet = values => {
    const { currentTask, currentUser } = this.props;

    const data = {
      ...values,
      isDraft: false,
      taskId: currentTask.id,
      sprintId: currentTask.sprintId,
      projectId: currentTask.projectId,
      typeId: 1
    };
    this.props.createTimesheet(data, this.props.currentUser.id);
  };

  render() {
    console.log('Данные компонента');
    console.log(this.props);
    const { timesheets, users, taskStatuses, currentUser, currentTask, preloaders } = this.props;
    const sortedTimesheets = sortBy(timesheets, ['onDate', 'id']).reverse();
    const timesheetsHashCodes = timesheets.map(tsh => {
      return createHash(tsh.onDate, tsh.taskStatusId, tsh.userId);
    });

    return (
      <div className={css.history}>
        <table>
          <tbody>
            <NewLine
              currentUser={currentUser}
              taskStatuses={taskStatuses}
              currentStatus={currentTask.statusId}
              onSubmit={this.addTimesheet}
              preloading={preloaders.creating}
              hashCodes={timesheetsHashCodes}
            />
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
