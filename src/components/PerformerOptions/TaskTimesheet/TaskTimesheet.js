import React, { Component } from 'react';
import * as css from './TaskTimesheet.scss';
import moment from 'moment';
import find from 'lodash/find';
import times from 'lodash/times';
import cn from 'classnames';
import PropTypes from 'prop-types';
import ActivityRowForTask from './ActivityRowForTask';
import { getMainStatusByGroup, isSameStatuses, TASK_STATUSES } from '../../../constants/TaskStatuses';

function generateEmptyTimeSheets(task) {
  const dayOfWeek = moment().day();
  const date = moment().subtract(dayOfWeek, 'days');
  return times(
    7,
    i =>
      date.add(1, 'days') && {
        spentTime: 0,
        taskStatusId: getMainStatusByGroup(task.statusId),
        onDate: date.toISOString(true),
        ...(i === dayOfWeek - 1
          ? {
              id: 'temp'
            }
          : null)
      }
  );
}

export default class TaskTimesheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activityType: 0
    };
  }

  componentDidMount() {
    const { getTimesheets, userId, dateBegin, dateEnd } = this.props;

    getTimesheets({ userId, dateBegin, dateEnd });
  }

  render() {
    const days = [];
    const { tempTimesheets, startingDay, deleteTempTimesheets, task, lang } = this.props;

    const defaultTaskStatusId = TASK_STATUSES.DEV_STOP;
    const tempTimesheetsList = tempTimesheets.map(timesheet => {
      return {
        ...timesheet,
        taskStatusId: getMainStatusByGroup(timesheet.taskStatusId || defaultTaskStatusId)
      };
    });

    const list = [...this.props.list, ...tempTimesheetsList];

    const isThisWeek = date => {
      const getMidnight = dayOfWeek => {
        return moment(startingDay)
          .weekday(dayOfWeek)
          .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
          .format('X');
      };

      const timesheetOndDate = moment(date).format('X');
      return timesheetOndDate <= getMidnight(6) && timesheetOndDate >= getMidnight(0);
    };

    let tasks = list.length
      ? list.reduce((res, el) => {
          const isTemp = tempTimesheets.some(tempTsh => tempTsh.id === el.id);

          const taskNotPushed =
            el.task &&
            !find(res, tsh => {
              const isExist = tsh.id === el.task.id && isSameStatuses(tsh.taskStatusId, el.taskStatusId);
              if (isExist && isTemp) {
                tsh.hilight = true;
              }
              return isExist;
            });

          if (!taskNotPushed && el.task && isTemp) {
            Promise.resolve().then(() => {
              deleteTempTimesheets([el.id.toString()]);
            });
          }

          if (taskNotPushed && isThisWeek(el.onDate)) {
            res.push({
              id: el.task.id,
              name: `${el.project.prefix}-${el.task.id}: ${el.task.name}`,
              projectId: el.project.id,
              projectName: el.project.name,
              taskStatusId: el.taskStatusId,
              sprintId: el.task.sprint ? el.task.sprint.id : null,
              sprint: el.task.sprint ? el.task.sprint : null
            });
          }
          return res;
        }, [])
      : [];

    tasks = tasks.map(element => {
      const timeSheets = [];

      for (let index = 0; index < 7; index++) {
        const timesheet = find(list, tsh => {
          return (
            tsh.task &&
            tsh.typeId === 1 &&
            tsh.task.id === element.id &&
            moment(tsh.onDate).format('DD.MM.YY') ===
              moment(startingDay)
                .weekday(index)
                .format('DD.MM.YY') &&
            isSameStatuses(tsh.taskStatusId, element.taskStatusId)
          );
        });

        if (timesheet) {
          const doubleTimesheets = list.filter(
            tsh =>
              timesheet.id !== tsh.id &&
              tsh.task &&
              tsh.typeId === 1 &&
              tsh.task.id === element.id &&
              moment(tsh.onDate).format('DD.MM.YY') ===
                moment(startingDay)
                  .weekday(index)
                  .format('DD.MM.YY') &&
              isSameStatuses(tsh.taskStatusId, element.taskStatusId)
          );
          timeSheets.push({ ...timesheet, doubleTimesheets });
        } else {
          timeSheets.push({
            onDate: moment(startingDay)
              .weekday(index)
              .format(),
            spentTime: '0'
          });
        }
      }

      return { ...element, timeSheets };
    });

    for (let day = 0; day < 7; day++) {
      const currentDay = moment(this.props.startingDay)
        .weekday(day)
        .locale(lang);

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
    }

    const currentTask = tasks.find(
      singleTask => singleTask.id === task.id && isSameStatuses(task.statusId, singleTask.taskStatusId)
    );

    const taskRow = (
      <ActivityRowForTask
        key={`${task.id}-${task.taskStatusId}-${startingDay}`}
        task
        item={{ timeSheets: generateEmptyTimeSheets(task), ...task, ...currentTask }}
      />
    );

    return (
      <table>
        <thead>
          <tr>{days}</tr>
        </thead>
        <tbody>{taskRow}</tbody>
      </table>
    );
  }
}

TaskTimesheet.propTypes = {
  addActivity: PropTypes.func,
  changeWeek: PropTypes.func,
  createTimesheet: PropTypes.func,
  dateBegin: PropTypes.string,
  dateEnd: PropTypes.string,
  deleteTempTimesheets: PropTypes.func,
  getTimesheets: PropTypes.func,
  lang: PropTypes.string,
  list: PropTypes.array,
  showNotification: PropTypes.func,
  startingDay: PropTypes.object,
  task: PropTypes.object,
  tempTimesheets: PropTypes.array,
  userId: PropTypes.number
};
