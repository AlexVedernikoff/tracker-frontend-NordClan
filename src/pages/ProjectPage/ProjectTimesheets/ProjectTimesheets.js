import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as timesheetsActions from '../../../actions/Timesheets';
import * as timesheetsConstants from '../../../constants/Timesheets';
import * as css from './ProjectTimesheets.scss';
import { IconPlus, IconArrowLeft, IconArrowRight, IconCalendar } from '../../../components/Icons';
import AddActivityModal from './AddActivityModal';
import Calendar from './Calendar';
import ActivityRow from './ActivityRow';
import UserRow from './UserRow';
import exactMath from 'exact-math';

class ProjectTimesheets extends React.Component {
  static propTypes = {
    changeProjectWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    getProjectTimesheets: PropTypes.func,
    list: PropTypes.array,
    startingDay: PropTypes.object,
    tempTimesheets: PropTypes.array,
    params: PropTypes.object
  };

  state = {
    isCalendarOpen: false
  };

  componentDidMount() {
    const { getProjectTimesheets, params, dateBegin, dateEnd } = this.props;
    getProjectTimesheets(params.projectId, { dateBegin, dateEnd });
  }

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

  render() {
    const { isCalendarOpen } = this.state;
    const { startingDay, tempTimesheets } = this.props;
    const canAddActivity = !this.props.list.find(
      tsh =>
        tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
        tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED
    );
    const countTsWithTime = this.props.list.filter(tsh => tsh.spentTime !== 0).length;
    const defaultTaskStatusId = 2;
    const tempTimesheetsList = tempTimesheets.map(timesheet => {
      return {
        ...timesheet,
        taskStatusId: timesheet.taskStatusId || defaultTaskStatusId
      };
    });

    //TODO важен порядок сложения списков
    const list = this.props.list.concat(tempTimesheetsList);

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

    const formSpentForTask = (arr, task, day) => {
      const timeSheets = [];

      for (let index = 0; index < 7; index++) {
        const timesheet = _.find(arr, tsh => {
          return (
            tsh.task &&
            tsh.typeId === 1 &&
            tsh.id === task.id &&
            moment(tsh.onDate).format('DD.MM.YY') ===
              moment(day)
                .weekday(index)
                .format('DD.MM.YY') &&
            tsh.taskStatusId === task.taskStatusId
          );
        });
        if (timesheet) {
          timeSheets.push(timesheet);
        } else {
          timeSheets.push({
            onDate: moment(day)
              .weekday(index)
              .format(),
            spentTime: '0'
          });
        }
      }

      return timeSheets;
    };

    const getUserAcivities = userId => {
      const timeSheets = [];
      for (let index = 0; index < 7; index++) {
        const dayUserSheets = _.filter(list, tsh => {
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
            return a + parseFloat(b['spentTime']);
          }, 0);
          timeSheets.push({
            onDate: moment(startingDay)
              .weekday(index)
              .format(),
            spentTime: dayTime + ''
          });
        } else {
          timeSheets.push({
            onDate: moment(startingDay)
              .weekday(index)
              .format(),
            spentTime: '0'
          });
        }
      }

      console.log('timesheets for user', userId, timeSheets);
      return timeSheets;
    };

    const pushTaskToUser = (user, el) => {
      user.tasks.push({
        id: el.id,
        name: `${el.project.prefix}-${el.task.id}: ${el.task.name}`,
        projectId: el.project.id,
        projectName: el.project.name,
        taskStatusId: el.taskStatusId,
        sprintId: el.task.sprint ? el.task.sprint.id : null,
        sprint: el.task.sprint ? el.task.sprint : null,
        timeSheets: formSpentForTask(list, el, startingDay)
      });
    };

    // Create users object where key user.id = user with timesheets
    const users = {};
    list.forEach(el => {
      const userNotPushed = !users[el.user.id];
      if (isThisWeek(el.onDate)) {
        // add new users key
        if (userNotPushed) {
          users[el.user.id] = {
            id: el.user.id,
            userName: el.user.fullNameRu ? el.user.fullNameRu : null,
            isOpen: false,
            tasks: [],
            timesheets: getUserAcivities(el.user.id)
          };
          // push timesheet to existing user
        }

        if (el.task) {
          pushTaskToUser(users[el.user.id], el);
        }
      }
    });

