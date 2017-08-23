import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from '../Playlist.scss';

import PlaylistItem from '../PlaylistItem';
import { IconArrowDown, IconArrowUp } from '../../../../../components/Icons';

// Mocks

const items = [
  {
    id: 3,
    name: 'Отпуск',
    status: 'vacation',
    project: 'Прочее',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 1,
    name: 'Отпуск',
    status: 'vacation',
    project: 'SimTrack',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 2,
    name: 'Отпуск',
    status: 'vacation',
    project: 'ПроРейтинг - HR-инструмент',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 59
  }
];

const hiddenProjects = [
  {
    id: 1,
    name: 'Отпуск',
    status: 'vacation',
    project: 'MakeTalents',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 2,
    name: 'Отпуск',
    status: 'vacation',
    project: 'Qiwi Way',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 3,
    name: 'Отпуск',
    status: 'vacation',
    project: 'Estimate Me',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 4,
    name: 'Отпуск',
    status: 'vacation',
    project: 'Meet App',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 5,
    name: 'Отпуск',
    status: 'vacation',
    project: 'Gift Club',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 6,
    name: 'Отпуск',
    status: 'vacation',
    project: 'Яркая Жизнь - Админка',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 59
  }
];
export default class Vacation extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isHiddenItemsShow: false
    };
  }

  handleShowOther = () => {
    ReactTooltip.rebuild();
    this.setState({isHiddenItemsShow: !this.state.isHiddenItemsShow}, () => ReactTooltip.rebuild());
  }

  render () {
    const list = items.map(item => <PlaylistItem key={item.id} item={item} visible/>);
    const hiddenItems = hiddenProjects.map(item => <PlaylistItem key={item.id} item={item}/>);
    return (
      <div className={css.work}>
        {list}
        <div
          className={css.showMore}
          onClick={this.handleShowOther}
          data-tip={!this.state.isHiddenItemsShow ? 'Показать скрытые' : 'Скрыть'}
          data-place="bottom">
          {
            !this.state.isHiddenItemsShow
            ? <IconArrowDown/>
            : <IconArrowUp/>
          }
        </div>
        {
          this.state.isHiddenItemsShow
          ? hiddenItems
          : null
        }
      </div>
    );
  }
}
