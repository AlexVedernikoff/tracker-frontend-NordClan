import React from 'react';
import PropTypes from 'prop-types';
import * as css from '../ProjectTimesheets.scss';
import _forEach from 'lodash/forEach';
import _sumBy from 'lodash/sumBy';
import { IconArrowDown, IconArrowUp } from '../../../../components/Icons';
import * as timesheetsConstants from '../../../../constants/Timesheets';
import cn from 'classnames';
import moment from 'moment/moment';
import roundNum from '../../../../utils/roundNum';

class UserRow extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.user.isOpen ? props.user.isOpen : false,
      user: props.user,
      activityRows: props.items,
      timeCells: this.getTimeCells(props.user.timesheets)
    };
  }

  getTimeCells = timeSheets => {
    const timeCells = {};
    _forEach(timeSheets, (tsh, i) => {
      if (tsh.spentTime) {
        timeCells[i] = roundNum(tsh.spentTime, 2);
      } else {
        timeCells[i] = 0;
      }
    });
    return timeCells;
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { user, activityRows, isOpen } = this.state;
    const canDeleteRow = !user.tasks.find(
      tsh =>
        tsh.id &&
        (tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
          tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED)
    );
    const totalTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.spentTime), 2);

    const timeCells = user.timesheets.map((tsh, i) => {
      return (
        <td
          key={`${i}-${user.id}`}
          className={cn({
            [css.total]: true,
            [css.totalRow]: true,
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}
        >
          <div>{this.state.timeCells[i]}</div>
        </td>
      );
    });

    return (
      <div className={css.psuedoRow}>
        <tr onClick={this.toggle} className={css.userRow}>
          <td>
            <div className={css.activityHeader}>
              {user.userName} {isOpen ? <IconArrowUp /> : <IconArrowDown />}
            </div>
          </td>
          {timeCells}
          <td className={cn(css.total, css.totalRow)}>
            <div>
              <div>{totalTime}</div>
            </div>
          </td>
        </tr>
        {isOpen ? this.props.items : null}
      </div>
    );
  }
}

export default UserRow;
