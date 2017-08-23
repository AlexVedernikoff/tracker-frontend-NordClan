import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from '../Playlist.scss';
import { IconArrowDown } from '../../../../../components/Icons';

import PlaylistItem from '../PlaylistItem';

// Mocks

const items = [
  {
    id: 1,
    name: 'Совещание',
    status: 'meeting',
    project: 'Прочее',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 3,
    name: 'Совещание',
    status: 'meeting',
    project: 'SimTrack',
    comment: '',
    time: 0.25,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 2,
    name: 'Совещание',
    status: 'meeting',
    project: 'ПроРейтинг - HR-инструмент',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 59
  }
];
export default class Meeting extends Component {
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
