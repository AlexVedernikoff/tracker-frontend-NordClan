import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import {
  IconArrowDown,
  IconArrowUp
} from '../../../../../components/Icons';

import PlaylistItem from '../PlaylistItem';
import * as css from '../Playlist.scss';


class All extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isDraftShow: false
    };
  }

  handleShowOther = () => {
    this.setState({isNotMineTasksShow: !this.state.isNotMineTasksShow}, () => ReactTooltip.rebuild());
  };

  render () {
    const {
      isDraftShow,
      tracks
    } = this.state;

    const visible = tracks.visible
      ? tracks.visible.map(item => <PlaylistItem item={item} key={item.id} visible/>)
      : null;

    const invisible = tracks.invisible
      ? tracks.invisible.map(item => <PlaylistItem item={item} key={item.id}/>)
      : null;


    return (
      <div>
        <div>
          {visible}
          <div
            className={css.showMore}
            onClick={this.handleShowOther}
            data-tip={!isDraftShow ? 'Показать скрытые' : 'Скрыть'}
            data-place="bottom">
            {
              !isDraftShow && invisible
              ? <IconArrowDown/>
              : <IconArrowUp/>
            }
          </div>
          {
            isDraftShow
            ? invisible
            : null
          }
        </div>
      </div>
    );
  }
}

All.propTypes = {
  tracks: PropTypes.object,
  // draftsheets: PropTypes.array,
  // timesheets: PropTypes.array
};

export default All;
