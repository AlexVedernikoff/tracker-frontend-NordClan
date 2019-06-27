import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import filter from 'lodash/filter';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from './TimesheetsTable.scss';
import Calendar from './Calendar';
import ActivityRow from './ActivityRow';
import UserRow from './UserRow';
import exactMath from 'exact-math';
import localize from './TimesheetsTable.json';
import { getFullName } from '../../utils/NameLocalisation';
import { IconArrowLeft, IconArrowRight, IconCalendar } from '../Icons';

export default class extends React.Component {
  static propTypes = {
    changeProjectWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    lang: PropTypes.string,
    list: PropTypes.array,
    params: PropTypes.object,
    startingDay: PropTypes.object,
    users: PropTypes.arrayOf(PropTypes.object)
  };

  state = {
    isCalendarOpen: false
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
    const getMidnight = dayOfWeek => {
      return moment(startingDay)
        .weekday(dayOfWeek)
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .format('X');
    };

    const timesheetOndDate = moment(date).format('X');
    return timesheetOndDate <= getMidnight(6) && timesheetOndDate >= getMidnight(0);
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
  getUserTimesheets(userId) {
    const { list, startingDay } = this.props;
    const timeSheets = [];
    for (let index = 0; index < 7; index++) {
      const dayUserSheets = filter(list, tsh => {
        return (
          tsh.userId === userId &&
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

  pushTaskToUser(user, el) {
    const { list, startingDay } = this.props;
    const exists = user.tasks.find(usrTask => {
      return usrTask.taskStatusId === el.taskStatusId && usrTask.id === el.task.id;
    });
    if (!exists) {
      user.tasks.push({
        id: el.task.id,
        name: `${el.project.prefix}-${el.task.id}: ${el.task.name}`,
        projectId: el.project.id,
        projectName: el.project.name,
        taskStatusId: el.taskStatusId,
        sprintId: el.task.sprint ? el.task.sprint.id : null,
        sprint: el.task.sprint ? el.task.sprint : null,
        timeSheets: this.getTaskTimesheets(list, el, startingDay, user.id)
      });
    }
  }

  getMagicActivities() {
    const { list, lang } = this.props;

    return list.reduce((res, el) => {
      if (el.typeId === 1) {
        return res;
      }

      const maNotPushed = !res.find(tsh => {
        const usSameUser = tsh.userId === el.userId;
        const isSameType = tsh.typeId === el.typeId;
        const isSameSprint = (el.sprint ? el.sprint.id : 0) === (tsh.sprint ? tsh.sprint.id : 0);
        return isSameType && isSameSprint && usSameUser;
      });

      if (maNotPushed && this.isThisWeek(el.onDate)) {
        res.push({
          typeId: el.typeId,
          projectName: el.project ? el.project.name : localize[lang].WITHOUT_PROJECT,
          projectId: el.project ? el.project.id : 0,
          sprint: el.sprint ? el.sprint : null,
          userId: el.userId ? el.userId : null,
          task: null
        });
      }
      return res;
    }, []);
  }

  userMagicActivities(userId) {
    const { list, startingDay } = this.props;
    const tasks = [];
    // Создание массива таймшитов по magic activities
    const magicActivities = list.length ? this.getMagicActivities() : [];
    magicActivities.forEach(element => {
      if (element.userId !== userId) {
        return;
      }
      const timeSheets = [];
      for (let index = 0; index < 7; index++) {
        const timesheet = find(list, tsh => {
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
            userId: userId,
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

  // Create users object where key user.id = user with timesheets
  getUsersWithTimeSheets() {
    const { list } = this.props;
    const users = {};
    list.forEach(el => {
      if (el.user) {
        const userNotPushed = !users[el.user.id];
        if (this.isThisWeek(el.onDate)) {
          // add new users key
          if (userNotPushed) {
            users[el.user.id] = {
              id: el.user.id,
              userName: getFullName(el.user) ? getFullName(el.user) : null,
              isOpen: false,
              tasks: [],
              timesheets: this.getUserTimesheets(el.user.id),
              ma: this.userMagicActivities(el.user.id) || []
            };
          }

          if (el.task) {
            this.pushTaskToUser(users[el.user.id], el);
          }
        }
      }
    });
    sortBy(users, ['userName']);

    return users;
  }

  render() {
    const { isCalendarOpen } = this.state;
    const { startingDay, list, lang } = this.props;
    const users = this.getUsersWithTimeSheets();
    const userRows = [];
    for (const user of Object.values(users)) {
      const userName = getFullName(this.props.users.find(el => el.id === user.id));
      userRows.push([
        <UserRow
          key={`${user.id}-${startingDay}`}
          user={user}
          userName={userName} //fix bug with names
          items={[
            ...user.tasks.map(task => (
              <ActivityRow key={`${task.id}-${task.taskStatusId}-${startingDay}-task`} task item={task} />
            )),
            ...user.ma.map(task => (
              <ActivityRow
                key={`${user.id}-${startingDay}-${task.typeId}-${task.sprint ? task.sprint.id : 0}-ma`}
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
            [css.today]: moment().format('DD.MM.YY') === currentDay.format('DD.MM.YY'),
            [css.dayBeforeToday]:
              moment()
                .add(-1, 'day')
                .format('DD.MM.YY') === currentDay.format('DD.MM.YY')
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

    const calculateDayTaskHours = (arr, day, billable = false) => {
      if (arr.length > 0) {
        const hours = dayTaskHours(arr, day, billable);
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    };

    const calculateTotalTaskHours = (arr, billable = false) => {
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
