import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';

import { IconArrowDown, IconArrowUp } from '../../../../../components/Icons';

import PlaylistItem from '../PlaylistItem';
import * as css from '../Playlist.scss';

class List extends Component {
  static propTypes = {
    handleToggleList: PropTypes.func,
    tracks: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      isDraftShow: false,
      colorCurrent: '#5cb85c'
    };
  }

  handleShowOther = () => {
    this.setState({ isDraftShow: !this.state.isDraftShow }, () => ReactTooltip.rebuild());
  };

  playlistItem = (item, i) => {
    const pathArr = window.location.pathname.split('/');
    let thisPageCurrentTask = '';
    if (item.task.taskStatus.id === 2) {
      if (parseInt(pathArr[2]) === item.project.id && parseInt(pathArr[4]) === item.task.id) {
        thisPageCurrentTask = true;
      } else {
        thisPageCurrentTask = '';
      }
    } else if (
      parseInt(pathArr[2]) === this.props.tracks[i].project.id &&
      parseInt(pathArr[4]) === this.props.tracks[i].task.id
    ) {
      thisPageCurrentTask = true;
    } else {
      thisPageCurrentTask = '';
    }
    return (
      <PlaylistItem
        item={item}
        index={i}
        key={`${item.id}${item.isDraft ? '-draft' : ''}`}
        visible
        changeVisibility={this.changeVisibility}
        handleToggleList={this.props.handleToggleList}
        thisPageCurrentTask={thisPageCurrentTask}
      />
    );
  };

  render() {
    const { isDraftShow } = this.state;
    const { tracks } = this.props;
    const current = tracks
      ? tracks.filter(item => item.isVisible && item.task.taskStatus.id === 2).map(this.playlistItem)
      : null;
    const visible = tracks
      ? tracks.filter(item => item.isVisible && item.task.taskStatus.id !== 2).map(this.playlistItem)
      : null;

    const invisible = tracks ? tracks.filter(item => !item.isVisible).map(this.playlistItem) : null;

    return (
      <div>
        {current}
        {visible}
        {invisible && invisible.length > 0 ? (
          <div
            className={css.showMore}
            onClick={this.handleShowOther}
            data-tip={!isDraftShow ? 'Показать скрытые' : 'Скрыть'}
            data-place="bottom"
          >
            {!isDraftShow && invisible ? <IconArrowDown /> : <IconArrowUp />}
          </div>
        ) : null}
        {isDraftShow ? invisible : null}
      </div>
    );
  }
}

export default List;
