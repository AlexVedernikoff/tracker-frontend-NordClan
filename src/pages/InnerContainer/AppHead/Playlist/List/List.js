import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import * as timesheetsConstants from '../../../../../constants/Timesheets';

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
      areTracksDisabled: this.checkIfshouldBeDisabled(this.props.tracks)
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      areTracksDisabled: this.checkIfshouldBeDisabled(nextProps.tracks)
    });
  }

  handleShowOther = () => {
    this.setState({ isDraftShow: !this.state.isDraftShow }, () => ReactTooltip.rebuild());
  };

  checkIfshouldBeDisabled = tracks => {
    return !!tracks.find(
      track =>
        track.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
        track.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED
    );
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
        disabled={this.state.areTracksDisabled}
      />
    );
  };

  render() {
    const { isDraftShow } = this.state;
    const { tracks } = this.props;

    const visible = tracks ? tracks.filter(item => item.isVisible).map(this.playlistItem) : null;

    const invisible = tracks ? tracks.filter(item => !item.isVisible).map(this.playlistItem) : null;

    return (
      <div>
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
