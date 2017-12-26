import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import roundNum from '../../utils/roundNum';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as timesheetsActions from '../../actions/Timesheets';
import * as css from './Timesheets.scss';
import { IconPlus, IconArrowLeft, IconArrowRight, IconCalendar } from '../../components/Icons';
import AddActivityModal from './AddActivityModal';
import Calendar from './Calendar';
import ActivityRow from './ActivityRow';

class Timesheets extends React.Component {
  static propTypes = {
    changeWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    getTimesheets: PropTypes.func,
    list: PropTypes.array,
    startingDay: PropTypes.object,
    tempTimesheets: PropTypes.array,
    userId: PropTypes.number
  };

  constructor (props) {
    super(props);
    this.state = {
      isCalendarOpen: false
    };
  }

  componentDidMount () {
    const { getTimesheets, userId, dateBegin, dateEnd } = this.props;
    getTimesheets({ userId, dateBegin, dateEnd});
  }

  toggleCalendar = () => {
    this.setState({isCalendarOpen: !this.state.isCalendarOpen});
  };

  setPrevWeek = () => {
    const { changeWeek, userId, startingDay } = this.props;
    changeWeek(startingDay.subtract(7, 'days'), userId);
  };

  setNextWeek = () => {
    const { changeWeek, userId, startingDay } = this.props;
    changeWeek(startingDay.add(7, 'days'), userId);
  };

  setDate = (day) => {
    const { changeWeek, userId } = this.props;
    this.setState({isCalendarOpen: false}, () => {
      changeWeek(moment(day), userId);
    });
  };

