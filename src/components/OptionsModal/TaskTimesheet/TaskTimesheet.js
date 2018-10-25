import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as css from './TaskTimesheet.scss';
import moment from 'moment';
import cn from 'classnames';
import SingleComment from '../../../pages/Timesheets/ActivityRow/SingleComment';
import validateNumber from '../../../utils/validateNumber';
import { createTimesheet } from '../../../actions/Timesheets';
// import * as timesheetsConstants from '../../../constants/Timesheets';
import PropTypes from 'prop-types';

class TaskTimesheet extends Component {
  state = {
    timeCells: []
  };

  changeEmpty = (i, value) => {
    const { task, startingDay } = this.props;
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
          this.props.createTimesheet({
            isDraft: false,
            taskId: task.id || null,
            taskStatusId: task.id ? task.taskStatusId : null,
            typeId: task.id ? '1' : task.typeId,
            spentTime: +value,
            onDate: moment(startingDay)
              .weekday(i)
              .format('YYYY-MM-DD'),
            projectId: task.project.id,
            sprintId: task.sprintId || (task.sprint ? task.sprint.id : null)
          });
        }
      }
    );
  };

  render() {
    const days = [];
    const timeCells = [];

    // const filledTimeCells = this.props.list.map((tsh, i) => {
    //   if (tsh.id) {
    //     return (
    //       <td
    //         key={moment(tsh.onDate).format('X')}
    //         className={cn({
    //           [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
    //           [css.weekend]: i === 5 || i === 6
    //         })}
    //       >
    //         <div>
    //           <div
    //             className={cn({
    //               [css.timeCell]: true,
    //               [css.filled]: +tsh.spentTime && tsh.statusId === 1,
    //               [css.submitted]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED,
    //               [css.approved]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED,
    //               [css.rejected]: tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED
    //             })}
    //           >
    //             <input
    //               type="text"
    //               value={this.state.timeCells[i]}
    //               onChange={e => this.changeFilled(i, tsh.id, tsh.comment, e.target.value)}
    //               onBlur={e => this.onBlurFilled(i, tsh.id, tsh.comment, e.target.value)}
    //             />

    //             <span className={css.toggleComment}>
    //               <SingleComment
    //                 comment={tsh.comment}
    //                 onChange={text => this.changeFilledComment(text, tsh.spentTime, i, tsh.id)}
    //               />
    //             </span>
    //           </div>
    //         </div>
    //       </td>
    //     );
    //   }
    // });

    for (let day = 0; day < 7; day++) {
      const currentDay = moment(this.props.startingDay)
        .weekday(day)
        .locale('en');
      days.push(
        <th
          className={cn({
            [css.day]: true,
            [css.weekend]: day === 5 || day === 6,
            [css.today]: moment().format('DD.MM.YY') === currentDay.format('DD.MM.YY')
          })}
          key={day}
        >
          <div>
            {currentDay.format('dd')}
            <br />
            {currentDay.format('DD.MM')}
          </div>
        </th>
      );

      timeCells.push(
        <td
          key={day}
          className={cn({
            [css.today]: moment().format('DD.MM.YY') === currentDay.format('DD.MM.YY'),
            [css.weekend]: day === 5 || day === 6
          })}
        >
          <div>
            <div className={css.timeCell}>
              <input
                type="text"
                value={this.state.timeCells[day] || 0}
                onChange={e => this.changeEmpty(day, e.target.value)}
              />
              <span className={css.toggleComment}>
                <SingleComment />
              </span>
            </div>
          </div>
        </td>
      );
    }

    console.log(this.props);

    return (
      <table>
        <thead>
          <tr>{days}</tr>
        </thead>
        <tbody>
          <tr>{timeCells}</tr>
          {/* <tr>{filledTimeCells}</tr> */}
        </tbody>
      </table>
    );
  }
}

TaskTimesheet.propTypes = {
  createTimesheet: PropTypes.func,
  list: PropTypes.object,
  startingDay: PropTypes.string,
  task: PropTypes.object
};

const mapStateToProps = state => ({
  task: state.Task.task,
  startingDay: state.Timesheets.startingDay,
  list: state.Timesheets.list
});
const mapDispatchToProps = {
  createTimesheet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskTimesheet);
