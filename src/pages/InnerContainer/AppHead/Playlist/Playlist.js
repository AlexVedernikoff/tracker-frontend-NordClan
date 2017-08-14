import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { IconPause } from '../../../../components/Icons';
import * as css from './Playlist.scss';

export default class Playlist extends Component {
  render () {
    return (
      <div className={css.playlistWrapper}>
        <div className={classnames(css.displayTask, css.task)}>
          <div className={css.actionButton}>
            <IconPause style={{width: '1.5rem', height: '1.5rem'}} />
          </div>
          <div className={css.taskNameWrapper}>
            <div className={css.taskSubtitle}>
              Активная задача
            </div>
            <div className={css.taskName}>
              UI: Страница задачи. Не хватает кнопки Создания задачи со страницы задачи
            </div>
          </div>
        </div>
      </div>
    );
  }
}
