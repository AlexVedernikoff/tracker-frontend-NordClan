import React from 'react';
import PropTypes from 'prop-types';
import * as css from '../TimesheetsTable.scss';
import _forEach from 'lodash/forEach';
import _sumBy from 'lodash/sumBy';
import cn from 'classnames';
import moment from 'moment/moment';
import { IconArrowDown, IconArrowUp, IconCheck, IconClose } from '../../Icons';
import roundNum from '../../../utils/roundNum';
import Button from '../../Button';

class UserRow extends React.Component {
  static propTypes = {
    approveTimesheets: PropTypes.func,
    items: PropTypes.array,
    rejectTimesheets: PropTypes.func,
    submitTimesheets: PropTypes.func,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.user.isOpen ? props.user.isOpen : false,
      activityRows: props.items
    };
  }

  getTimeCells = timeSheets => {
    const timeCells = {};
    const billableTimeCells = {};
    _forEach(timeSheets, (tsh, i) => {
      if (tsh.spentTime) {
        timeCells[i] = roundNum(tsh.spentTime, 2);
        billableTimeCells[i] = roundNum(tsh.billableTime, 2);
      } else {
        timeCells[i] = 0;
        billableTimeCells[i] = 0;
      }
    });
    return { timeCells, billableTimeCells };
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { isOpen } = this.state;
    const { user } = this.props;
    const totalTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.spentTime), 2);
    const billableTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.billableTime), 2);
    const { timeCells: timeCellsValues, billableTimeCells } = this.getTimeCells(user.timesheets);
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
          <div>
            {billableTimeCells[i]}/{timeCellsValues[i]}
          </div>
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
              <div>
                {billableTime}/{totalTime}
              </div>
            </div>
          </td>
          <td>
            <div className={css.approveContainer}>
              {user.isSubmitted ? (
                <div>
                  <Button
                    disabled={!user.isSubmitted}
                    type="green"
                    icon="IconCheck"
                    onClick={event => event.stopPropagation() || this.props.approveTimesheets(user.id)}
                  />
                  <Button
                    disabled={!user.isSubmitted}
                    type="red"
                    icon="IconClose"
                    onClick={event => event.stopPropagation() || this.props.rejectTimesheets(user.id)}
                  />
                </div>
              ) : null}
              {user.isApproved ? <IconCheck className={css.approvedIcon} /> : null}
              {user.isRejected ? <IconClose title="sdf" className={css.rejectedIcon} /> : null}
              {!user.isSubmitted &&
                !user.isApproved && (
                  <Button
                    type="green"
                    icon="IconSend"
                    onClick={event => event.stopPropagation() || this.props.submitTimesheets(user.id)}
                  />
                )}
            </div>
          </td>
        </tr>
        {isOpen ? this.props.items : null}
      </div>
    );
  }
}

export default UserRow;
