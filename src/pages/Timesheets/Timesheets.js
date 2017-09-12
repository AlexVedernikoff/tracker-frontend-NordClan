import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import DayPicker from 'react-day-picker';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import LocaleUtils from 'react-day-picker/moment';
import * as css from './Timesheets.scss';
import { IconComment, IconClose, IconComments, IconPlus, IconArrowLeft, IconArrowRight, IconCalendar, IconCheck, IconCheckAll } from '../../components/Icons';
import Button from '../../components/Button';

class Calendar extends React.Component {
  static propTypes = {
    onCancel: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.state = {};
  }

  handleClickOutside = evt => {
    this.props.onCancel();
  }

  render () {
    const { onCancel, ...other } = this.props;

    return (
      <div
        className={cn(css.dateDropdown, 'st-week-select')}
      >
        <DayPicker
          locale='ru'
          enableOutsideDays
          localeUtils={{ ...LocaleUtils }}
          {...other}
        />
      </div>
    );
  }
}

Calendar = onClickOutside(Calendar);

class TotalComment extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = evt => {
    this.setState({
      isOpen: false
    });
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {

    return (
      <div>
        <IconComments onClick={this.toggle}/>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isOpen
            ? <div className={cn(css.totalComment)}>
                <div>
                  <div className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      Пн.<br/>21.08
                    </div>
                    <textarea placeholder="Введите текст комментария" />
                  </div>
                  <div className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      Вт.<br/>22.08
                    </div>
                    <textarea placeholder="Введите текст комментария" />
                  </div>
                  <div className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      Ср.<br/>23.08
                    </div>
                    <textarea placeholder="Введите текст комментария" />
                  </div>
                </div>
                <div className={css.checkAll} onClick={this.toggle}>
                  <IconCheckAll/>
                </div>
              </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

TotalComment = onClickOutside(TotalComment);

class SingleComment extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = evt => {
    this.setState({
      isOpen: false
    });
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {

    return (
      <div>
        <IconComment onClick={this.toggle}/>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isOpen
            ? <div className={cn(css.commentDropdown, css.singleComment)}>
                <textarea autoFocus placeholder="Введите текст комментария" />
                <div onClick={this.toggle} className={css.saveBtn}>
                  <IconCheck/>
                </div>
              </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

SingleComment = onClickOutside(SingleComment);

class Timesheets extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCalendarOpen: false
    };
  }

  toggleCalendar = () => {
    this.setState({isCalendarOpen: !this.state.isCalendarOpen});
  }

  render () {
    const { isCalendarOpen } = this.state;
    return (
      <div>
        <section>
          <h1>Отчеты по времени</h1>
          <hr/>
          <div className={css.tableContainer}>
            <table>
              <thead>
                <tr className={css.sheetsHeader}>
                  <th className={css.prevWeek}><IconArrowLeft data-tip="Предыдущая неделя"/></th>
                  <th className={cn(css.day)}>Пн<br/>21.08</th>
                  <th className={cn(css.day)}>Вт<br/>22.08</th>
                  <th className={cn(css.day, css.today)}>Ср<br/>23.08</th>
                  <th className={cn(css.day)}>Чт<br/>24.08</th>
                  <th className={cn(css.day)}>Пт<br/>25.08</th>
                  <th className={cn(css.day, css.weekend)}>Сб<br/>26.08</th>
                  <th className={cn(css.day, css.weekend)}>Вс<br/>27.08</th>
                  <th className={css.nextWeek}><IconArrowRight data-tip="Следующая неделя"/></th>
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
                        ? <Calendar onCancel={this.toggleCalendar} onDayClick={(day) => console.log(day)} />
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
                    <div className={cn(css.timeCell, css.filled)}>
                      <input type="text" defaultValue="0.25"/>
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
                      0.75
                    </div>
                    <div className={css.toggleComment}>
                      <TotalComment/>
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
                      5.25
                    </div>
                    <div className={css.toggleComment}>
                      <TotalComment/>
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
                  <td className={css.total}>5.25</td>
                  <td className={css.total}>0.5</td>
                  <td className={cn(css.total, css.inactive, css.today)}>0</td>
                  <td className={cn(css.total, css.inactive)}>0</td>
                  <td className={cn(css.total, css.inactive)}>0</td>
                  <td className={cn(css.total, css.inactive, css.weekend)}>0</td>
                  <td className={cn(css.total, css.inactive, css.weekend)}>0</td>
                  <td className={cn(css.total, css.totalWeek, css.totalRow)}>6.5</td>
                  <td className={css.total}></td>
                </tr>
                <tr>
                  <td colSpan="10">
                  <a className={css.add}>
                      <IconPlus style={{fontSize: 16}}/>
                      <div className={css.tooltip}>
                        Добавить активность
                      </div>
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Button text="Отправить на согласование" type="primary" style={{marginTop: '2rem'}}/>
        </section>
      </div>
    );
  }
}

export default Timesheets;
