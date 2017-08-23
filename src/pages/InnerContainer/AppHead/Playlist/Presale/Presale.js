import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from '../Playlist.scss';
import { IconArrowDown } from '../../../../../components/Icons';

import PlaylistItem from '../PlaylistItem';

// Mocks

const items = [
  {
    id: 3,
    name: 'Presale',
    status: 'presale',
    project: 'Прочее',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 1,
    name: 'Presale',
    status: 'presale',
    project: 'SimTrack',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 2,
    name: 'Presale',
    status: 'presale',
    project: 'ПроРейтинг - HR-инструмент',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 59
  }
];
export default class Presale extends Component {
  render () {
    const list = items.map(item => <PlaylistItem key={item.id} item={item} visible/>);
    return (
      <div className={css.work}>
        {list}
        <div
          className={css.showMore}
          data-tip='Показать скрытые'
          data-place="bottom">
          <IconArrowDown/>
        </div>
      </div>
    );
  }
}
