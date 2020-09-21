import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import * as css from '../TimesheetsTable.scss';
import EditSpentModal from '../EditSpentModal';
import localize from './ActivityRow.json';
import { updateTimesheet } from '../../../actions/TimesheetPlayer';
import { createTimesheet } from '../../../actions/Timesheets';
import { getLocalizedTaskStatuses, getMagicActiveTypes } from '../../../selectors/dictionaries';
import { IconComment, IconEdit, IconCheck, IconClose } from '../../Icons';
import * as timesheetsConstants from '../../../constants/Timesheets';
import roundNum from '../../../utils/roundNum';
import { checkIsAdminInProject } from '../../../utils/isAdmin';
import Button from '../../Button';
import ConfirmModal from '../../ConfirmModal';
import ReactTooltip from 'react-tooltip';

interface TimeSheet {
  projectId: number
  spentTime
  onDate
  statusId: number
  userId: number
  isBillable: boolean
  id
  sprint
  comment
  taskStatusId
  typeId
}

interface Sprint {
  name: string
}

interface Item {
  timeSheets: TimeSheet[]
  projectId: number
  taskStatusId
  typeId
  projectName: string | null
  userName: string
  id: string
  name: string
  sprint: Sprint
}

interface Project {
  isRejected: boolean
  isSubmitted: boolean
  isApproved: boolean
  projectId: number
  dateUpdate: string
}

interface User {
  isOpen
  employmentDate: string
}

interface Props {
  approveTimesheets: Function
  createTimesheet: Function
  isFirstInProject: boolean
  isSingleProjectPage: boolean
  item: Item
  lang: string
  ma: boolean
  magicActivitiesTypes: {}[]
  project: Project
  rejectTimesheets: Function
  startingDay: {}
  statuses: {}[]
  submitTimesheets: Function
  task: boolean
  updateTimesheet: Function
  user: User
}

interface State {
  project: Project
  item: Item
  editingSpent: TimeSheet | null
  isEditDisabled: boolean
  isOpen: boolean
  isConfirmModalOpen: boolean
  isEditOpen: boolean
  isFirstInProject: boolean
  isSingleProjectPage: boolean
  timeCells: { [id: number]: number }
}

