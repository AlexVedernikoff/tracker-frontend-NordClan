import React from 'react';
import cn from 'classnames';
import moment from 'moment';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import find from 'lodash/find';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import css from './TimesheetsTable.scss';
import Calendar from './Calendar';
import ActivityRow from './ActivityRow';
import UserRow from './UserRow';
import exactMath from 'exact-math';
import localize from './TimesheetsTable.json';
import { getFullName } from '../../utils/NameLocalisation';
import { IconArrowLeft, IconArrowRight, IconCalendar } from '../Icons';
import * as timesheetsConstants from '../../constants/Timesheets';
import {
  TIMESHEET_REPORT_SEND_FOR_CONFIRMATION,
  TIMESHEET_STATUS_APPROVED, TIMESHEET_STATUS_FILLED,
  TIMESHEET_STATUS_SUBMITTED
} from '../../constants/Timesheets';

interface Params {
  projectId?: string
}

interface TimeSheet {

}

interface Props {
  approveTimesheets: Function
  averageNumberOfEmployees?: string
  changeProjectWeek: Function
  dateBegin: string
  dateEnd: string
  isSingleProjectPage: boolean
  lang: string
  list: any[]
  params: Params
  rejectTimesheets: Function
  startingDay: moment.Moment
  submitTimesheets: Function,
  unsortedUsers: Array<object>,
  getAllUsers: Function,
  approvedStatusFilter: { name: string, value: number }[],
  refreshData?: () => void,
}

interface State {

}

class TimesheetsTable extends React.Component<Props, State> {
  state = {
    isCalendarOpen: false
  };
  componentDidMount() {
    const { getAllUsers, unsortedUsers } = this.props;
    if (!unsortedUsers) getAllUsers();
  }
  approveTimeSheets = (userId, projectId) => {
    this.props.approveTimesheets({
      userId,
      dateBegin: this.props.dateBegin,
      dateEnd: this.props.dateEnd,
      projectId
    });
  };

  rejectTimeSheets = (userId, projectId) => {
    this.props.rejectTimesheets({
      userId,
      dateBegin: this.props.dateBegin,
      dateEnd: this.props.dateEnd,
      projectId
    });
  };

  submitTimesheets = (userId, projectId = null, justRejected = null) => {
    this.props.submitTimesheets({
      userId,
      dateBegin: this.props.dateBegin,
      dateEnd: this.props.dateEnd,
      projectId,
      justRejected
    });
  };

  toggleCalendar = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  setPrevWeek = () => {
    const { changeProjectWeek, params, startingDay } = this.props;
    if (params.projectId !== '') {
      changeProjectWeek(startingDay.subtract(7, 'days'), params.projectId);
    } else {
      changeProjectWeek(startingDay.subtract(7, 'days'));
    }
  };

  setNextWeek = () => {
    const { changeProjectWeek, params, startingDay } = this.props;
    if (params.projectId !== '') {
      changeProjectWeek(startingDay.add(7, 'days'), params.projectId);
    } else {
      changeProjectWeek(startingDay.add(7, 'days'));
    }
  };

