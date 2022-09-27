import React from 'react';
import PropTypes, { shape, bool, array, string, func, object, number, arrayOf } from 'prop-types';
import css from '../TimesheetsTable.scss';
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
import ReactTooltip from 'react-tooltip';

interface User {
  active: number;
  userName: string;
  isApproved: boolean;
  isOpen: boolean;
  isRejected: boolean;
  isSubmitted: boolean;
  employmentDate: number;
  id: number;
  timesheets: {
    approvedByUserId: number,
    billableTime: string,
    onDate: string,
    spentTime: string
  }[];
}

interface Project {
  isRejected: boolean;
  isSubmitted: boolean;
  isApproved: boolean;
  projectId: number;
  dateUpdate: string;
}

interface Props {
  approveTimesheets: Function;
  isApproved: boolean;
  isDisabled: boolean;
  isRejected: boolean;
  isSubmitted: boolean;
  items: {}[];
  lang: string;
  projects: Project[];
  projectId: string;
  rejectTimesheets: Function;
  submitTimesheets: Function;
  user: User;
  users: {
    get: (id: number) => User
  };
}

interface State {
  isOpen: boolean;
  isConfirmModalOpen: boolean;
  activityRows: {}[];
}

class UserRow extends React.Component<Props, State> {
  static propTypes = {
    approveTimesheets: func.isRequired,
    isApproved: bool,
    isDisabled: bool,
    isRejected: bool,
    isSubmitted: bool,
    items: array,
    lang: string,
    projectId: string,
    projects: PropTypes.array,
    rejectTimesheets: func.isRequired,
    submitTimesheets: func.isRequired,
    user: shape({
      userName: string,
      isApproved: bool,
      isOpen: bool,
      isRejected: bool,
      isSubmitted: bool,
      id: number,
      timesheets: arrayOf(
        shape({
          approvedByUserId: number,
          billableTime: string,
          onDate: string,
          spentTime: string
        })
      )
    }),
    users: object
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: props.user.isOpen ? props.user.isOpen : false,
      activityRows: props.items,
      isConfirmModalOpen: false
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
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
    this.props.rejectTimesheets(this.props.user.id, this.props.projectId);
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
    const fullWeekEmployed: boolean[] = [];

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
    const { users, user, lang, projectId, isApproved, isSubmitted, isRejected, isDisabled } = this.props;
    const totalTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.spentTime), 2);
    const billableTime = roundNum(_sumBy(user.timesheets, tsh => +tsh.billableTime), 2);
    const { timeCells, isNotFullWeekEmployed } = this.cellsData;
    const notEnoughTotalHours = billableTime < 40;

    return (
      <div className={css.psuedoRow}>
        <tr onClick={this.toggle} className={css.userRow}>
          <td>
            <div className={css.activityHeader}>
              <div className={css.activityHeaderText}>
                <span className={css.activityHeaderTextElement}>{user.userName}</span>
                <span className={css.activityHeaderTextElement}>{user.employmentDate}</span>
              </div>
              {user.active === 0 && (
                <div>
                  <IconClose className={css.dissIcon} />
                </div>
              )}
              <div className={css.activityHeaderIcon}>{isOpen ? <IconArrowUp /> : <IconArrowDown />}</div>
            </div>
          </td>
          {timeCells}
          <td className={cn(css.total, css.totalRow)}>
            <div>
              <div
                className={cn({
                  [css.notEnough]: notEnoughTotalHours,
                  [css.employeeNotEmployed]: isNotFullWeekEmployed
                })}
              >
                {billableTime}/{totalTime}
              </div>
            </div>
          </td>
          <td>
            <div className={css.approveContainer}>
              {isSubmitted ? (
                <div>
                  <Button
                    disabled={!user.timesheets.length || isDisabled}
                    type="green"
                    icon="IconCheck"
                    title={localize[lang].APPROVE}
                    onClick={event => event.stopPropagation() || this.props.approveTimesheets(user.id, projectId)}
                  />
                  <Button
                    disabled={!user.timesheets.length || isDisabled}
                    type="red"
                    icon="IconClose"
                    title={localize[lang].REJECT}
                    onClick={event => event.stopPropagation() || this.props.rejectTimesheets(user.id, projectId)}
                  />
                </div>
              ) : null}
              {isApproved ? (
                <span>
                  <div className={css.actionsWrap}>
                    <Button
                      disabled={!user.timesheets.length || isDisabled}
                      type="red"
                      icon="IconClose"
                      title={localize[lang].REJECT}
                      onClick={event => event.stopPropagation() || this.openConfirmModal()}
                    />
                    <IconCheck data-tip={localize[lang].APPROVED} className={css.approvedIcon} />
                  </div>
                </span>
              ) : null}
              {isRejected ? (
                <span>
                  <IconClose data-tip={localize[lang].REJECTED} className={css.rejectedIcon} />
                </span>
              ) : null}
              {!isSubmitted &&
                !isApproved && (
                  <Button
                    type={isNotFullWeekEmployed ? 'default' : 'green'}
                    icon="IconSend"
                    disabled={!user.timesheets.length || isNotFullWeekEmployed || isDisabled}
                    title={localize[lang].SUBMIT}
                    onClick={event => event.stopPropagation() || this.props.submitTimesheets(user.id, projectId)}
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