class ActivityRow extends React.Component<Props, State> {
  static propTypes = {
    approveTimesheets: PropTypes.func,
    createTimesheet: PropTypes.func.isRequired,
    isFirstInProject: PropTypes.bool,
    isSingleProjectPage: PropTypes.bool,
    item: PropTypes.object,
    lang: PropTypes.string,
    ma: PropTypes.bool,
    magicActivitiesTypes: PropTypes.array,
    project: PropTypes.object,
    rejectTimesheets: PropTypes.func,
    startingDay: PropTypes.object,
    statuses: PropTypes.array,
    submitTimesheets: PropTypes.func,
    task: PropTypes.bool,
    updateTimesheet: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: props.user.isOpen ? props.user.isOpen : false,
      item: props.item,
      isEditDisabled: false,
      isEditOpen: false,
      isFirstInProject: props.isFirstInProject !== null ? props.isFirstInProject : false,
      isConfirmModalOpen: false,
      isSingleProjectPage: props.isSingleProjectPage ? props.isSingleProjectPage : false,
      editingSpent: null,
      timeCells: this.getTimeCells(props.item.timeSheets),
      project: props.project
    };
  }

  componentDidMount() {
    ReactTooltip.rebuild();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.item !== nextProps.item) {
      const currentTimeSheets = this.props.item.timeSheets;
      const nextTimeSheets = nextProps.item.timeSheets;
      const timeCells = { ...this.state.timeCells };

      nextTimeSheets.forEach((nextTimesheet, index) => {
        if (this.getTimeCell(currentTimeSheets[index]) !== this.getTimeCell(nextTimesheet)) {
          timeCells[index] = this.getTimeCell(nextTimesheet);
        }
      });

      this.setState({
        timeCells
      });
    }
  }

  getTimeCell = timeSheet => {
    return roundNum(timeSheet.spentTime, 2);
  };

  getTimeCells = (timeSheets: TimeSheet[]) => {
    const timeCells: { [id: number]: number } = {};
    forEach(timeSheets, (tsh: TimeSheet, i: number) => {
      if (tsh.spentTime) {
        timeCells[i] = roundNum(tsh.spentTime, 2);
      } else {
        timeCells[i] = 0;
      }
    });
    return timeCells;
  };

  openEditModal = (tsh, isEditDisabled: boolean) => {
    this.setState({
      isEditDisabled,
      isEditOpen: true,
      editingSpent: tsh
    });
  };

  submitTimeSheetsModal = (userId, projectId) => {
    this.props.rejectTimesheets(userId, projectId);
    this.setState({ isConfirmModalOpen: false });
  };

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  closeEditModal = () => {
    this.setState({
      isEditOpen: false,
      editingSpent: null
    });
  };

  setTimesheetData = (tshRef, data) => {
    tshRef.spentTime = data.spentTime;
    tshRef.comment = data.comment;
    tshRef.sprint = data.sprint;
    tshRef.isBillable = data.isBillable;
    const timeCells = this.getTimeCells(this.props.item.timeSheets);
    this.setState({
      timeCells
    });
  };

  saveTimesheet = (tsh, tshRef) => {
    const tshPrev = { ...tshRef };
    const { item } = this.state;
    this.setTimesheetData(tshRef, tsh);

    let result = null as unknown as Promise<any>;
    const data = {
      isDraft: false,
      onDate: moment(tshRef.onDate).format('YYYY-MM-DD'),
      projectId: item.projectId ? item.projectId : null,
      spentTime: roundNum(tshRef.spentTime, 2),
      sprintId: tshRef.sprint ? tshRef.sprint.id : null,
      taskId: tshRef.task ? tshRef.task.id : null,
      taskStatusId: tshRef.taskStatusId ? tshRef.taskStatusId : null,
      userId: tshRef.userId,
      typeId: tshRef.typeId ? tshRef.typeId : 1,
      comment: tshRef.comment,
      isBillable: tshRef.isBillable
    };
    if (tshRef.id) {
      (data as any).sheetId = tshRef.id;
      result = this.props.updateTimesheet(data, tshRef.userId, tshRef.onDate);
    } else {
      result = this.props.createTimesheet(data, tshRef.userId, tshRef.onDate);
    }

    result
      .then(response => {
        if (response.data && response.data.id) {
          this.setTimesheetData(tshRef, response.data);
        } else if (response.id && response.typeId === 2) {
          // different response type for magic acivity
          this.setTimesheetData(tshRef, response);
        }
      })
      .catch(() => {
        this.setTimesheetData(tshRef, tshPrev); // rollback
      });

    this.closeEditModal();
  };

  render() {
    const { task, ma, statuses, magicActivitiesTypes, lang, user } = this.props;

    const { project, item, isEditDisabled, isOpen, isConfirmModalOpen } = this.state;
    const editingSpent = this.state.editingSpent as TimeSheet;
    const status = task ? find(statuses, { id: item.taskStatusId }) : '';
    const maType = ma ? find(magicActivitiesTypes, { id: item.typeId }) : '';
    const totalTime = roundNum(sumBy(item.timeSheets, tsh => +tsh.spentTime), 2);
    const totalBillableTime = roundNum(sumBy(item.timeSheets, tsh => (tsh.isBillable ? +tsh.spentTime : 0)), 2);
    let userId = 0;

    const timeCells = item.timeSheets.map((tsh, i) => {
      userId = tsh.userId;

      let isTimeEditable = true;
      if (
        tsh.statusId !== timesheetsConstants.TIMESHEET_STATUS_APPROVED &&
        checkIsAdminInProject(user, tsh.projectId)
      ) {
        isTimeEditable = false;
      }

      return (
        <td
          key={moment(tsh.onDate).format('X')}
          className={cn({
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}
        >
          <div>
            <div
              onClick={event => { event.stopPropagation(); this.openEditModal(tsh, isTimeEditable) }}
              className={cn({
                [css.timeCell]: true,
                [css.hasValue]: +tsh.spentTime,
                [css.notBillabe]: !tsh.isBillable,
                [css.filled]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_FILLED,
                [css.submitted]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED,
                [css.approved]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED,
                [css.rejected]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED
              })}
            >
              <input type="text" disabled value={this.state.timeCells[i]} />
              <span
                className={css.toggleComment}
                onClick={event => { event.stopPropagation(); this.openEditModal(tsh, isTimeEditable) }}
              >
                {isTimeEditable ? (
                  <IconComment onClick={this.openEditModal.bind(this, tsh, isTimeEditable)} />
                ) : (
                  <IconEdit onClick={this.openEditModal.bind(this, tsh, isTimeEditable)} />
                )}
              </span>
            </div>
          </div>
        </td>
      );
    });
    const getProjectName = () => {
      return <span>{item.projectName ? item.projectName : ''}</span>;
    };
    const getSprintName = () => {
      if (maType && (maType.id === 5 || maType.id === 7 || item.projectId === 0)) {
        return null;
      }
      if (item.sprint) {
        return <span>{item.sprint.name}</span>;
      }
      return <span>{'Backlog'}</span>;
    };

    const checkEmployed = () => {
      const fullWeekEmployed: boolean[] = [];
      item.timeSheets.map(tsh => {
        const momentemploymentDate = moment(user.employmentDate, 'DD.MM.YYYY');
        const momentCurrentDate = moment(tsh.onDate);
        const result = momentCurrentDate.isBefore(momentemploymentDate);

        fullWeekEmployed.push(result);
      });

      const isNotFullWeekEmployed = fullWeekEmployed.every(Boolean);
      return isNotFullWeekEmployed;
    };

    if (this.state.isFirstInProject === true) {
      return (
        <tr className={css.taskRow}>
          <td className={css.meta}>{getProjectName()}</td>
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td />
          <td>
            <div className={css.approveContainer}>
              {project.isSubmitted ? (
                <div>
                  <Button
                    disabled={!item.timeSheets.length}
                    type="green"
                    icon="IconCheck"
                    title={localize[lang].APPROVE}
                    onClick={event =>
                      event.stopPropagation() || this.props.approveTimesheets(userId, project.projectId)
                    }
                  />
                  <Button
                    disabled={!item.timeSheets.length}
                    type="red"
                    icon="IconClose"
                    title={localize[lang].REJECT}
                    onClick={event => event.stopPropagation() || this.props.rejectTimesheets(userId, project.projectId)}
                  />
                </div>
              ) : null}
              {project.isApproved ? (
                <span>
                  <div className={css.actionsWrap}>
                    <Button
                      disabled={!item.timeSheets.length}
                      type="red"
                      icon="IconClose"
                      title={localize[lang].REJECT}
                      onClick={event => event.stopPropagation() || this.openConfirmModal()}
                    />
                    <IconCheck
                      data-tip={
                        project.projectId !== 0 && project.dateUpdate
                          ? localize[lang].APPROVED + ' ' + project.dateUpdate
                          : localize[lang].APPROVED
                      }
                      className={css.approvedIcon}
                    />
                  </div>
                </span>
              ) : null}
              {project.isRejected ? (
                <span>
                  <IconClose
                    data-tip={
                      project.projectId !== 0 && project.dateUpdate
                        ? localize[lang].REJECTED + ' ' + project.dateUpdate
                        : localize[lang].REJECTED
                    }
                    className={css.rejectedIcon}
                  />
                </span>
              ) : null}
              {!project.isSubmitted &&
                !project.isApproved && (
                  <Button
                    type={'green'}
                    icon="IconSend"
                    disabled={!item.timeSheets.length || checkEmployed()}
                    title={localize[lang].SUBMIT}
                    onClick={event => event.stopPropagation() || this.props.submitTimesheets(userId, project.projectId)}
                  />
                )}
            </div>
          </td>
          {isOpen ? this.props.item : null}
          <ConfirmModal
            isOpen={isConfirmModalOpen}
            contentLabel="modal"
            text={localize[lang].SUBMIT_CONFIRM}
            onCancel={this.closeConfirmModal}
            onConfirm={event => event.stopPropagation() || this.submitTimeSheetsModal(userId, project.projectId)}
            onRequestClose={this.closeConfirmModal}
          />
        </tr>
      );
    } else {
      return (
        <tr className={css.taskRow}>
          <td>
            <div className={css.taskCard}>
              <div className={css.meta}>
                {ma && maType && <span>{localize[lang].MAGIC_ACTIVITY}</span>}
                {getProjectName()}
                {getSprintName()}
                <span>{item.userName}</span>
                {status ? <span>{status.name}</span> : null}
              </div>
              <div>
                {task && <Link to={`/projects/${item.projectId}/tasks/${item.id}`}>{item.name}</Link>}
                {ma && maType && <span className={css.magicActivity}>{localize[lang][maType.codename]}</span>}
              </div>
            </div>
          </td>
          {timeCells}

          <td className={cn(css.total, css.totalRow)}>
            <div>
              {totalBillableTime}/{totalTime}
            </div>
          </td>
          <td />
          {this.state.isEditOpen ? (
            <EditSpentModal
              disabled={isEditDisabled}
              spentId={editingSpent.id}
              spentTime={editingSpent.spentTime}
              projectId={item.projectId}
              sprint={editingSpent.sprint}
              comment={editingSpent.comment}
              isMagic={ma}
              isBillable={editingSpent.isBillable}
              taskStatusId={editingSpent.taskStatusId}
              typeId={editingSpent.typeId}
              onClose={this.closeEditModal}
              onSave={this.saveTimesheet}
              timesheet={editingSpent}
            />
          ) : null}
        </tr>
      );
    }
  }
}

const mapStateToProps = state => ({
  statuses: getLocalizedTaskStatuses(state),
  magicActivitiesTypes: getMagicActiveTypes(state),
  user: state.Auth.user,
  startingDay: state.Timesheets.startingDay,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  createTimesheet,
  updateTimesheet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityRow);
