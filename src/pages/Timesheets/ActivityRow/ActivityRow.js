import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import roundNum from '../../../utils/roundNum';
import SingleComment from './SingleComment';
import TotalComment from './TotalComment';
import * as css from '../Timesheets.scss';
import { IconClose } from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal';
import { createTimesheet, updateTimesheet, deleteTimesheets, deleteTempTimesheets } from '../../../actions/Timesheets';

class ActivityRow extends React.Component {
  static propTypes = {
    createTimesheet: PropTypes.func,
    deleteTempTimesheets: PropTypes.func,
    deleteTimesheets: PropTypes.func,
    item: PropTypes.object,
    ma: PropTypes.bool,
    magicActivitiesTypes: PropTypes.array,
    startingDay: PropTypes.object,
    statuses: PropTypes.array,
    task: PropTypes.bool,
    updateTimesheet: PropTypes.func,
    userId: PropTypes.number
  };

  constructor (props) {
    super(props);
    const debounceTime = 1000;
    this.createTimesheet = _.debounce(this.createTimesheet, debounceTime);
    this.updateTimesheet = _.debounce(this.updateTimesheet, debounceTime);
    this.deleteTimesheets = _.debounce(this.deleteTimesheets, debounceTime);

    const timeCells = {};
    _.forEach(props.item.timeSheets, (tsh,i) => {
      if (tsh.id && !~tsh.id.toString().indexOf('temp')) {
        timeCells[i] = roundNum(tsh.spentTime, 2);
      } else {
        timeCells[i] = 0;
      }
    })

    this.state = {
      isOpen: false,
      timeCells
    };
  }

  createTimesheet = (i) => {
    const { item, userId, startingDay } = this.props;
    const value = this.state.timeCells[i];
    this.props.createTimesheet({
      isDraft: false,
      taskId: item.id || null,
      taskStatusId: item.id ? item.taskStatusId : null,
      typeId: item.id ? '1' : item.typeId,
      spentTime: value,
      onDate: moment(startingDay).weekday(i).format('YYYY-MM-DD'),
      projectId: item.projectId
    }, userId, startingDay);
  };

  updateTimesheet = (i, sheetId, comment) => {
    const value = this.state.timeCells[i];
    const { userId, startingDay } = this.props;
    if (!value && !comment) {
      this.props.deleteTimesheets([sheetId], userId, startingDay);
      return;
    }
    this.props.updateTimesheet({
      sheetId,
      spentTime: value,
    }, userId, startingDay);
  };

  deleteTimesheets = (ids) => {
    const { userId, startingDay } = this.props;
    this.props.deleteTimesheets(ids, userId, startingDay);
  };

  changeEmpty = (i, value) => {
    let newValue = parseFloat(value);
    if (value < 0) {
      newValue = Math.abs(value);
    }

    this.setState((state) => {
      const timeCells = {
        ...state.timeCells
      };
      timeCells[i] = newValue;
      return {
        timeCells
      };
    }, () => {
      this.createTimesheet(i);
    });
  };

  changeEmptyComment = (text, i) => {
    const { item, userId, startingDay } = this.props;
    this.props.createTimesheet({
      isDraft: false,
      taskId: item.id || null,
      taskStatusId: item.id ? item.taskStatusId : null,
      typeId: item.id ? '1' : item.typeId,
      comment: text,
      spentTime: 0,
      onDate: moment(startingDay).weekday(i).format('YYYY-MM-DD'),
      projectId: item.projectId
    }, userId, startingDay);
  };

  changeFilled = (i, id, comment, value) => {
    let newValue = parseFloat(value);
    if (value < 0) {
      newValue = Math.abs(value);
    }

    this.setState((state) => {
      const timeCells = {
        ...state.timeCells
      };
      timeCells[i] = newValue;
      return {
        timeCells
      };
    }, () => {
      this.updateTimesheet(i, id, comment);
    });
  };

  changeFilledComment = (text, time, i, sheetId) => {
    const { userId, startingDay } = this.props;
    if (+time || text) {
      this.props.updateTimesheet({
        sheetId,
        comment: text
      }, userId, startingDay);
    } else {
      this.deleteTimesheets([sheetId]);
    }
  };

