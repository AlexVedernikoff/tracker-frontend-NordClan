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
import { createTimesheet, updateTimesheet } from '../../../actions/Timesheets';

class ActivityRow extends React.Component {
  static propTypes = {
    createTimesheet: PropTypes.func,
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

  createTimesheet = (i, e) => {
    const { item, userId, startingDay } = this.props;
    const { value } = e.target;
    this.props.createTimesheet({
      isDraft: false,
      taskId: item.id || null,
      taskStatusId: item.id ? item.taskStatusId : null,
      typeId: item.id ? '1' : item.typeId,
      spentTime: value,
      onDate: moment(startingDay).day(i + 1).format('YYYY-MM-DD'),
      projectId: item.projectId
    }, userId, startingDay);
  }

  updateTimesheet = (i, sheetId, e) => {
    const { userId, startingDay } = this.props;
    const spentTime = e.target.value;
    this.props.updateTimesheet({
      sheetId,
      spentTime
    }, userId, startingDay);
  }

  changeEmpty = (i, e) => {
    e.persist();
    this.createTimesheet(i, e);
  }

  changeFilled = (i, id, e) => {
    e.persist();
    this.updateTimesheet(i, id, e);
  }

  toggle = () => {}

  render () {

    const { item, task, ma, statuses, maTypes } = this.props;
    const status = task ? _.find(statuses, { 'id': item.taskStatusId }) : '';
    const maType = ma ? _.find(maTypes, { 'id': item.typeId }) : '';
    const totalTime = _.sumBy(item.timeSheets, tsh => { return +tsh.spentTime; });
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
                [css.filled]: tsh.spentTime
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
              { ma && <span>{maType.name}</span>}
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
          <div className={css.deleteTask} data-tip="Удалить">
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
  updateTimesheet
};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityRow);
