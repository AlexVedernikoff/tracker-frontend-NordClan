import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import debounce from 'lodash/debounce';
import forEach from 'lodash/forEach';
import find from 'lodash/find';
import sumBy from 'lodash/sumBy';
import remove from 'lodash/remove';
import moment from 'moment';
import roundNum from '../../../utils/roundNum';
import validateNumber from '../../../utils/validateNumber';
import SingleComment from './SingleComment';
import TotalComment from './TotalComment';
import * as css from '../Timesheets.scss';
import { IconClose } from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal';
import * as timesheetsConstants from '../../../constants/Timesheets';
import {
  createTimesheet,
  updateTimesheet,
  deleteTimesheets,
  deleteTempTimesheets,
  editTempTimesheet
} from '../../../actions/Timesheets';
import EditActivityProjectModal from '../../../components/EditActivityProjectModal';
import localize from './activityRow.json';
import { getLocalizedTaskStatuses, getLocalizedMagicActiveTypes } from '../../../selectors/dictionaries';

class ActivityRow extends React.Component {
  static propTypes = {
    createTimesheet: PropTypes.func,
    deleteTempTimesheets: PropTypes.func,
    deleteTimesheets: PropTypes.func,
    editTempTimesheet: PropTypes.func,
    item: PropTypes.object,
    lang: PropTypes.string,
    ma: PropTypes.bool,
    magicActivitiesTypes: PropTypes.array,
    startingDay: PropTypes.object,
    statuses: PropTypes.array,
    task: PropTypes.bool,
    updateTimesheet: PropTypes.func,
    userId: PropTypes.number
  };