  setDate = day => {
    const { changeProjectWeek, params } = this.props;
    this.setState({ isCalendarOpen: false }, () => {
      if (params.projectId !== '') {
        changeProjectWeek(moment(day), params.projectId);
      } else {
        changeProjectWeek(moment(day));
      }
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
  getTaskTimesheets(arr, el, day, userId): TimeSheet[] {
    const timeSheets: TimeSheet[] = [];

    for (let index = 0; index < 7; index++) {
      const timesheet = find((arr || []), tsh => {
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
          spentTime: '0',
          updatedAt: el.updatedAt
        });
      }
    }

    return timeSheets;
  }

  // Overall time by week for user tasks
  getUserTimesheets(user) {
    const { startingDay } = this.props;
    const timeSheets: TimeSheet[] = [];
    for (let index = 0; index < 7; index++) {
      const dayUserSheets = filter((user.timesheet || []), tsh => {
        return (
          moment(tsh.onDate).format('DD.MM.YY') ===
          moment(startingDay)
            .weekday(index)
            .format('DD.MM.YY')
        );
      });
      const approvedByUserId = (() => {
        const currentUser = user?.timesheet?.find(element => typeof element.approvedByUserId === 'number');

        if (currentUser) {
          return currentUser.approvedByUserId || null;
        }

        return null;
      })();

      if (dayUserSheets && dayUserSheets?.length) {
        const dayTime = dayUserSheets?.reduce((a, b) => {
          return a + parseFloat(b.spentTime);
        }, 0);
        const billableTime = dayUserSheets?.reduce((a, b) => {
          return a + (b.isBillable ? parseFloat(b.spentTime) : 0);
        }, 0);
        const unBillableTime = dayUserSheets?.reduce((a, b) => {
          return a + (!b.isBillable ? parseFloat(b.spentTime || 0) : 0);
        }, 0);
        timeSheets.push({
          onDate: moment(startingDay)
            .weekday(index)
            .format(),
          spentTime: dayTime + '',
          billableTime: billableTime + '',
          unBillableTime: unBillableTime + '',
          statusId: dayUserSheets[0].statusId,
          approvedByUserId
        });
      } else {
        timeSheets.push({
          onDate: moment(startingDay)
            .weekday(index)
            .format(),
          spentTime: '0',
          billableTime: '0',
          unBillableTime: '0',
          approvedByUserId,
          statusId: null
        });
      }
    }
    return timeSheets;
  }

  checkStatus(el) {
    const newObj = {
      isSubmitted: false,
      isApproved: false,
      isRejected: false,
    };

    if (el.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED) {
      newObj.isSubmitted = true;
    }
    if (el.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED) {
      newObj.isApproved = true;
    }
    if (el.statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED) {
      newObj.isRejected = true;
    }
    return newObj;
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

    return timesheets?.reduce((res, el) => {
      if (el.typeId === 1) {
        return res;
      }

      const maNotPushed = !res?.find(tsh => {
        const usSameUser = tsh.userId === el.userId;
        const isSameType = tsh.typeId === el.typeId;
        const isSameSprint = (el.sprint ? el.sprint.id : 0) === (tsh.sprint ? tsh.sprint.id : 0);
        const isSameProject = (el.projectId ? el.projectId : 0) === (tsh.projectId ? tsh.projectId : 0);
        return isSameType && isSameProject && isSameSprint && usSameUser;
      });

      if (maNotPushed && this.isThisWeek(el.onDate) && el.spentTime !== '0' && el.spentTime !== '0.00') {
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
    const tasks: any[] = [];

    // Создание массива таймшитов по magic activities
    const magicActivities = user.timesheet && user.timesheet.length ? this.getMagicActivities(user.timesheet) : [];

    magicActivities?.forEach(element => {
      const timeSheets: TimeSheet[] = [];
      for (let index = 0; index < 7; index++) {
        const timesheetFiltered = filter((user.timesheet || []), tsh => {
          return (
            tsh.typeId !== 1 &&
            tsh.typeId === element.typeId &&
            (tsh.sprint && element.sprint ? tsh.sprint.id === element.sprint.id : !tsh.sprint && !element.sprint) &&
            (tsh.project ? tsh.project.id === element.projectId : !tsh.project && !element.projectId) &&
            moment(tsh.onDate).format('DD.MM.YY') ===
            moment(startingDay)
              .weekday(index)
              .format('DD.MM.YY')
          );
        });

        const timesheet =
          timesheetFiltered &&
            timesheetFiltered.length !== 0 &&
            timesheetFiltered?.find(a => a.spentTime !== '0.00' && a.spentTime !== '0' && a.spentTime !== 0)
            ? timesheetFiltered?.find(a => a.spentTime !== '0.00' && a.spentTime !== '0' && a.spentTime !== 0)
            : timesheetFiltered[0];

        if (timesheet) {
          timesheet.isFirstInProject = false;
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
            spentTime: '0',
            isFirstInProject: false,
            updatedAt: element.updatedAt
          });
        }
      }

      tasks.push({ ...element, timeSheets });
    });
    return tasks;
  }

  getUsersWithTimeSheets() {
    const { list } = this.props;
    const usersTimesheets = list.filter(list => !list.userId)
    const users = usersTimesheets.map(user => {
      const userName = getFullName(user, true) || null;
      const newUserObj: any = {
        active: user.active,
        userName,
        employmentDate: user.employmentDate,
        dismissalDate: user.dismissalDate,
        id: user.id,
        isOpen: false,
        isSubmitted: false,
        isRejected: false,
        isApproved: false,
        tasksAndMa: [],
        tasks: [],
        timesheets: this.getUserTimesheets(user),
        ma: [],
        projects: []
      };

      const tasks: any[] = [];
      user.timesheet?.forEach(el => {
        const statusObj = this.checkStatus(el);
        newUserObj.isSubmitted = statusObj.isSubmitted;
        newUserObj.isApproved = statusObj.isApproved;
        newUserObj.isRejected = statusObj.isRejected;

        if (el.task) {
          const exists = tasks?.find(usrTask => {
            return usrTask.taskStatusId === el.taskStatusId && usrTask.id === el.task.id;
          });
          if (!exists) {
            tasks.push(this.getTaskFromTimesheet(user.id, el, user.timesheet));
          }
        }
      });
      const mas = this.userMagicActivities(user) || [];
      let masAndTasks: any[] = [];
      const projects: any[] = [];

      mas.map(elem => {
        masAndTasks.push({ ...elem, isTask: false });
      });
      tasks.map(elem => {
        masAndTasks.push({ ...elem, isTask: true });
      });

      masAndTasks = sortBy(masAndTasks, ['projectId']);

      masAndTasks.map((element, key) => {
        if (key === 0 || (key !== 0 && element.projectId !== masAndTasks[key - 1].projectId)) {
          element.isFirstInProject = true;
          const statusObj = this.checkStatus(element);
          projects.push({
            projectId: element.projectId,
            status: element.statusId,
            isSubmitted: statusObj.isSubmitted,
            isApproved: statusObj.isApproved,
            isRejected: statusObj.isRejected,
            dateUpdate: element.timeSheets === null ? undefined : element.timeSheets[0].updatedAt
          });
        } else {
          element.isFirstInProject = false;
        }
      });

      newUserObj.projects = projects;
      newUserObj.ma = sortBy(mas, ['projectId']);
      newUserObj.tasks = sortBy(tasks, ['projectId']);
      newUserObj.masAndTasks = masAndTasks;
      return newUserObj;
    });

    return sortBy(users, ['userName']);
  }

  render() {
    const { isCalendarOpen } = this.state;
    const { startingDay, list, lang, averageNumberOfEmployees, params, unsortedUsers, approvedStatusFilter } = this.props;
    const users = this.getUsersWithTimeSheets();
    const mapUsers = users?.reduce((acc, user) => {
      acc.set(user.id, user);

      return acc;
    }, new Map());

    const userRows: React.ReactNode[] = [];
    const { projectId } = params;

    for (const user of users) {
      let isApproved = false;
      let isSubmitted = false;
      let isRejected = false;
      let isDisabled = false;
      let allSame = true;

      if (user.projects?.length !== 0) {
        user.projects?.forEach(proj => {
          if (
            proj.isRejected !== user.projects[0].isRejected ||
            proj.isSubmitted !== user.projects[0].isSubmitted ||
            proj.isApproved !== user.projects[0].isApproved
          ) {
            allSame = false;
          }
        });

        const rejected = user.projects.filter(a => a.isRejected)?.length;
        if (rejected !== 0) {
          isDisabled = true;
        }
        if (allSame) {
          isApproved = user.projects[0].isApproved;
          isSubmitted = user.projects[0].isSubmitted;
          isRejected = user.projects[0].isRejected;
        } else {
          isSubmitted = true;
        }
      }

      const hasFilledTimeSheets = user.timesheets.some(timeSheet => timeSheet.statusId === TIMESHEET_STATUS_FILLED);

      if (!approvedStatusFilter || approvedStatusFilter?.length === 0 || (
        approvedStatusFilter?.find(a => a.value === TIMESHEET_STATUS_FILLED && hasFilledTimeSheets) ||
        approvedStatusFilter?.find(a => a.value === TIMESHEET_STATUS_APPROVED && isApproved) ||
        approvedStatusFilter?.find(a => a.value === TIMESHEET_STATUS_SUBMITTED && isSubmitted) ||
        approvedStatusFilter?.find(a => a.value === TIMESHEET_REPORT_SEND_FOR_CONFIRMATION && !isSubmitted && !isRejected && !isApproved)
      )) {
        userRows.push([
          <UserRow
            projectId={projectId}
            projects={user.projects}
            key={`${user.id}-${startingDay}`}
            user={user}
            users={mapUsers}
            approveTimesheets={this.approveTimeSheets}
            rejectTimesheets={this.rejectTimeSheets}
            submitTimesheets={this.submitTimesheets}
            isApproved={isApproved}
            isRejected={isRejected}
            isSubmitted={isSubmitted}
            isDisabled={isDisabled}
            items={[
              ...user.masAndTasks.map(task => {
                const lst = [true, false];
                let result: React.ReactNode[] = [];
                const project = user.projects?.find(prj => {
                  return prj.projectId === task.projectId;
                });
                if (task.isTask) {
                  if (task.isFirstInProject && !this.props.isSingleProjectPage) {
                    result = lst.map(element => {
                      if (element) {
                        return (
                          <ActivityRow
                            key={`${task.id}-${task.taskStatusId}-${startingDay}-${task.statusId}-task-project`}
                            task
                            item={task}
                            isFirstInProject={element}
                            project={project}
                            user={user}
                            users={unsortedUsers}
                            approveTimesheets={this.approveTimeSheets}
                            rejectTimesheets={this.rejectTimeSheets}
                            submitTimesheets={this.submitTimesheets}
                            refreshData={this.props.refreshData}
                          />
                        );
                      }

                      return (
                        <ActivityRow
                          key={`${task.id}-${task.taskStatusId}-${startingDay}-${task.statusId}-task`}
                          task
                          item={task}
                          user={user}
                          isFirstInProject={element}
                          refreshData={this.props.refreshData}
                        />
                      );
                    });
                    return result;
                  }
                  return (
                    <ActivityRow
                      key={`${task.id}-${task.taskStatusId}-${startingDay}-${task.statusId}-task`}
                      task
                      item={task}
                      user={user}
                      isFirstInProject={false}
                      refreshData={this.props.refreshData}
                    />
                  );
                } else {
                  if (task.isFirstInProject && !this.props.isSingleProjectPage) {
                    result = lst.map(element => {
                      if (element) {
                        return (
                          <ActivityRow
                            key={`${user.id}-${startingDay}-${task.statusId}-${task.typeId}-${
                              task.projectId ? task.projectId : 0
                              }-${task.sprint ? task.sprint.id : 0}-ma-project`}
                            ma
                            item={task}
                            isFirstInProject={element}
                            project={project}
                            user={user}
                            users={unsortedUsers}
                            approveTimesheets={this.approveTimeSheets}
                            rejectTimesheets={this.rejectTimeSheets}
                            submitTimesheets={this.submitTimesheets}
                            refreshData={this.props.refreshData}
                          />
                        );
                      }
                      return (
                        <ActivityRow
                          key={`${user.id}-${startingDay}-${task.statusId}-${task.typeId}-${
                            task.projectId ? task.projectId : 0
                            }-${task.sprint ? task.sprint.id : 0}-ma`}
                          ma
                          item={task}
                          user={user}
                          isFirstInProject={element}
                          refreshData={this.props.refreshData}
                        />
                      );
                    });
                    return result;
                  }

                  return (
                    <ActivityRow
                      key={`${user.id}-${startingDay}-${task.statusId}-${task.typeId}-${
                        task.projectId ? task.projectId : 0
                        }-${task.sprint ? task.sprint.id : 0}-ma`}
                      ma
                      item={task}
                      user={user}
                      isFirstInProject={false}
                      refreshData={this.props.refreshData}
                    />
                  );
                }
              })
            ]}
          />
        ])
      };
    }

    // Создание заголовка таблицы
    const days: React.ReactNode[] = [];
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

    const totalRow: React.ReactNode[] = [];
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

    const dayTaskUnbillHours = (arr, day) => {
      return arr.map(tsh => {
        if (
          moment(tsh.onDate).format('DD.MM.YY') ===
          moment(startingDay)
            .weekday(day)
            .format('DD.MM.YY')
        ) {
          return !tsh.isBillable ? +tsh.spentTime : 0
        }
        return 0;
      });
    };

    const calculateDayTaskHours = (tsUsers, day, billable = false) => {
      const arr = tsUsers?.reduce((timeSheets, user) => [...timeSheets, ...(user.timesheet || [])], []);
      if (arr.length > 0) {
        const hours = dayTaskHours(arr, day, billable);
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    };

    const calculateDayTaskUnbillHours = (tsUsers, day) => {
      const arr = tsUsers?.reduce((timeSheets, user) => [...timeSheets, ...(user.timesheet || [])], []);
      if (arr.length > 0) {
        const hours = dayTaskUnbillHours(arr, day);
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    };

    const calculateUnbillHours = (tsUsers) => {
      const arr = tsUsers?.reduce((timeSheets, user) => [...timeSheets, ...(user.timesheet || [])], []);
      if (arr.length > 0) {
        const hours = arr.map(tsh => (!tsh.isBillable ? +tsh.spentTime : 0));
        if (hours.length === 1) {
          return hours[0];
        }
        return exactMath.add(...hours);
      }
      return 0;
    }

    const calculateTotalTaskHours = (tsUsers, billable = false) => {
      const arr = tsUsers?.reduce((timeSheets, user) => [...timeSheets, ...(user.timesheet || [])], []);
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
            {calculateDayTaskUnbillHours(list, day)}/{calculateDayTaskHours(list, day, true)}/{calculateDayTaskHours(list, day)}
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
            <td className={css.total}>{averageNumberOfEmployees}</td>
            {totalRow}
            <td className={cn(css.total, css.totalWeek, css.totalRow)}>
              <div>
                {calculateUnbillHours(list)}/{calculateTotalTaskHours(list, true)}/{calculateTotalTaskHours(list)}
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
