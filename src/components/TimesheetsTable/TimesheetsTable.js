import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from './TimesheetsTable.scss';
import Calendar from './Calendar';
import ActivityRow from './ActivityRow';
import UserRow from './UserRow';
import exactMath from 'exact-math';
import localize from './TimesheetsTable.json';
import { getFullName } from '../../utils/NameLocalisation';
import { IconArrowLeft, IconArrowRight, IconCalendar } from '../Icons';
import * as timesheetsConstants from '../../constants/Timesheets';

class TimesheetsTable extends React.Component {
  static propTypes = {
    approveTimesheets: PropTypes.func,
    changeProjectWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    lang: PropTypes.string,
    list: PropTypes.array,
    params: PropTypes.object,
    rejectTimesheets: PropTypes.func,
    startingDay: PropTypes.object,
    submitTimesheets: PropTypes.func
  };

  state = {
    isCalendarOpen: false
  };

  approveTimeSheets = userId => {
    this.props.approveTimesheets({
      userId,
      dateBegin: this.props.dateBegin,
      dateEnd: this.props.dateEnd
    });
  };

  rejectTimeSheets = userId => {
    this.props.rejectTimesheets({
      userId,
      dateBegin: this.props.dateBegin,
      dateEnd: this.props.dateEnd
    });
  };

  submitTimesheets = userId => {
    this.props.submitTimesheets({
      userId,
      dateBegin: this.props.dateBegin,
      dateEnd: this.props.dateEnd
    });
  };

  toggleCalendar = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  setPrevWeek = () => {
    const { changeProjectWeek, params, startingDay } = this.props;
    changeProjectWeek(startingDay.subtract(7, 'days'), params.projectId);
  };

  setNextWeek = () => {
    const { changeProjectWeek, params, startingDay } = this.props;
    changeProjectWeek(startingDay.add(7, 'days'), params.projectId);
  };

  setDate = day => {
    const { changeProjectWeek, params } = this.props;
    this.setState({ isCalendarOpen: false }, () => {
      changeProjectWeek(moment(day), params.projectId);
    });
  };

  isThisWeek(date) {
    const { startingDay } = this.props;
    const timesheetOndDate = moment(date).format('X');
    return (
      timesheetOndDate <=
        moment(startingDay)
          .endOf('week')
          .format('X') &&
      timesheetOndDate >=
        moment(startingDay)
          .startOf('week')
          .format('X')
    );
  }

  // Timesheets for task by week
  getTaskTimesheets(arr, el, day, userId) {
    const timeSheets = [];

    for (let index = 0; index < 7; index++) {
      const timesheet = find(arr, tsh => {
        return (
          tsh.task &&
          tsh.task.id === el.task.id &&
          moment(tsh.onDate).format('DD.MM.YY') ===
            moment(day)
              .weekday(index)
              .format('DD.MM.YY') &&
          tsh.taskStatusId === el.taskStatusId
        );
      });
      if (timesheet) {
        timeSheets.push(timesheet);
      } else {
        timeSheets.push({
          comment: '',
          task: el.task,
          typeId: el.typeId,
          taskStatusId: el.taskStatusId,
          isBillable: el.isBillable,
          sprint: el.sprint,
          statusId: el.statusId,
          userId: userId,
          onDate: moment(day)
            .weekday(index)
            .format(),
          spentTime: '0'
        });
      }
    }

    return timeSheets;
  }

  // Overall time by week for user tasks
  getUserTimesheets(user) {
    const { startingDay } = this.props;
    const timeSheets = [];
    for (let index = 0; index < 7; index++) {
      const dayUserSheets = filter(user.timesheet, tsh => {
        return (
          moment(tsh.onDate).format('DD.MM.YY') ===
          moment(startingDay)
            .weekday(index)
            .format('DD.MM.YY')
        );
      });
      if (dayUserSheets && dayUserSheets.length) {
        const dayTime = dayUserSheets.reduce((a, b) => {
          return a + parseFloat(b.spentTime);
        }, 0);
        const billableTime = dayUserSheets.reduce((a, b) => {
          return a + (b.isBillable ? parseFloat(b.spentTime) : 0);
        }, 0);
        timeSheets.push({
          onDate: moment(startingDay)
            .weekday(index)
            .format(),
          spentTime: dayTime + '',
          billableTime: billableTime + ''
        });
      } else {
        timeSheets.push({
          onDate: moment(startingDay)
            .weekday(index)
            .format(),
          spentTime: '0',
          billableTime: '0'
        });
      }
    }
    return timeSheets;
  }

