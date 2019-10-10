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
import { connect } from 'react-redux';
import localize from './UserRow.json';
import ConfirmModal from '../../ConfirmModal';

class UserRow extends React.Component {
  static propTypes = {
    approveTimesheets: PropTypes.func,
    items: PropTypes.array,
    lang: PropTypes.string,
    rejectTimesheets: PropTypes.func,
    submitTimesheets: PropTypes.func,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.user.isOpen ? props.user.isOpen : false,
      activityRows: props.items,
      isConfirmModalOpen: false
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

  submitTimeSheetsModal = () => {
    this.props.rejectTimesheets(this.props.user.id);
    this.setState({ isConfirmModalOpen: false });
  };

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  get cellsData() {
    const { user } = this.props;
    const { timeCells: timeCellsValues, billableTimeCells } = this.getTimeCells(user.timesheets);
    const fullWeekEmployed = [];

    const timeCells = user.timesheets.map((tsh, i) => {
      const key = `${i}-${user.id}`;
      const time = `${billableTimeCells[i]}/${timeCellsValues[i]}`;

      const employeeNotEmployed = (() => {
        const momentemploymentDate = moment(user.employmentDate, 'DD.MM.YYYY');
        const momentCurrentDate = moment(tsh.onDate);
        const result = momentCurrentDate.isBefore(momentemploymentDate);

        fullWeekEmployed.push(result);

        return result;
      })();

      const classNames = (() => {
        const isToday = moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD');

        return cn(css.total, css.totalRow, {
          [css.today]: isToday,
          [css.weekend]: i === 5 || i === 6,
          [css.employeeNotEmployed]: employeeNotEmployed
        });
      })();

      return (
        <td key={key} className={classNames}>
          <div>{time}</div>
        </td>
      );
    });

    const isNotFullWeekEmployed = fullWeekEmployed.every(Boolean);

    return { timeCells, isNotFullWeekEmployed };
  }

  render() {
    const { isOpen, isConfirmModalOpen } = this.state;
    const { user, lang } = this.props;
    const totalTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.spentTime), 2);
    const billableTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.billableTime), 2);
    const { timeCells, isNotFullWeekEmployed } = this.cellsData;

    return (
      <div className={css.psuedoRow}>
        <tr onClick={this.toggle} className={css.userRow}>
          <td>
            <div className={css.activityHeader}>
              <div className={css.activityHeaderText}>
                <span className={css.activityHeaderTextElement}>{user.userName}</span>
                <span className={css.activityHeaderTextElement}>{user.employmentDate}</span>
              </div>
              <div className={css.activityHeaderIcon}>{isOpen ? <IconArrowUp /> : <IconArrowDown />}</div>
            </div>
          </td>
          {timeCells}
          <td className={cn(css.total, css.totalRow)}>
            <div>
              <div
                className={cn({
                  [css.employeeNotEmployed]: isNotFullWeekEmployed
                })}
              >
                {billableTime}/{totalTime}
              </div>
            </div>
          </td>
          <td>
            <div className={css.approveContainer}>
              {user.isSubmitted ? (
                <div>
                  <Button
                    disabled={!user.timesheets.length}
                    type="green"
                    icon="IconCheck"
                    title={localize[lang].APPROVE}
                    onClick={event => event.stopPropagation() || this.props.approveTimesheets(user.id)}
                  />
                  <Button
                    disabled={!user.timesheets.length}
                    type="red"
                    icon="IconClose"
                    title={localize[lang].REJECT}
                    onClick={event => event.stopPropagation() || this.props.rejectTimesheets(user.id)}
                  />
                </div>
              ) : null}
              {user.isApproved ? (
                <span title={localize[lang].APPROVED}>
                  <div className={css.actionsWrap}>
                    <Button
                      disabled={!user.timesheets.length}
                      type="red"
                      icon="IconClose"
                      title={localize[lang].REJECT}
                      onClick={event => event.stopPropagation() || this.openConfirmModal()}
                    />
                    <IconCheck className={css.approvedIcon} />
                  </div>
                </span>
              ) : null}
              {user.isRejected ? (
                <span title={localize[lang].REJECTED}>
                  <IconClose className={css.rejectedIcon} />
                </span>
              ) : null}
              {!user.isSubmitted &&
                !user.isApproved && (
                  <Button
                    type={isNotFullWeekEmployed ? 'default' : 'green'}
                    icon="IconSend"
                    disabled={!user.timesheets.length || isNotFullWeekEmployed}
                    title={localize[lang].SUBMIT}
                    onClick={event => event.stopPropagation() || this.props.submitTimesheets(user.id)}
                  />
                )}
            </div>
          </td>
        </tr>
        {isOpen ? this.props.items : null}
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          contentLabel="modal"
          text={localize[lang].SUBMIT_CONFIRM}
          onCancel={this.closeConfirmModal}
          onConfirm={this.submitTimeSheetsModal}
          onRequestClose={this.closeConfirmModal}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(UserRow);
