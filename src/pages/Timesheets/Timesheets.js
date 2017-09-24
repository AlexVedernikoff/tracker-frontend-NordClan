import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import _ from 'lodash';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as timesheetsActions from '../../actions/Timesheets';
import * as css from './Timesheets.scss';
import { IconPlus, IconArrowLeft, IconArrowRight, IconCalendar } from '../../components/Icons';
import Button from '../../components/Button';
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
    userId: PropTypes.number
  }

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
  }

  setPrevWeek = () => {
    const { changeWeek, userId, startingDay } = this.props;
    changeWeek(startingDay.subtract(7, 'days'), userId);
  }

  setNextWeek = () => {
    const { changeWeek, userId, startingDay } = this.props;
    changeWeek(startingDay.add(7, 'days'), userId);
  }

  setDate = (day) => {
    const { changeWeek, userId } = this.props;
    this.setState({isCalendarOpen: false}, () => {
      changeWeek(moment(day), userId);
    });
  }

  render () {
    const { isCalendarOpen } = this.state;
    const { startingDay, list, getTimesheets, userId, dateBegin, dateEnd } = this.props;

    // Создание массива таймшитов по таскам

    let tasks = list.length ? list.reduce((res, el) => {
      if (el.task && !_.find(res, tsh => {
        return tsh.id === el.task.id
        && tsh.taskStatusId === el.taskStatusId;
      })) {
        res.push({
          id: el.task.id,
          name: el.task.name,
          projectId: el.task.project.id,
          projectName: el.task.project.name,
          taskStatusId: el.taskStatusId
        });
      }
      return res;
    }, []) : [];

    tasks = tasks.map(element => {
      const timeSheets = [];
      for (let index = 1; index <= 7; index++) {
        const timesheet = _.find(list, tsh => {
          return tsh.task
          && (tsh.task.id === element.id)
          && (moment(tsh.onDate).format('DD.MM.YY') === moment(startingDay).day(index).format('DD.MM.YY'))
          && (tsh.taskStatusId === element.taskStatusId);
        });
        if (timesheet) {
          timeSheets.push(timesheet);
        } else {
          timeSheets.push({ onDate: moment(startingDay).day(index).format(), spentTime: '0' });
        }
      }
      return { ...element, timeSheets };
    });

    _.sortBy(tasks, ['name']);

    const taskRows = tasks.map((item, i) => <ActivityRow key={i} task item={item} />);

    // Создание массива таймшитов по magic activities

    let magicActivities = list.length ? list.reduce((res, el) => {
      if (el.projectMaginActivity && !_.find(res, tsh => {
        return tsh.typeId === el.typeId
        && tsh.projectId === el.projectMaginActivity.id;
      })) {
        res.push({
          typeId: el.typeId,
          projectName: el.projectMaginActivity.name,
          projectId: el.projectMaginActivity.id
        });
      }
      return res;
    }, []) : [];

    magicActivities = magicActivities.map(element => {
      const timeSheets = [];
      for (let index = 1; index <= 7; index++) {
        const timesheet = _.find(list, tsh => {
          return tsh.projectMaginActivity
          && (tsh.typeId === element.typeId)
          && (tsh.projectMaginActivity.id === element.projectId)
          && (moment(tsh.onDate).format('DD.MM.YY') === moment(startingDay).day(index).format('DD.MM.YY'));
        });
        if (timesheet) {
          timeSheets.push(timesheet);
        } else {
          timeSheets.push({ onDate: moment(startingDay).day(index).format(), spentTime: '0' });
        }
      }
      return { ...element, timeSheets };
    });

    const magicActivityRows = magicActivities.map((item, i) => <ActivityRow key={i} ma item={item} />);

    // Создание заголовка таблицы

    const days = [];
    for (let number = 1; number <= 7; number++) {
      const currentDay = moment(startingDay).day(number);
      days.push(
        <th
          className={cn({
            [css.day]: true,
            [css.weekend]: number === 6 || number === 7,
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
    for (let day = 1; day <= 7; day++) {
      totalRow.push(
        <td key={day} className={cn({
          [css.total]: true,
          [css.weekend]: day === 6 || day === 7,
          [css.today]: moment().format('DD.MM.YY') === moment(startingDay).day(day).format('DD.MM.YY')
        })}>
          <div>
            {_.sumBy(list, tsh => {
              if (moment(tsh.onDate).format('DD.MM.YY') === moment(startingDay).day(day).format('DD.MM.YY')) {
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
                    {_.sumBy(list, tsh => { return +tsh.spentTime; })}
                  </div>
                </td>
                <td className={css.total}/>
              </tr>
              <tr>
                <td colSpan="10">
                  <a className={css.add} onClick={() => this.setState({isModalOpen: true})}>
                    <IconPlus style={{fontSize: 16}}/>
                    <div className={css.tooltip}>
                      Добавить активность
                    </div>
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
          <Button text="Отправить на согласование" type="primary" style={{marginTop: '2rem'}} onClick={() => getTimesheets({userId, dateBegin, dateEnd})}/>
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
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd
});

const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(mapStateToProps, mapDispatchToProps)(Timesheets);