  getTaskFromTimesheet(userId, el, userTimeSheets) {
    const { startingDay } = this.props;
    return {
      id: el.task.id,
      name: `${el.project.prefix}-${el.task.id}: ${el.task.name}`,
      projectId: el.project.id,
      projectName: el.project.name,
      statusId: el.statusId,
      taskStatusId: el.taskStatusId,
      sprintId: el.task.sprint ? el.task.sprint.id : null,
      sprint: el.task.sprint ? el.task.sprint : null,
      timeSheets: this.getTaskTimesheets(userTimeSheets, el, startingDay, userId)
    };
  }

  getMagicActivities(timesheets) {
    const { lang } = this.props;

    return timesheets.reduce((res, el) => {
      if (el.typeId === 1) {
        return res;
      }

      const maNotPushed = !res.find(tsh => {
        const usSameUser = tsh.userId === el.userId;
        const isSameType = tsh.typeId === el.typeId;
        const isSameSprint = (el.sprint ? el.sprint.id : 0) === (tsh.sprint ? tsh.sprint.id : 0);
        const isSameProject = el.projectId === tsh.projectId;
        return isSameType && isSameProject && isSameSprint && usSameUser;
      });

      if (maNotPushed && this.isThisWeek(el.onDate)) {
        res.push({
          typeId: el.typeId,
          projectName: el.project ? el.project.name : localize[lang].WITHOUT_PROJECT,
          projectId: el.project ? el.project.id : 0,
          statusId: el.statusId,
          sprint: el.sprint ? el.sprint : null,
          userId: el.userId ? el.userId : null,
          task: null
        });
      }
      return res;
    }, []);
  }

  userMagicActivities(user) {
    const { startingDay } = this.props;
    const tasks = [];
    // Создание массива таймшитов по magic activities
    const magicActivities = user.timesheet && user.timesheet.length ? this.getMagicActivities(user.timesheet) : [];
    magicActivities.forEach(element => {
      const timeSheets = [];
      for (let index = 0; index < 7; index++) {
        const timesheet = find(user.timesheet, tsh => {
          return (
            tsh.typeId !== 1 &&
            tsh.typeId === element.typeId &&
            (tsh.project ? tsh.project.id === element.projectId : !tsh.project && !element.projectId) &&
            moment(tsh.onDate).format('DD.MM.YY') ===
              moment(startingDay)
                .weekday(index)
                .format('DD.MM.YY')
          );
        });
        if (timesheet) {
          timeSheets.push(timesheet);
        } else {
          timeSheets.push({
            comment: '',
            task: element.task,
            typeId: element.typeId,
            taskStatusId: element.taskStatusId,
            isBillable: element.isBillable,
            sprint: element.sprint,
            statusId: element.statusId,
            userId: user.id,
            onDate: moment(startingDay)
              .weekday(index)
              .format(),
            spentTime: '0'
          });
        }
      }

      tasks.push({ ...element, timeSheets });
    });
    return tasks;
  }

  getUsersWithTimeSheets() {
    const { list } = this.props;
    const users = list.map(user => {
      const userName = getFullName(user, true) || null;
      const newUserObj = {
        userName,
        createdAt: user.createdAt,
        id: user.id,
        isOpen: false,
        isSubmitted: false,
        isRejected: false,
        isApproved: false,
        tasks: [],
        timesheets: this.getUserTimesheets(user),
        ma: this.userMagicActivities(user) || []
      };
      const tasks = [];
      user.timesheet.forEach(el => {
        if (el.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED) {
          newUserObj.isSubmitted = true;
        }
        if (el.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED) {
          newUserObj.isApproved = true;
        }
        if (el.statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED) {
          newUserObj.isRejected = true;
        }
        if (el.task) {
          const exists = tasks.find(usrTask => {
            return usrTask.taskStatusId === el.taskStatusId && usrTask.id === el.task.id;
          });
          if (!exists) {
            tasks.push(this.getTaskFromTimesheet(user.id, el, user.timesheet));
          }
        }
      });
      newUserObj.tasks = sortBy(tasks, ['projectId']);
      return newUserObj;
    });

    return sortBy(users, ['userName']);
  }

