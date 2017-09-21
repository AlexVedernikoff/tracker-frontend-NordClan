import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { getTimesheets, changeWeek } from '../../actions/Timesheets';
import * as css from './Timesheets.scss';
import { IconClose, IconPlus, IconArrowLeft, IconArrowRight, IconCalendar } from '../../components/Icons';
import Button from '../../components/Button';
import AddActivityModal from './AddActivityModal';
import Calendar from './Calendar';
import TotalComment from './TotalComment';
import SingleComment from './SingleComment';

class Timesheets extends React.Component {
  static propTypes = {
    changeWeek: PropTypes.func,
    dateBegin: PropTypes.string,
    dateEnd: PropTypes.string,
    getTimesheets: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.state = {
      isCalendarOpen: false,
      startingDay: moment()
    };
  }

  componentDidMount () {
    const { getTimesheets, userId } = this.props; // eslint-disable-line
    getTimesheets({ userId, dateBegin: '2017-09-18', dateEnd: '2017-09-24'});
  }

  toggleCalendar = () => {
    this.setState({isCalendarOpen: !this.state.isCalendarOpen});
  }

  calculateWeek = () => {
    console.log(this.state.startingDay);
    this.props.changeWeek(
      moment(this.state.startingDay).day(1).format('YYYY-MM-DD'),
      moment(this.state.startingDay).day(7).format('YYYY-MM-DD'),
    );
  }

  setPrevWeek = () => {
    this.setState({
      startingDay: moment(this.state.startingDay).subtract(7, 'days')
    }, this.props.changeWeek(
      moment(this.state.startingDay).day(1).format('YYYY-MM-DD'),
      moment(this.state.startingDay).day(7).format('YYYY-MM-DD'),
      moment(this.state.startingDay).subtract(7, 'days')
    ));
  }

  setNextWeek = () => {
    this.setState({
      startingDay: moment(this.state.startingDay).add(7, 'days')
    });
  }

  setDate = (day) => {
    this.setState({
      startingDay: moment(day),
      isCalendarOpen: false
    });
  }

  render () {
    const { isCalendarOpen, startingDay } = this.state;
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
    return (
      <div>
        <section>
          <h1>Отчеты по времени</h1>
          <hr/>
          <table className={css.timeSheetsTable}>
            <thead>
              <tr className={css.sheetsHeader}>
                <th className={css.prevWeek}>
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
              <tr className={css.taskRow}>
                <td>
                  <div className={css.taskCard}>
                    <div className={css.meta}>
                      <span>SimTrack</span>
                    </div>
                    <div>
                      Совещание
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="0.25"/>
                    <span className={cn(css.toggleComment, css.checked)}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="0.25"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.today)}>
                  <div>
                    <div className={cn(css.timeCell, css.filled)}>
                      <input type="text" defaultValue="0.25"/>
                      <span className={css.toggleComment}>
                        <SingleComment/>
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.total, css.totalRow)}>
                  <div>
                    <div>
                      0.75
                    </div>
                    <div className={css.toggleComment}>
                      <TotalComment/>
                    </div>
                  </div>
                </td>
                <td className={cn(css.actions)}>
                  <div className={css.deleteTask} data-tip="Удалить">
                    <IconClose/>
                  </div>
                </td>
              </tr>
              <tr className={css.taskRow}>
                <td>
                  <div className={css.taskCard}>
                    <div className={css.meta}>
                      <span>ST-433</span>
                      <span>SimTrack</span>
                      <span>Develop</span>
                    </div>
                    <div>
                      <a>UI: Страница задачи. Не хватает кнопки Создания задачи со страницы задачи</a>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="5"/>
                    <span className={cn(css.toggleComment, css.checked)}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="0.25"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.today)}>
                  <div>
                    <div className={cn(css.timeCell)}>
                      <input type="text" placeholder="0"/>
                      <span className={css.toggleComment}>
                        <SingleComment/>
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <SingleComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.total, css.totalRow)}>
                  <div>
                    <div>
                      5.25
                    </div>
                    <div className={css.toggleComment}>
                      <TotalComment/>
                    </div>
                  </div>
                </td>
                <td className={cn(css.actions)}>
                  <div className={css.deleteTask} data-tip="Удалить">
                    <IconClose/>
                  </div>
                </td>
              </tr>
              <tr>
                <td className={css.total}></td>
                <td className={css.total}><div>5.25</div></td>
                <td className={css.total}><div>0.5</div></td>
                <td className={cn(css.total, css.inactive, css.today)}><div>0</div></td>
                <td className={cn(css.total, css.inactive)}><div>0</div></td>
                <td className={cn(css.total, css.inactive)}><div>0</div></td>
                <td className={cn(css.total, css.inactive, css.weekend)}><div>0</div></td>
                <td className={cn(css.total, css.inactive, css.weekend)}><div>0</div></td>
                <td className={cn(css.total, css.totalWeek, css.totalRow)}><div>6.5</div></td>
                <td className={css.total}></td>
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
          <Button text="Отправить на согласование" type="primary" style={{marginTop: '2rem'}}/>
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
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd
});

const mapDispatchToProps = {
  getTimesheets,
  changeWeek
};

export default connect(mapStateToProps, mapDispatchToProps)(Timesheets);
