import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  IconPause,
  IconPlay,
  IconCheckCircle,
  IconArrowDown,
  IconArrowUp
} from '../../../../../components/Icons';

import * as css from '../Playlist.scss';

export default class All extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isNotMineTasksShow: false,
      times: {
        item1: 0.25,
        item2: 5,
        item3: 0
      }
    };
  }

  handleShowOther = () => {
    this.setState({isNotMineTasksShow: !this.state.isNotMineTasksShow});
  }

  handleChangeItem = (name, e) => {
    this.setState({times: {...this.state.times, [name]: e.target.value}});
  }

  render () {
    const { isNotMineTasksShow } = this.state;
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
      <div>
        <div>
            {tasks}
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
            {
              isNotMineTasksShow
              ? notMineTasks
              : null
            }
          </div>
      </div>
    );
  }
}