  render() {
    const { isCalendarOpen } = this.state;
    const { startingDay, list, lang } = this.props;
    const users = this.getUsersWithTimeSheets();
    const userRows = [];
    for (const user of users) {
      userRows.push([
        <UserRow
          key={`${user.id}-${startingDay}`}
          user={user}
          approveTimesheets={this.approveTimeSheets}
          rejectTimesheets={this.rejectTimeSheets}
          submitTimesheets={this.submitTimesheets}
          items={[
            ...user.tasks.map(task => (
              <ActivityRow
                key={`${task.id}-${task.taskStatusId}-${startingDay}-${task.statusId}-task`}
                task
                item={task}
              />
            )),
            ...user.ma.map(task => (
              <ActivityRow
                key={`${user.id}-${startingDay}-${task.statusId}-${task.typeId}-${
                  task.projectId ? task.projectId : 0
                }-${task.sprint ? task.sprint.id : 0}-ma`}
                ma
                item={task}
              />
            ))
          ]}
        />
      ]);
    }

    // Создание заголовка таблицы
    const days = [];
    for (let number = 0; number < 7; number++) {
      const currentDay = moment(startingDay)
        .weekday(number)
        .locale(localize[lang].MOMENT);
      days.push(
        <th
          className={cn({
            [css.day]: true,
            [css.weekend]: number === 5 || number === 6,
            [css.today]: moment().format('DD.MM.YY') === currentDay.format('DD.MM.YY')
          })}
          key={number}
        >
          <div>
            {currentDay.format('dd')}
            <br />
            {currentDay.format('DD.MM')}
          </div>
        </th>
      );
    }

    // Создание строки с суммой времени по дням

    const totalRow = [];
    const dayTaskHours = (arr, day, billable = false) => {
      return arr.map(tsh => {
        if (
          moment(tsh.onDate).format('DD.MM.YY') ===
          moment(startingDay)
            .weekday(day)
            .format('DD.MM.YY')
        ) {
          return billable ? (tsh.isBillable ? +tsh.spentTime : 0) : +tsh.spentTime;
        }
        return 0;
      });
    };

    const calculateDayTaskHours = (tsUsers, day, billable = false) => {
      const arr = tsUsers.reduce((timeSheets, user) => [...timeSheets, ...user.timesheet], []);
      if (arr.length > 0) {
        const hours = dayTaskHours(arr, day, billable);
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    };

    const calculateTotalTaskHours = (tsUsers, billable = false) => {
      const arr = tsUsers.reduce((timeSheets, user) => [...timeSheets, ...user.timesheet], []);
      if (arr.length > 0) {
        const hours = arr.map(tsh => (billable ? (tsh.isBillable ? +tsh.spentTime : 0) : +tsh.spentTime));
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    };

    for (let day = 0; day < 7; day++) {
      totalRow.push(
        <td
          key={day}
          className={cn({
            [css.total]: true,
            [css.weekend]: day === 5 || day === 6,
            [css.today]:
              moment().format('DD.MM.YY') ===
              moment(startingDay)
                .weekday(day)
                .format('DD.MM.YY')
          })}
        >
          <div>
            {calculateDayTaskHours(list, day, true)}/{calculateDayTaskHours(list, day)}
          </div>
        </td>
      );
    }

    return (
      <table className={css.timeSheetsTable}>
        <thead>
          <tr className={css.sheetsHeader}>
            <th className={css.prevWeek}>
              <div className={css.activityHeader}>{localize[lang].WEEK_ACTIVITY}</div>
              <IconArrowLeft data-tip={localize[lang].PREV_WEEK} onClick={this.setPrevWeek} />
            </th>
            {days}
            <th className={css.nextWeek}>
              <IconArrowRight data-tip={localize[lang].NEXT_WEEK} onClick={this.setNextWeek} />
            </th>
            <th className={cn(css.actions)}>
              <div className={css.changeWeek} data-tip={localize[lang].SELECT_DATE} onClick={this.toggleCalendar}>
                <IconCalendar />
              </div>
              <ReactCSSTransitionGroup
                transitionName="animatedElement"
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}
              >
                {isCalendarOpen ? <Calendar onCancel={this.toggleCalendar} onDayClick={this.setDate} /> : null}
              </ReactCSSTransitionGroup>
            </th>
          </tr>
        </thead>
        <tbody>
          {userRows}
          <tr className={css.summaryRow}>
            <td className={css.total} />
            {totalRow}
            <td className={cn(css.total, css.totalWeek, css.totalRow)}>
              <div>
                {calculateTotalTaskHours(list, true)}/{calculateTotalTaskHours(list)}
              </div>
            </td>
            <td className={css.total} />
          </tr>
        </tbody>
      </table>
    );
  }
}

export default TimesheetsTable;