  constructor(props) {
    super(props);

    const debounceTime = 1000;

    this.deleteTimesheets = debounce(this.deleteTimesheets, debounceTime);
    this.debouncedUpdateTimesheet = debounce(this.updateTimesheet, debounceTime * 2);
    this.debouncedCreateTimesheet = debounce(this.createTimesheet, debounceTime * 2);

    this.state = {
      hl: false,
      isOpen: false,
      isProjectEditModalOpen: false,
      timeCells: this.getTimeCells(props.item.timeSheets)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.item.hilight && !this.state.hl) {
      this.setState({ hl: true }, () => setTimeout(() => this.setState({ hl: false }), 1000));
      if (this.row) {
        this.row.scrollIntoView();
      }
    }
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

  getTimeCells = timeSheets => {
    const timeCells = {};
    forEach(timeSheets, (tsh, i) => {
      if (tsh.id && !~tsh.id.toString().indexOf('temp')) {
        timeCells[i] = roundNum(tsh.spentTime, 2);
      } else {
        timeCells[i] = 0;
      }
    });
    return timeCells;
  };

  createTimesheet = i => {
    const { item, userId, startingDay } = this.props;
    const value = this.state.timeCells[i].toString().replace(',', '.');
    this.props.createTimesheet(
      {
        isDraft: false,
        taskId: item.id || null,
        taskStatusId: item.id ? item.taskStatusId : null,
        typeId: item.id ? '1' : item.typeId,
        spentTime: +value,
        onDate: moment(startingDay)
          .weekday(i)
          .format('YYYY-MM-DD'),
        projectId: item.projectId,
        sprintId: item.sprintId || (item.sprint ? item.sprint.id : null)
      },
      userId,
      startingDay
    );
  };

  updateTimesheet = (i, sheetId, comment) => {
    const value = this.state.timeCells[i].toString().replace(',', '.');
    const { userId, startingDay } = this.props;
    if (!value && !comment) {
      this.props.deleteTimesheets([sheetId], userId, startingDay);
      return;
    }
    this.props.updateTimesheet(
      {
        sheetId,
        spentTime: +value
      },
      userId,
      startingDay
    );
  };

  editTempActivity = id => updatedFields => {
    this.props.editTempTimesheet(id, updatedFields);
  };

  deleteTimesheets = ids => {
    const { userId, startingDay } = this.props;
    this.props.deleteTimesheets(ids, userId, startingDay);
  };

  changeEmpty = (i, value) => {
    if (!validateNumber(value) || +value > 24) {
      return false;
    }

    this.setState(
      state => {
        const timeCells = {
          ...state.timeCells
        };

        timeCells[i] = value;

        return {
          timeCells
        };
      },
      () => {
        if (value !== '') {
          this.debouncedCreateTimesheet(i);
        }
      }
    );
  };

  changeEmptyComment = (text, i) => {
    const { item, userId, startingDay } = this.props;
    this.props.createTimesheet(
      {
        isDraft: false,
        taskId: item.id || null,
        taskStatusId: item.id ? item.taskStatusId : null,
        typeId: item.id ? '1' : item.typeId,
        comment: text,
        spentTime: 0,
        onDate: moment(startingDay)
          .weekday(i)
          .format('YYYY-MM-DD'),
        projectId: item.projectId,
        sprintId: item.sprintId ? item.sprintId : null
      },
      userId,
      startingDay
    );
  };

  changeFilled = (i, id, comment, value) => {
    if (!validateNumber(value) || +value > 24) {
      return false;
    }

    this.setState(
      state => {
        const timeCells = {
          ...state.timeCells
        };

        timeCells[i] = value;

        return {
          timeCells
        };
      },
      () => {
        this.debouncedUpdateTimesheet(i, id, comment);
      }
    );
  };

  onBlurFilled = (i, id, comment, value) => {
    if (this.state.timeCells[i] !== +value) {
      this.debouncedUpdateTimesheet.flush();
    }

    if (value === '') {
      this.resetCell(i);
    }
  };

  onBlurEmpty = (i, value) => {
    if (value !== '') {
      if (this.state.timeCells[i] !== +value) {
        this.debouncedCreateTimesheet.flush();
      }
    } else {
      this.resetCell(i);
    }
  };

  resetCell = i => {
    this.setState(state => {
      const timeCells = {
        ...state.timeCells
      };
      timeCells[i] = 0;
      return {
        timeCells
      };
    });
  };

  changeFilledComment = (text, time, i, sheetId) => {
    const { userId, startingDay } = this.props;
    if (+time || text) {
      this.props.updateTimesheet(
        {
          sheetId,
          comment: text
        },
        userId,
        startingDay
      );
    } else {
      this.deleteTimesheets([sheetId]);
    }
  };

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  openProjectEditModal = () => {
    this.setState({ isProjectEditModalOpen: true });
  };

  closeProjectEditModal = () => {
    this.setState({ isProjectEditModalOpen: false });
  };

  deleteActivity = ids => {
    const { userId, startingDay } = this.props;
    const realSheetIds = ids.filter(id => !~id.toString().indexOf('temp'));
    const tempSheetIds = ids.filter(id => ~id.toString().indexOf('temp'));

    if (realSheetIds.length) {
      this.props.deleteTimesheets(realSheetIds, userId, startingDay);
    }

    if (tempSheetIds.length) {
      this.props.deleteTempTimesheets(tempSheetIds);
    }

    this.closeConfirmModal();
  };

  getRef = ref => (this.row = ref);

  render() {
    const { item, task, ma, statuses, magicActivitiesTypes, lang } = this.props;
    const status = task ? find(statuses, { id: item.taskStatusId }) : '';
    const maType = ma ? find(magicActivitiesTypes, { id: item.typeId }) : '';
    const totalTime = roundNum(sumBy(item.timeSheets, tsh => +tsh.spentTime), 2);
    const timeSheetIds = remove(item.timeSheets.map(tsh => tsh.id), tsh => tsh);
    const canDeleteRow = !item.timeSheets.find(
      tsh =>
        tsh.id &&
        (tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
          tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED)
    );
    const tempCell = item.timeSheets.find(tsh => tsh.id && tsh.id.toString().includes('temp'));
    const isTempRow = !!tempCell;

    const timeCells = item.timeSheets.map((tsh, i) => {
      if (tsh.id && !~tsh.id.toString().indexOf('temp')) {
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
                className={cn({
                  [css.timeCell]: true,
                  [css.filled]: +tsh.spentTime && tsh.statusId === 1,
                  [css.submitted]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED,
                  [css.approved]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED,
                  [css.rejected]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED
                })}
              >
                <input
                  type="text"
                  disabled={!canDeleteRow}
                  value={this.state.timeCells[i]}
                  onChange={e => this.changeFilled(i, tsh.id, tsh.comment, e.target.value)}
                  onBlur={e => this.onBlurFilled(i, tsh.id, tsh.comment, e.target.value)}
                />
                {tsh.doubleTimesheets && tsh.doubleTimesheets.length ? (
                  <span
                    className={css.doubleTimesheets}
                    title={localize[lang].DELETE_DUBLICATE}
                    onClick={() =>
                      this.deleteTimesheets(tsh.doubleTimesheets.map(doubleTimesheet => doubleTimesheet.id))
                    }
                  >
                    + {tsh.doubleTimesheets.reduce((res, cur) => +cur.spentTime + res, 0)}
                  </span>
                ) : (
                  ''
                )}
                <span className={css.toggleComment}>
                  <SingleComment
                    disabled={!canDeleteRow}
                    comment={tsh.comment}
                    onChange={text => this.changeFilledComment(text, tsh.spentTime, i, tsh.id)}
                  />
                </span>
              </div>
            </div>
          </td>
        );
      } else {
        return (
          <td
            key={i}
            className={cn({
              [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
              [css.weekend]: i === 5 || i === 6
            })}
          >
            <div>
              <div className={css.timeCell}>
                <input
                  type="text"
                  disabled={!canDeleteRow}
                  value={this.state.timeCells[i]}
                  onChange={e => this.changeEmpty(i, e.target.value)}
                  onBlur={e => this.onBlurEmpty(i, e.target.value)}
                />
                <span className={css.toggleComment}>
                  <SingleComment disabled={!canDeleteRow} onChange={text => this.changeEmptyComment(text, i)} />
                </span>
              </div>
            </div>
          </td>
        );
      }
    });
    const getProjectName = () => {
      if (!item.projectName || (maType && (maType.id === 5 || maType.id === 7))) {
        return null;
      }

      return item.projectName ? (
        ma && maType.id !== 5 && maType.id !== 7 && canDeleteRow ? (
          <a onClick={() => this.openProjectEditModal()}>{item.projectName}</a>
        ) : (
          <span>{item.projectName}</span>
        )
      ) : null;
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
    return (
      <tr ref={this.getRef} className={cn(css.taskRow, { [css.taskRowHighLighted]: this.state.hl })}>
        <td>
          <div className={css.taskCard}>
            <div className={css.meta}>
              {getProjectName()}
              {getSprintName()}
              {status ? <span>{status.name}</span> : null}
            </div>
            <div>
              {task && <Link to={`/projects/${item.projectId}/tasks/${item.id}`}>{item.name}</Link>}
              {ma && maType && <span>{maType.name}</span>}
            </div>
          </div>
        </td>
        {timeCells}
        <td className={cn(css.total, css.totalRow)}>
          <div>
            <div>{totalTime}</div>
            <div className={css.toggleComment}>
              <TotalComment items={item.timeSheets} isDisable={!canDeleteRow} />
            </div>
          </div>
        </td>
        <td className={cn(css.actions)}>
          <div className={css.deleteTask} onClick={this.openConfirmModal} data-tip={localize[lang].DELETE}>
            {canDeleteRow ? <IconClose /> : null}
          </div>
          {this.state.isConfirmModalOpen ? (
            <ConfirmModal
              isOpen
              contentLabel="modal"
              text={localize[lang].CONFIRM_MESSAGE}
              onCancel={this.closeConfirmModal}
              onConfirm={() => this.deleteActivity(timeSheetIds)}
              onRequestClose={this.closeConfirmModal}
            />
          ) : null}
          {this.state.isProjectEditModalOpen ? (
            <EditActivityProjectModal
              contentLabel="modal"
              isOpen
              onCancel={this.closeProjectEditModal}
              selectedProject={item.projectId}
              onConfirm={isTempRow ? this.editTempActivity(tempCell.id) : () => {}}
              text={localize[lang].CHOOSE_PROJECT}
            />
          ) : null}
        </td>
      </tr>
    );
  }
}

const mapStateToProps = state => ({
  statuses: getLocalizedTaskStatuses(state),
  magicActivitiesTypes: getLocalizedMagicActiveTypes(state),
  userId: state.Auth.user.id,
  startingDay: state.Timesheets.startingDay,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  createTimesheet,
  updateTimesheet,
  deleteTimesheets,
  deleteTempTimesheets,
  editTempTimesheet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityRow);