  openConfirmModal = () => {
    this.setState({isConfirmModalOpen: true});
  };

  closeConfirmModal = () => {
    this.setState({isConfirmModalOpen: false});
  };

  deleteActivity = (ids) => {
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

  render () {
    const { item, task, ma, statuses, magicActivitiesTypes} = this.props;
    const status = task ? _.find(statuses, { 'id': item.taskStatusId }) : '';
    const maType = ma ? _.find(magicActivitiesTypes, { 'id': item.typeId }) : '';
    const totalTime = roundNum(_.sumBy(item.timeSheets, tsh => +tsh.spentTime), 2);
    const timeSheetIds = _.remove(item.timeSheets.map(tsh => tsh.id), tsh => tsh);
    const canDeleteRow = !!item.timeSheets.filter(tsh => tsh.id && tsh.statusId !== 3 && tsh.statusId !== 4).length;

    const timeCells = item.timeSheets.map((tsh, i) => {
      const isCellDisabled = tsh.statusId === 3 || tsh.statusId === 4;

      if (tsh.id && !~tsh.id.toString().indexOf('temp')) {
        return (
          <td key={moment(tsh.onDate).format('X')} className={cn({
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}>
            <div>
              <div className={cn({
                [css.timeCell]: true,
                [css.filled]: +tsh.spentTime && tsh.statusId === 1,
                [css.submitted]: tsh.statusId === 3,
                [css.approved]: tsh.statusId === 4,
                [css.rejected]: tsh.statusId === 2
              })}>
                <input
                  type="number"
                  disabled={isCellDisabled}
                  max="24"
                  value={this.state.timeCells[i]}
                  onChange={(e) => this.changeFilled(i, tsh.id, tsh.comment, e.target.value)}
                />
                <span className={css.toggleComment}>
                  <SingleComment
                    disabled={isCellDisabled}
                    comment={tsh.comment}
                    onChange={(text) => this.changeFilledComment(text, tsh.spentTime, i, tsh.id)}
                  />
                </span>
              </div>
            </div>
          </td>
        );
      } else {
        return (
          <td key={i} className={cn({
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}>
            <div>
              <div className={css.timeCell}>
                <input
                  type="number"
                  disabled={!canDeleteRow}
                  max="24"
                  value={this.state.timeCells[i]}
                  onChange={(e) => this.changeEmpty(i,e.target.value)}
                />
                <span className={css.toggleComment}>
                  <SingleComment onChange={(text) => this.changeEmptyComment(text, i)}/>
                </span>
              </div>
            </div>
          </td>
        );
      }
    });

    return (
      <tr className={css.taskRow}>
        <td>
          <div className={css.taskCard}>
            <div className={css.meta}>
              {item.projectName ? <span>{item.projectName}</span> : null}
              {status ? <span>{status.name}</span> : null}
            </div>
            <div>
              { task && <Link to={`/projects/${item.projectId}/tasks/${item.id}`}>{item.name}</Link>}
              { ma && maType && <span>{maType.name}</span>}
            </div>
          </div>
        </td>
        {timeCells}
        <td className={cn(css.total, css.totalRow)}>
          <div>
            <div>
              {totalTime}
            </div>
            <div className={css.toggleComment}>
              <TotalComment
                items={item.timeSheets}
                isDisable={!canDeleteRow}
              />
            </div>
          </div>
        </td>
        <td className={cn(css.actions)}>
          <div className={css.deleteTask} onClick={this.openConfirmModal} data-tip="Удалить">
            {canDeleteRow ? <IconClose/> : null}
          </div>
          {this.state.isConfirmModalOpen
            ? <ConfirmModal
              isOpen
              contentLabel="modal"
              text="Вы действительно хотите удалить эту активность?"
              onCancel={this.closeConfirmModal}
              onConfirm={() => this.deleteActivity(timeSheetIds)}
              onRequestClose={this.closeConfirmModal}
            />
            : null}
        </td>
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
  updateTimesheet,
  deleteTimesheets,
  deleteTempTimesheets
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityRow);
