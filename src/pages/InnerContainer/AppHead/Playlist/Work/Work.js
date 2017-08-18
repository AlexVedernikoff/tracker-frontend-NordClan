import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  IconArrowDown,
  IconArrowUp
} from '../../../../../components/Icons';

import * as css from '../Playlist.scss';

import PlaylistItem from '../PlaylistItem';

// Mocks

const items = [
  {
    id: 1,
    name: 'UI: Страница задачи. Не хватает кнопки Создания задачи со страницы задачи',
    status: 'inprogress',
    prefix: 'ST-48',
    project: 'ПроРейтинг - HR-инструмент',
    stage: 'Develop',
    comment: 'Реализация функционала для того, чтобы клиент думал, как будто он не просто так деньги платит',
    time: 0.25,
    plannedTime: 14,
    factTime: 16
  },
  {
    id: 2,
    name: 'Анимированные прелоадеры для аплоада и удаления',
    status: 'inhold',
    prefix: 'ST-32',
    project: 'SimTrack',
    stage: 'Develop',
    comment: '',
    time: 5,
    plannedTime: 5,
    factTime: 3
  },
  {
    id: 3,
    name: 'UI: Реализовать форму ввода таймшитов',
    status: 'inprogress',
    prefix: 'ST-48',
    project: 'SimTrack',
    stage: 'Develop',
    comment: '',
    time: 1,
    plannedTime: 3,
    factTime: 1
  }
];

const notMineItems = [
  {
    id: 2,
    name: 'Анимированные прелоадеры для аплоада и удаления',
    status: 'delegated',
    prefix: 'ST-32',
    project: 'SimTrack',
    stage: 'QA',
    comment: '',
    time: 5,
    plannedTime: 5,
    factTime: 3
  },
  {
    id: 3,
    name: 'UI: Реализовать форму ввода таймшитов',
    status: 'delegated',
    prefix: 'ST-48',
    project: 'SimTrack',
    stage: 'QA',
    comment: '',
    time: 1,
    plannedTime: 3,
    factTime: 1
  }
];
export default class Work extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isNotMineTasksShow: false
    };
  }

  handleShowOther = () => {
    this.setState({isNotMineTasksShow: !this.state.isNotMineTasksShow});
  }

  render () {
    const { isNotMineTasksShow } = this.state;
    const tasks = items.map(item => <PlaylistItem item={item} key={item.id}/>);
    const notMineTasks = notMineItems.map(item => <PlaylistItem item={item} key={item.id}/>);
    return (
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
    );
  }
}
