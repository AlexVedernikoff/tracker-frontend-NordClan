import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import roundNum from '../../../../utils/roundNum';
import * as css from '../ProjectTimesheets.scss';
import { IconEdit } from '../../../../components/Icons';
import * as timesheetsConstants from '../../../../constants/Timesheets';
import EditSpentModal from '../EditSpentModal';

class ActivityRow extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    ma: PropTypes.bool,
    magicActivitiesTypes: PropTypes.array,
    startingDay: PropTypes.object,
    statuses: PropTypes.array,
    task: PropTypes.bool,
    userId: PropTypes.number
  };

  constructor(props) {
    super(props);

    this.state = {
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
    _.forEach(timeSheets, (tsh, i) => {
      if (tsh.id && !~tsh.id.toString().indexOf('temp')) {
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

  render() {
    const { item, task, ma, statuses, magicActivitiesTypes } = this.props;
    const { editingSpent } = this.state;
    const status = task ? _.find(statuses, { id: item.taskStatusId }) : '';
    const maType = ma ? _.find(magicActivitiesTypes, { id: item.typeId }) : '';
    const totalTime = roundNum(_.sumBy(item.timeSheets, tsh => +tsh.spentTime), 2);

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
                <input type="text" disabled value={this.state.timeCells[i]} />
                <span className={css.toggleComment}>
                  <IconEdit onClick={this.openEditModal.bind(this, tsh)} />
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
                <input type="text" disabled value={this.state.timeCells[i]} />
                <span className={css.toggleComment}>
                  <IconEdit onClick={this.openEditModal.bind(this, tsh)} />
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

export default connect(mapStateToProps)(ActivityRow);
