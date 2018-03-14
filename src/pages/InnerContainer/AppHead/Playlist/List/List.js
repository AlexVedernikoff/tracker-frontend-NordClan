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
      colorCurrent: '#5cb85c',
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
    const pathArr = window.location.pathname.split('/');
    let thisPageCurrentTask = false;
    console.log(item);
    if (parseInt(pathArr[2]) === item.projectId && parseInt(pathArr[4]) === item.task.id) {
      thisPageCurrentTask = true;
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
        disabled={this.state.areTracksDisabled}
      />
    );
  };

  render() {
    const { isDraftShow } = this.state;
    const { tracks } = this.props;
    const current =
      tracks && tracks.filter(item => item.isVisible && item.task.taskStatus.id === 2).map(this.playlistItem);
    const visible =
      tracks && tracks.filter(item => item.isVisible && item.task.taskStatus.id !== 2).map(this.playlistItem);

    const invisible = tracks && tracks.filter(item => !item.isVisible).map(this.playlistItem);

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
