import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { TASK_STATUS_DEVELOP_PLAY } from '../../../../../constants/Task';
import { IconArrowDown, IconArrowUp } from '../../../../../components/Icons';
import PlaylistItem from '../PlaylistItem';
import * as css from '../Playlist.scss';

class List extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    handleToggleList: PropTypes.func,
    textHide: PropTypes.string,
    textInfo: PropTypes.string,
    textShowHidden: PropTypes.string,
    tracks: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      isDraftShow: false
    };
  }

  handleShowOther = () => {
    this.setState({ isDraftShow: !this.state.isDraftShow }, () => ReactTooltip.rebuild());
  };

  playlistItem = (item, i) => {
    return (
      <PlaylistItem
        item={item}
        index={i}
        key={`${item.id}${item.isDraft ? '-draft' : ''}`}
        visible
        changeVisibility={this.changeVisibility}
        handleToggleList={this.props.handleToggleList}
        disabled={this.props.disabled}
      />
    );
  };

  shouldShowEmpty = invisible => {
    const { isDraftShow } = this.state;
    if (isDraftShow) {
      return !(invisible && invisible.length);
    }

    return true;
  };

  render() {
    const { isDraftShow } = this.state;
    const { tracks, textInfo, textShowHidden, textHide } = this.props;
    tracks.sort((track1, track2) => {
      if (track1.typeId < track2.typeId) {
        return 1;
      }
      if (track1.typeId > track2.typeId) {
        return -1;
      }
      return 0;
    });

    const visible = [
      ...tracks.filter(
        item => item.isVisible && item.task && item.taskStatus && item.taskStatus.id === TASK_STATUS_DEVELOP_PLAY
      ),
      ...tracks.filter(
        item => item.isVisible && (!item.task || (item.taskStatus && item.taskStatus.id !== TASK_STATUS_DEVELOP_PLAY))
      )
    ].map(this.playlistItem);

    const invisible = tracks && tracks.filter(item => !item.isVisible).map(this.playlistItem);
    const nothingToShow = <div className={cn(['text-info', css.nothingToShow])}>{textInfo}</div>;
    const shouldShowEmpty = this.shouldShowEmpty(invisible);
    return (
      <div>
        {visible.length ? visible : shouldShowEmpty && nothingToShow}
        {invisible && invisible.length > 0 ? (
          <div
            className={css.showMore}
            onClick={this.handleShowOther}
            data-tip={!isDraftShow ? textShowHidden : textHide}
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
