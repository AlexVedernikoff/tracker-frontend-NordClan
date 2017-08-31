import React from 'react';
import cn from 'classnames';
import * as css from './Timesheets.scss';
import { IconComment, IconClose, IconComments, IconPlus, IconArrowLeft, IconArrowRight, IconCalendar } from '../../components/Icons';
import DayPicker from 'react-day-picker';

class Timesheets extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      isCalendarOpen: false
    };
  }

  render () {
    const { isCalendarOpen } = this.state;
    return (
      <div>
        <section>
          <h1>Отчеты по времени</h1>
          <hr/>
          <table>
            <thead>
              <tr className={css.sheetsHeader}>
                <th className={css.prevWeek}><IconArrowLeft data-tip="Предыдущая неделя"/></th>
                <th className={cn(css.day)}>Пн<br/>21.08</th>
                <th className={cn(css.day)}>Вт<br/>22.08</th>
                <th className={cn(css.day)}>Ср<br/>23.08</th>
                <th className={cn(css.day)}>Чт<br/>24.08</th>
                <th className={cn(css.day)}>Пт<br/>25.08</th>
                <th className={cn(css.day, css.weekend)}>Сб<br/>26.08</th>
                <th className={cn(css.day, css.weekend)}>Вс<br/>27.08</th>
                <th className={css.nextWeek}><IconArrowRight data-tip="Следующая неделя"/></th>
                <th className={cn(css.actions)}>
                  <div className={css.changeWeek} data-tip="Выбрать дату" onClick={() => this.setState({isCalendarOpen: !isCalendarOpen})}>
                    <IconCalendar/>
                  </div>
                  {
                    isCalendarOpen
                    ? <DayPicker />
                    : null
                  }
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
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="0.25"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="0.25"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.total, css.totalRow)}>
                  <div>
                    0.75
                  </div>
                  <div className={css.toggleComment}>
                    <IconComments/>
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
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell, css.filled)}>
                    <input type="text" defaultValue="0.25"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.weekend)}>
                  <div className={cn(css.timeCell)}>
                    <input type="text" placeholder="0"/>
                    <span className={css.toggleComment}>
                      <IconComment/>
                    </span>
                  </div>
                </td>
                <td className={cn(css.total, css.totalRow)}>
                  <div>
                    5.25
                  </div>
                  <div className={css.toggleComment}>
                    <IconComments/>
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
                <td className={cn(css.total, css.inactive)}>0</td>
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
        </section>
      </div>
    );
  }
}

export default Timesheets;
