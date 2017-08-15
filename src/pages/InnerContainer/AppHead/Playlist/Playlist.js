import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import onClickOutside from 'react-onclickoutside';

import { IconPause, IconPlay } from '../../../../components/Icons';
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

  handleClickOutside = () => {
    this.setState({isPlaylistOpen: false});
  };

  handleToggleList = () => {
    this.setState({isPlaylistOpen: !this.state.isPlaylistOpen});
  }

  handleChangeItem = (name, e) => {
    this.setState({times: {...this.state.times, [name]: e.target.value}});
    console.log(this.state);
  }

  render () {
    const { isPlaylistOpen } = this.state;
    const tasks
    = <div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={css.actionButton}>
            <IconPause style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.taskSubtitle}>
                ST-48
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
              <span data-tip="Всего" data-place="bottom">52</span>
              <span data-tip="За эту неделю" data-place="bottom">14</span>
            </div>
          </div>
        </div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={css.actionButton}>
            <IconPlay style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.taskSubtitle}>
                ST-60
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
              <span data-tip="Всего" data-place="bottom">52</span>
              <span data-tip="За эту неделю" data-place="bottom">14</span>
            </div>
          </div>
        </div>
        <div className={classnames(css.listTask, css.task)}>
          <div className={css.actionButton}>
            <IconPlay style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskTitle}>
              <div className={css.taskSubtitle}>
                ST-3214
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
              <span data-tip="Всего" data-place="bottom">52</span>
              <span data-tip="За эту неделю" data-place="bottom">14</span>
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
              <div className={css.taskSubtitle}>
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
                  <div className={css.day}>Пн</div>
                  <div className={classnames(css.day, css.active)}>Вт</div>
                  <div className={css.day}>Ср</div>
                  <div className={css.day}>Чт</div>
                  <div className={css.day}>Пт</div>
                  <div className={css.day}>Сб</div>
                  <div className={css.day}>Вс</div>
                </div>
                {tasks}
            </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default onClickOutside(Playlist);