    _.sortBy(users, ['userName']);

    console.log('users', users);

    const userRows = [];

    for (const user of Object.values(users)) {
      userRows.push([
        <UserRow
          key={`${user.id}-${startingDay}`}
          user={user}
          items={user.tasks.map(task => <ActivityRow key={`${task.id}-${startingDay}-task`} task item={task} />)}
        />
      ]);
    }

    // Создание массива таймшитов по magic activities

    let magicActivities = list.length
      ? list.reduce((res, el) => {
          const maNotPushed =
            el.typeId !== 1 &&
            !_.find(res, tsh => {
              const isSameType = tsh.typeId === el.typeId;
              const isSameProject = el.project ? tsh.projectId === el.project.id : tsh.projectId === 0;
              const isSameSprint = (el.sprint ? el.sprint.id : 0) === (tsh.sprint ? tsh.sprint.id : 0);
              return isSameType && isSameProject && isSameSprint;
            });

          if (maNotPushed && isThisWeek(el.onDate)) {
            res.push({
              typeId: el.typeId,
              projectName: el.project ? el.project.name : 'Без проекта',
              projectId: el.project ? el.project.id : 0,
              sprintId: el.sprintId ? el.sprintId : null,
              sprint: el.sprint ? el.sprint : null
            });
          }
          return res;
        }, [])
      : [];

    magicActivities = magicActivities.map(element => {
      const timeSheets = [];
      for (let index = 0; index < 7; index++) {
        const timesheet = _.find(list, tsh => {
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
            onDate: moment(startingDay)
              .weekday(index)
              .format(),
            spentTime: '0'
          });
        }
      }
      return { ...element, timeSheets };
    });

    console.log('magicActivities', magicActivities);

    const magicActivityRows = magicActivities.map(item => {
      return (
        <ActivityRow
          key={`${item.projectId}-${item.typeId}-${startingDay}-${item.sprint ? item.sprint.id : 0}`}
          ma
          item={item}
        />
      );
    });

    // Создание заголовка таблицы

    const days = [];
    for (let number = 0; number < 7; number++) {
      const currentDay = moment(startingDay).weekday(number);
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

    const dayTaskHours = (arr, day) => {
      return arr.map(tsh => {
        if (
          moment(tsh.onDate).format('DD.MM.YY') ===
          moment(startingDay)
            .weekday(day)
            .format('DD.MM.YY')
        ) {
          return +tsh.spentTime;
        }
        return 0;
      });
    };

    const calculateDayTaskHours = (arr, day) => {
      if (arr.length > 0) {
        const hours = dayTaskHours(arr, day);
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    };

    const calculateTotalTaskHours = arr => {
      if (arr.length > 0) {
        const hours = arr.map(tsh => +tsh.spentTime);
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
          <div>{calculateDayTaskHours(list, day)}</div>
        </td>
      );
    }

    return (
      <div>
        <section>
          <h3>Отчеты по времени</h3>
          <hr />
          <table className={css.timeSheetsTable}>
            <thead>
              <tr className={css.sheetsHeader}>
                <th className={css.prevWeek}>
                  <div className={css.activityHeader}>Недельная активность:</div>
                  <IconArrowLeft data-tip="Предыдущая неделя" onClick={this.setPrevWeek} />
                </th>
                {days}
                <th className={css.nextWeek}>
                  <IconArrowRight data-tip="Следующая неделя" onClick={this.setNextWeek} />
                </th>
                <th className={cn(css.actions)}>
                  <div className={css.changeWeek} data-tip="Выбрать дату" onClick={this.toggleCalendar}>
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
              <tr>
                <td className={css.total} />
                {totalRow}
                <td className={cn(css.total, css.totalWeek, css.totalRow)}>
                  <div>{calculateTotalTaskHours(list)}</div>
                </td>
                <td className={css.total} />
              </tr>
            </tbody>
          </table>
        </section>
        {this.state.isModalOpen ? <AddActivityModal onClose={() => this.setState({ isModalOpen: false })} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  startingDay: state.Timesheets.startingDay,
  list: state.Timesheets.list,
  tempTimesheets: state.Timesheets.tempTimesheets,
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd
});

const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTimesheets);
