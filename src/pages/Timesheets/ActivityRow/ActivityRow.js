import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import SingleComment from './SingleComment';
import TotalComment from './TotalComment';
import * as css from '../Timesheets.scss';
import { IconClose } from '../../../components/Icons';
import { createTimesheet, updateTimesheet, deleteTimesheets } from '../../../actions/Timesheets';

class ActivityRow extends React.Component {
  static propTypes = {
    createTimesheet: PropTypes.func,
    deleteTimesheets: PropTypes.func,
    item: PropTypes.object,
    ma: PropTypes.bool,
    maTypes: PropTypes.array,
    startingDay: PropTypes.object,
    statuses: PropTypes.array,
    task: PropTypes.bool,
    updateTimesheet: PropTypes.func,
    userId: PropTypes.number
  }

  constructor (props) {
    super(props);
    this.createTimesheet = _.debounce(this.createTimesheet, 500);
    this.updateTimesheet = _.debounce(this.updateTimesheet, 500);
    this.state = {
      isOpen: false
    };
  }

  createTimesheet = (i, value) => {
    const { item, userId, startingDay } = this.props;
    this.props.createTimesheet({
      isDraft: false,
      taskId: item.id || null,
      taskStatusId: item.id ? item.taskStatusId : null,
      typeId: item.id ? '1' : item.typeId,
      spentTime: value,
      onDate: moment(startingDay).weekday(i).format('YYYY-MM-DD'),
      projectId: item.projectId
    }, userId, startingDay);
  }

  updateTimesheet = (i, sheetId, value) => {
    const { userId, startingDay } = this.props;
    this.props.updateTimesheet({
      sheetId,
      spentTime: value
    }, userId, startingDay);
  }

  changeEmpty = (i, e) => {
    e.persist();
    const { value } = e.target;
    if (value) {
      this.createTimesheet(i, value);
    } else {
      this.createTimesheet(i, '0');
    }
  }

  changeFilled = (i, id, e) => {
    e.persist();
    const { value } = e.target;
    if (value) {
      this.updateTimesheet(i, id, value);
    } else {
      this.updateTimesheet(i, id, '0');
    }
  }

  toggle = () => {}

  render () {

    const { item, task, ma, statuses, maTypes, userId, startingDay } = this.props;
    const status = task ? _.find(statuses, { 'id': item.taskStatusId }) : '';
    const maType = ma ? _.find(maTypes, { 'id': item.typeId }) : '';
    const totalTime = _.sumBy(item.timeSheets, tsh => { return +tsh.spentTime; });
    const timeSheetIds = _.remove(item.timeSheets.map(tsh => tsh.id), tsh => tsh);
    const timeCells = item.timeSheets.map((tsh, i) => {
      if (tsh.id) {
        return (
          <td key={i} className={cn({
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}>
            <div>
              <div className={cn({
                [css.timeCell]: true,
                [css.filled]: +tsh.spentTime
              })}>
                <input
                  type="text"
                  defaultValue={
                    tsh.spentTime - Math.floor(tsh.spentTime)
                    ? Math.round(tsh.spentTime * 100) / 100
                    : Math.floor(tsh.spentTime)}
                  onChange={(e) => this.changeFilled(i, tsh.id, e)}
                />
                <span className={css.toggleComment}>
                  <SingleComment comment={tsh.comment}/>
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
                  type="text"
                  maxLength="4"
                  defaultValue="0"
                  onChange={(e) => this.changeEmpty(i, e)}
                />
                <span className={css.toggleComment}>
                  <SingleComment/>
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
              <TotalComment items={item.timeSheets}/>
            </div>
          </div>
        </td>
        <td className={cn(css.actions)}>
          <div className={css.deleteTask} onClick={() => this.props.deleteTimesheets(timeSheetIds, userId, startingDay)} data-tip="Удалить">
            <IconClose/>
          </div>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = state => ({
  statuses: state.Dictionaries.taskStatuses,
  maTypes: state.Dictionaries.magicActivityTypes,
  userId: state.Auth.user.id,
  startingDay: state.Timesheets.startingDay
});

const mapDispatchToProps = {
  createTimesheet,
  updateTimesheet,
  deleteTimesheets
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityRow);
