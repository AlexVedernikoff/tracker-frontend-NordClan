import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import sumBy from 'lodash/sumBy';
import moment from 'moment';
import roundNum from '../../../../utils/roundNum';
import * as css from '../ProjectTimesheets.scss';
import { IconEdit } from '../../../../components/Icons';
import * as timesheetsConstants from '../../../../constants/Timesheets';
import EditSpentModal from '../EditSpentModal';
import { createTimesheet, updateTimesheet } from '../../../../actions/Timesheets';

class ActivityRow extends React.Component {
  static propTypes = {
    createTimesheet: PropTypes.func.isRequired,
    item: PropTypes.object,
    ma: PropTypes.bool,
    magicActivitiesTypes: PropTypes.array,
    startingDay: PropTypes.object,
    statuses: PropTypes.array,
    task: PropTypes.bool,
    updateTimesheet: PropTypes.func.isRequired,
    userId: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
      item: props.item,
      isEditOpen: false,
      editingSpent: null,
      timeCells: this.getTimeCells(props.item.timeSheets)
    };
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

  getTimeCells = timeSheets => {
    const timeCells = {};
    forEach(timeSheets, (tsh, i) => {
      if (tsh.spentTime) {
        timeCells[i] = roundNum(tsh.spentTime, 2);
      } else {
        timeCells[i] = 0;
      }
    });
    return timeCells;
  };

  openEditModal = tsh => {
    this.setState({
      isEditOpen: true,
      editingSpent: tsh
    });
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

    let result = null;
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
      data.sheetId = tshRef.id;
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
    const { task, ma, statuses, magicActivitiesTypes } = this.props;
    const { item, editingSpent } = this.state;
    const status = task ? find(statuses, { id: item.taskStatusId }) : '';
    const maType = ma ? find(magicActivitiesTypes, { id: item.typeId }) : '';
    const totalTime = roundNum(sumBy(item.timeSheets, tsh => +tsh.spentTime), 2);

    const timeCells = item.timeSheets.map((tsh, i) => {
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
                [css.filled]: +tsh.spentTime,
                [css.submitted]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED,
                [css.approved]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED,
                [css.rejected]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED
              })}
            >
              <input type="text" disabled value={this.state.timeCells[i]} />
              <span className={css.toggleComment}>
                <IconEdit onClick={this.openEditModal.bind(this, tsh)} />
              </span>
            </div>
          </div>
        </td>
      );
    });
    const getProjectName = () => {
      if (!item.projectName || (maType && (maType.id === 5 || maType.id === 7))) {
        return null;
      }
      return <span>{item.projectName}</span>;
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
      <tr className={css.taskRow}>
        <td>
          <div className={css.taskCard}>
            <div className={css.meta}>
              {getProjectName()}
              {getSprintName()}
              <span>{item.userName}</span>
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
          <div>{totalTime}</div>
        </td>
        {this.state.isEditOpen ? (
          <EditSpentModal
            spentId={editingSpent.id}
            spentTime={editingSpent.spentTime}
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

const mapStateToProps = state => ({
  statuses: state.Dictionaries.taskStatuses,
  magicActivitiesTypes: state.Dictionaries.magicActivityTypes,
  userId: state.Auth.user.id,
  startingDay: state.Timesheets.startingDay
});

const mapDispatchToProps = {
  createTimesheet,
  updateTimesheet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityRow);