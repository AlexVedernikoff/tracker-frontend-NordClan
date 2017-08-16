import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import onClickOutside from 'react-onclickoutside';
import ReactTooltip from 'react-tooltip';

import { IconPause, IconPlay, IconCheckCircle, IconArrowDown, IconArrowUp, IconBook, IconList, IconLaptop, IconCall, IconPlane, IconTime } from '../../../../components/Icons';
import * as css from './Playlist.scss';

class Playlist extends Component {
  constructor (props) {
    super(props);
    this.state = {
      isPlaylistOpen: false,
      times: {
        item1: 0.25,
        item2: 5,
        item3: 0
      }
    };
  }

  componentDidMount () {
    ReactTooltip.rebuild();
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  handleClickOutside = () => {
    this.setState({isPlaylistOpen: false});
  };

  handleToggleList = () => {
    this.setState({isPlaylistOpen: !this.state.isPlaylistOpen});
  }

  handleShowOther = () => {
    this.setState({isNotMineTasksShow: !this.state.isNotMineTasksShow});
  }

  handleChangeItem = (name, e) => {
    this.setState({times: {...this.state.times, [name]: e.target.value}});
  }

  render () {
    const { isPlaylistOpen, isNotMineTasksShow } = this.state;
    const tasks
    = <div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={css.actionButton}>
            <IconPause style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                <span>ST-48</span>
                <span>ПроРейтинг - HR-инструмент</span>
                <span>Develop</span>
              </div>
              <div className={css.taskName}>
                UI: Страница задачи. Не хватает кнопки Создания задачи со страницы задачи
              </div>
            </div>
          </div>
          <div className={css.time}>
            <div className={css.today}>
              <input key="item1" type="text" onChange={(e) => this.handleChangeItem('item1', e)} value={this.state.times.item1}/>
            </div>
            <div className={css.other}>
              <span data-tip="Потрачено" data-place="bottom">52</span> / <span data-tip="Запланировано" data-place="bottom">14</span>
            </div>
          </div>
        </div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={css.actionButton}>
            <IconPlay style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                <span>ST-48</span>
                <span>SimTrack</span>
                <span>Develop</span>
              </div>
              <div className={css.taskName}>
                UI: Добавить смену приоритета
              </div>
            </div>
          </div>
          <div className={css.time}>
            <div className={css.today}>
              <input key="item2" type="text" onChange={(e) => this.handleChangeItem('item2', e)} value={this.state.times.item2}/>
            </div>
            <div className={css.other}>
              <span data-tip="Потрачено" data-place="bottom">52</span> / <span data-tip="Запланировано" data-place="bottom">14</span>
            </div>
          </div>
        </div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={css.actionButton}>
            <IconPlay style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                <span>ST-3214</span>
                <span>SimTrack</span>
                <span>Develop</span>
              </div>
              <div className={css.taskName}>
                UI: Список Проектов. Фильтрация по тэгам
              </div>
            </div>
          </div>
          <div className={css.time}>
            <div className={css.today}>
              <input key="item3" type="text" onChange={(e) => this.handleChangeItem('item3', e)} value={this.state.times.item3}/>
            </div>
            <div className={css.other}>
              <span data-tip="Потрачено" data-place="bottom">52</span> / <span data-tip="Запланировано" data-place="bottom">14</span>
            </div>
          </div>
        </div>
      </div>;

    const notMineTasks
    = <div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={classnames(css.actionButton, css.locked)}>
            <IconCheckCircle style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                <span>QiwA-3214</span>
                <span>Киви-Банк - Артек</span>
                <span>QA</span>
              </div>
              <div className={css.taskName}>
                Игровой клиент: таблица результатов
              </div>
            </div>
          </div>
          <div className={css.time}>
            <div className={css.today}>
              <input key="item3" type="text" onChange={(e) => this.handleChangeItem('item3', e)} value={this.state.times.item3}/>
            </div>
            <div className={css.other}>
              <span data-tip="Потрачено" data-place="bottom">0</span> / <span data-tip="Запланировано" data-place="bottom">0</span>
            </div>
          </div>
        </div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={classnames(css.actionButton, css.locked)}>
            <IconCheckCircle style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                <span>ST-3214</span>
                <span>SimTrack</span>
                <span>QA</span>
              </div>
              <div className={css.taskName}>
                При переводе между членами семьи в списке отображаться роль
              </div>
            </div>
          </div>
          <div className={css.time}>
            <div className={css.today}>
              <input key="item3" type="text" onChange={(e) => this.handleChangeItem('item3', e)} value={this.state.times.item3}/>
            </div>
            <div className={css.other}>
              <span data-tip="Потрачено" data-place="bottom">0</span> / <span data-tip="Запланировано" data-place="bottom">0</span>
            </div>
          </div>
        </div>
      </div>;

    return (
      <div className={css.playlistWrapper}>
        <div className={classnames(css.displayTask, css.task)} onClick={this.handleToggleList}>
          <div className={css.actionButton}>
            <IconPause style={{width: '1.5rem', height: '1.5rem'}}/>
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.meta}>
                Активная задача: ST-48
              </div>
              <div className={css.taskName}>
                UI: Страница задачи. Не хватает кнопки Создания задачи со страницы задачи
              </div>
            </div>
          </div>
        </div>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            isPlaylistOpen
            ? <div className={css.list}>
                <div className={css.week}>
                  <div className={css.day}>Пн <span className={css.countBadge}>1</span></div>
                  <div className={classnames(css.day, css.active)}>Вт <span className={css.countBadge}>65</span></div>
                  <div className={css.day}>Ср</div>
                  <div className={css.day}>Чт</div>
                  <div className={css.day}>Пт</div>
                  <div className={css.day}>Сб</div>
                  <div className={css.day}>Вс</div>
                </div>
                <div className={css.taskWrapper}>
                  {tasks}
                  {
                    isNotMineTasksShow
                    ? notMineTasks
                    : null
                  }
                  <div
                    className={css.showMore}
                    onClick={this.handleShowOther}
                    data-tip={!isNotMineTasksShow ? 'Показать переведенные' : 'Скрыть переведенные'}
                    data-place="bottom">
                    {
                      !isNotMineTasksShow
                      ? <IconArrowDown/>
                      : <IconArrowUp/>
                    }
                  </div>
                </div>
                <div className={css.activity}>
                  <div className={classnames(css.type, css.active)} data-tip="Все активности" data-place="bottom">
                    <IconList/>
                  </div>
                  <div className={css.type} data-tip="Работа" data-place="bottom">
                    <IconLaptop/>
                  </div>
                  <div className={css.type} data-tip="Совещание" data-place="bottom">
                    <IconCall/>
                  </div>
                  <div className={css.type} data-tip="Оценка" data-place="bottom">
                    <IconTime/>
                  </div>
                  <div className={css.type} data-tip="Обучение" data-place="bottom">
                    <IconBook/>
                  </div>
                  <div className={css.type} data-tip="Отпуск" data-place="bottom">
                    <IconPlane/>
                  </div>
                  <div className={css.time}>
                    <div className={css.today}>
                      <input type="text" value={7.25} data-tip="Итого"/>
                    </div>
                  </div>
                </div>
            </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default onClickOutside(Playlist);
