import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from '../Playlist.scss';

import PlaylistItem from '../PlaylistItem';

// Mocks

const items = [
  {
    id: 3,
    name: 'Оценка',
    status: 'estimate',
    project: 'Прочее',
    comment: '',
    time: 0.25,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 1,
    name: 'Оценка',
    status: 'estimate',
    project: 'SimTrack',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 16
  },
  {
    id: 2,
    name: 'Оценка',
    status: 'estimate',
    project: 'ПроРейтинг - HR-инструмент',
    comment: '',
    time: 0,
    type: 'magicActivity',
    factTime: 59
  }
];
export default class Estimate extends Component {
  render () {
    const list = items.map(item => <PlaylistItem key={item.id} item={item}/>);
    return (
      <div className={css.work}>
        {list}
      </div>
    );
  }
}
