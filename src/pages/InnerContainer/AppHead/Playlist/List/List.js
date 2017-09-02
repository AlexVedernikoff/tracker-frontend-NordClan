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


class List extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isDraftShow: false
    };
  }

  handleShowOther = () => {
    this.setState({isDraftShow: !this.state.isDraftShow}, () => ReactTooltip.rebuild());
  };

  playlistItem = (item, i) => {
    return <PlaylistItem item={item} index={i} key={`visible-${item.id}`} visible changeVisibility={this.changeVisibility}/>
  };


  render () {
    const {
      isDraftShow
    } = this.state;

    const {
      tracks
    } = this.props;


    const visible = tracks
      ? tracks.filter(item => item.isVisible === true).map(this.playlistItem)
      : null;

    const invisible = tracks
      ? tracks.filter(item => item.isVisible === false).map(this.playlistItem)
      : null;

    return (
      <div>
        <div>
          {visible}
          {
            invisible && invisible.length > 0
            ? <div
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
              : null
          }
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

List.propTypes = {
  tracks: PropTypes.array
};

export default List;