  render () {
    const { isCalendarOpen } = this.state;
    const { startingDay, tempTimesheets, getTimesheets, userId, dateBegin, dateEnd } = this.props;
    const hasEnableTs = !!this.props.list.filter(tsh => tsh.statusId !== 3 && tsh.statusId !== 4).length;
    const countTsWithTime = this.props.list.filter(tsh => tsh.spentTime !== 0).length;
    const defaultTaskStatusId = 2;
    const list = tempTimesheets
      .map(timesheet => {
        return {
          ...timesheet,
          taskStatusId: timesheet.taskStatusId || defaultTaskStatusId
        }
      }).concat(this.props.list)

    const isThisWeek = (date) => {
      const getMidnight = (dayOfWeek) => {
        return moment(startingDay)
          .weekday(dayOfWeek)
          .set({hour: 0, minute: 0, second: 0, millisecond: 0})
          .format('X');
      };

      const timesheetOndDate = moment(date).format('X');
      return (timesheetOndDate <= getMidnight(6)) && (timesheetOndDate >= getMidnight(0));
    };

    // Создание массива таймшитов по таскам

    let tasks = list.length ? list.reduce((res, el) => {

      const taskNotPushed
        = el.task
        && !_.find(res, tsh => {
          return tsh.id === el.task.id
          && tsh.taskStatusId === el.taskStatusId;
        });

      if (taskNotPushed && isThisWeek(el.onDate)) {
        res.push({
          id: el.task.id,
          name: el.task.name,
          projectId: el.project.id,
          projectName: el.project.name,
          taskStatusId: el.taskStatusId
        });
      }
      return res;
    }, []) : [];

    tasks = tasks.map(element => {
      const timeSheets = [];

      for (let index = 0; index < 7; index++) {
        const timesheet = _.find(list, tsh => {
          return tsh.task && tsh.typeId === 1
          && (tsh.task.id === element.id)
          && (moment(tsh.onDate).format('DD.MM.YY') === moment(startingDay).weekday(index).format('DD.MM.YY'))
          && (tsh.taskStatusId === element.taskStatusId);
        });
        if (timesheet) {
          timeSheets.push(timesheet);
        } else {
          timeSheets.push({ onDate: moment(startingDay).weekday(index).format(), spentTime: '0' });
        }
      }
      return { ...element, timeSheets };
    });

    _.sortBy(tasks, ['name']);

    const taskRows = tasks.map((item) => <ActivityRow key={`${item.id}-${item.taskStatusId}-${startingDay}`} task item={item} />);

    // Создание массива таймшитов по magic activities

    let magicActivities = list.length ? list.reduce((res, el) => {

      const maNotPushed
        = el.typeId !== 1
        && !_.find(res, tsh => {
          const isSameType = tsh.typeId === el.typeId;
          const isSameProject = el.project ? (tsh.projectId === el.project.id) : (tsh.projectId === 0);
          return isSameType && isSameProject;
        });

      if (maNotPushed && isThisWeek(el.onDate)) {
        res.push({
          typeId: el.typeId,
          projectName: el.project ? el.project.name : 'Без проекта',
          projectId: el.project ? el.project.id : 0
        });
      }
      return res;
    }, []) : [];

    magicActivities = magicActivities.map(element => {
      const timeSheets = [];
      for (let index = 0; index < 7; index++) {
        const timesheet = _.find(list, tsh => {
          return tsh.typeId !== 1
          && (tsh.typeId === element.typeId)
          && (tsh.project ? (tsh.project.id === element.projectId) : (!tsh.project && !element.projectId))
          && (moment(tsh.onDate).format('DD.MM.YY') === moment(startingDay).weekday(index).format('DD.MM.YY'));
        });
        if (timesheet) {
          timeSheets.push(timesheet);
        } else {
          timeSheets.push({ onDate: moment(startingDay).weekday(index).format(), spentTime: '0' });
        }
      }
      return { ...element, timeSheets };
    });

    const magicActivityRows = magicActivities.map((item) => <ActivityRow key={`${item.projectId}-${item.typeId}-${startingDay}`} ma item={item} />);

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
            <br/>{currentDay.format('DD.MM')}
          </div>
        </th>
      );
    }

    // Создание строки с суммой времени по дням

    const totalRow = [];
    for (let day = 0; day < 7; day++) {
      totalRow.push(
        <td key={day} className={cn({
          [css.total]: true,
          [css.weekend]: day === 5 || day === 6,
          [css.today]: moment().format('DD.MM.YY') === moment(startingDay).weekday(day).format('DD.MM.YY')
        })}>
          <div>
            {_.sumBy(list, tsh => {
              if (moment(tsh.onDate).format('DD.MM.YY') === moment(startingDay).weekday(day).format('DD.MM.YY')) {
                return +tsh.spentTime;
              } else {
                return 0;
              }
            })}
          </div>
        </td>
      );
    }

    return (
      <div>
        <section>
          <h1>Отчеты по времени</h1>
          <hr/>
          <table className={css.timeSheetsTable}>
            <thead>
              <tr className={css.sheetsHeader}>
                <th className={css.prevWeek}>
                  <div className={css.activityHeader}>Недельная активность:</div>
                  <IconArrowLeft data-tip="Предыдущая неделя" onClick={this.setPrevWeek}/>
                </th>
                {days}
                <th className={css.nextWeek}>
                  <IconArrowRight data-tip="Следующая неделя" onClick={this.setNextWeek}/>
                </th>
                <th className={cn(css.actions)}>
                  <div
                    className={css.changeWeek}
                    data-tip="Выбрать дату"
                    onClick={this.toggleCalendar}
                  >
                    <IconCalendar/>
                  </div>
                  <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
                    {
                      isCalendarOpen
                        ? <Calendar onCancel={this.toggleCalendar} onDayClick={this.setDate} />
                        : null
                    }
                  </ReactCSSTransitionGroup>
                </th>
              </tr>
            </thead>
            <tbody>
              { taskRows }
              { magicActivityRows }
              <tr>
                <td className={css.total}/>
                {totalRow}
                <td className={cn(css.total, css.totalWeek, css.totalRow)}>
                  <div>
                    {roundNum(_.sumBy(list, tsh => +tsh.spentTime), 2)}
                  </div>
                </td>
                <td className={css.total}/>
              </tr>
              {
                hasEnableTs || !countTsWithTime
                  ? <tr>
                    <td colSpan="10">
                      <a className={css.add} onClick={() => this.setState({isModalOpen: true})}>
                        <IconPlus style={{fontSize: 16}}/>
                        <div className={css.tooltip}>
                          Добавить активность
                        </div>
                      </a>
                    </td>
                  </tr>
                  : null
              }
            </tbody>
          </table>
        </section>
        {
          this.state.isModalOpen
            ? <AddActivityModal
              onClose={() => this.setState({isModalOpen: false})}
            />
            : null
        }
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
  dateEnd: state.Timesheets.dateEnd
});

const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Timesheets);
