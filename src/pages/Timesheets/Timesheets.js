import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import find from 'lodash/find';
import sortBy from 'lodash/sortBy';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as timesheetsActions from '../../actions/Timesheets';
import { showNotification } from '../../actions/Notifications';
import * as css from './Timesheets.scss';
import { IconArrowLeft, IconArrowRight, IconCalendar, IconPlus } from '../../components/Icons';
import AddActivityModal from './AddActivityModal';
import Calendar from './Calendar';
import ActivityRow from './ActivityRow';
import exactMath from 'exact-math';
import localize from './timesheets.json';
import Title from 'react-title-component';
import { isTimesheetsCanBeChanged } from '../../utils/Timesheets';
import Button from '../../components/Button';
import ConfirmModal from '../../components/ConfirmModal';
import * as timesheetsConstants from '../../constants/Timesheets';

class Timesheets extends React.Component {
  static propTypes = {
    changeWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    deleteTempTimesheets: PropTypes.func,
    getTimesheets: PropTypes.func,
    lang: PropTypes.string,
    list: PropTypes.array,
    showNotification: PropTypes.func,
    startingDay: PropTypes.object,
    submitTimesheets: PropTypes.func,
    tempTimesheets: PropTypes.array,
    userId: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      isCalendarOpen: false,
      isConfirmModalOpen: false,
      isWeekDisabled: false
    };
  }

  componentDidMount() {
    const { getTimesheets, userId, dateBegin, dateEnd } = this.props;
    getTimesheets({ userId, dateBegin, dateEnd });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isWeekDisabled: nextProps.list.some(
        timesheet =>
          timesheet.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
          timesheet.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED
      )
    });
  }

  toggleCalendar = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  setPrevWeek = () => {
    const { changeWeek, userId, startingDay } = this.props;
    changeWeek(startingDay.subtract(7, 'days'), userId);
  };

  setNextWeek = () => {
    const { changeWeek, userId, startingDay } = this.props;
    changeWeek(startingDay.add(7, 'days'), userId);
  };

  setDate = day => {
    const { changeWeek, userId } = this.props;
    this.setState({ isCalendarOpen: false }, () => {
      changeWeek(moment(day), userId);
    });
  };

  submitTimeSheets = () => {
    const { dateBegin, dateEnd, submitTimesheets } = this.props;
    submitTimesheets({ dateBegin, dateEnd });
    this.closeConfirmModal();
  };

  openConfirmModal = () => {
    this.setState({ isConfirmModalOpen: true });
  };

  closeConfirmModal = () => {
    this.setState({ isConfirmModalOpen: false });
  };

  render() {
    const { isCalendarOpen, isConfirmModalOpen, isWeekDisabled } = this.state;
    const { startingDay, tempTimesheets, lang } = this.props;
    const canAddActivity = isTimesheetsCanBeChanged(this.props.list, startingDay, true);

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

    // Создание массива таймшитов по таскам

    let tasks = list.length
      ? list.reduce((res, el) => {
          const isTemp = tempTimesheets.some(tempTsh => tempTsh.id === el.id);
          const taskNotPushed =
            el.task &&
            !find(res, tsh => {
              const isExist = tsh.id === el.task.id && tsh.taskStatusId === el.taskStatusId;
              if (isExist && isTemp) {
                tsh.hilight = true;
              }
              return isExist;
            });
          if (!taskNotPushed && el.task && isTemp) {
            Promise.resolve().then(() => {
              this.props.deleteTempTimesheets([el.id.toString()]);
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
            tsh.taskStatusId === element.taskStatusId
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
              tsh.taskStatusId === element.taskStatusId
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

    sortBy(tasks, ['name']);

    const taskRows = tasks.map(item => (
      <ActivityRow key={`${item.id}-${item.taskStatusId}-${startingDay}`} task item={item} />
    ));

    // Создание массива таймшитов по magic activities
    let magicActivities = list.length
      ? list.reduce((res, el) => {
          const isTemp = tempTimesheets.some(tempTsh => tempTsh.id === el.id);
          const maNotPushed =
            el.typeId !== 1 &&
            !find(res, tsh => {
              const isSameType = tsh.typeId === el.typeId;
              const isSameProject = el.project ? tsh.projectId === el.project.id : tsh.projectId === 0;
              const isSameSprint = (el.sprint ? el.sprint.id : 0) === (tsh.sprint ? tsh.sprint.id : 0);
              if (isSameType && isSameProject && isSameSprint && isTemp) {
                tsh.hilight = true;
              }
              return isSameType && isSameProject && isSameSprint;
            });
          if (!maNotPushed && el.typeId !== 1 && isTemp) {
            Promise.resolve().then(() => {
              this.props.deleteTempTimesheets([el.id.toString()]);
            });
          }
          if (maNotPushed && isThisWeek(el.onDate)) {
            res.push({
              typeId: el.typeId,
              projectName: el.project ? el.project.name : localize[lang].WITHOUT_PROJECT,
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
        const timesheet = find(list, tsh => {
          return (
            tsh.typeId !== 1 &&
            tsh.typeId === element.typeId &&
            (tsh.project ? tsh.project.id === element.projectId : !tsh.project && !element.projectId) &&
            (element.sprint ? element.sprint.id : 0) === (tsh.sprint ? tsh.sprint.id : 0) &&
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
        <Title render={`[Epic] - ${localize[lang].TIMESHEETS_REPORT}`} />
        <section>
          <h1>{localize[lang].TIMESHEETS_REPORT}</h1>
          <hr />
          <table className={css.timeSheetsTable}>
            <thead>
              <tr className={css.sheetsHeader}>
                <th className={css.prevWeek}>
                  <div className={css.activityHeader}>{localize[lang].WEEK_ACTIVITY}</div>
                  <IconArrowLeft data-tip={localize[lang].PREVIOUS_WEEK} onClick={this.setPrevWeek} />
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
              {magicActivityRows}
              {taskRows}
              <tr>
                <td className={css.total} />
                {totalRow}
                <td className={cn(css.total, css.totalWeek, css.totalRow)}>
                  <div>{calculateTotalTaskHours(list)}</div>
                </td>
                <td className={css.total} />
              </tr>
            </tbody>
            {canAddActivity ? (
              <tfoot>
                <tr>
                  <td colSpan="8">
                    {isWeekDisabled ? null : (
                      <a className={css.add} onClick={() => this.setState({ isModalOpen: true })}>
                        <IconPlus style={{ fontSize: 16 }} />
                        <div className={css.tooltip}>{localize[lang].ADD_ACTIVITY}</div>
                      </a>
                    )}
                  </td>
                  <td colSpan="2">
                    <span className={css.submit}>
                      <Button
                        text={localize[lang].SUBMIT}
                        disabled={isWeekDisabled || !this.props.list.length}
                        onClick={this.openConfirmModal}
                        type="green"
                      />
                      <ConfirmModal
                        isOpen={isConfirmModalOpen}
                        contentLabel="modal"
                        text={localize[lang].SUBMIT_CONFIRM}
                        onCancel={this.closeConfirmModal}
                        onConfirm={this.submitTimeSheets}
                        onRequestClose={this.closeConfirmModal}
                      />
                    </span>
                  </td>
                </tr>
              </tfoot>
            ) : null}
          </table>
        </section>
        {this.state.isModalOpen ? <AddActivityModal onClose={() => this.setState({ isModalOpen: false })} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  userId: state.Auth.user.id,
  startingDay: state.Timesheets.startingDay,
  list: state.Timesheets.list,
  tempTimesheets: state.Timesheets.tempTimesheets,
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  ...timesheetsActions,
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Timesheets);
