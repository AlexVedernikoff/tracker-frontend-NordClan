import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import * as css from '../Playlist.scss';

import {
  IconPause,
  IconPlay,
  IconCheckCircle,
  IconComment,
  IconCheck,
  IconBook,
  IconLaptop,
  IconCall,
  IconPlane,
  IconTime,
  IconCase,
  IconHospital,
  IconPresentation
} from '../../../../../components/Icons';

export default class PlaylistItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      time: 0.25,
      isCommentOpen: false
    };
  }

  toggleComment = () => {
    this.setState({isCommentOpen: !this.state.isCommentOpen});
  }

  handleChangeTime = (e) => {
    this.setState({time: e.target.value});
  }

  handleChangeComment = (e) => {
    this.setState({comment: e.target.value});
  }

  getActionButton = () => {
    switch (this.props.item.status) {
    default:
      return <IconCheckCircle style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'inprogress':
      return <IconPause style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'inhold':
      return <IconPlay style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'delegated':
      return <IconCheckCircle style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'work':
      return <IconLaptop style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'meeting':
      return <IconCall style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'estimate':
      return <IconTime style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'education':
      return <IconBook style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'vacation':
      return <IconPlane style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'trip':
      return <IconCase style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'hospital':
      return <IconHospital style={{width: '1.5rem', height: '1.5rem'}}/>;
    case 'presale':
      return <IconPresentation style={{width: '1.5rem', height: '1.5rem'}}/>;
    }
  }

  render () {
    const {
      name,
      prefix,
      project,
      stage,
      factTime,
      plannedTime,
      time,
      comment,
      type
    } = this.props.item;

    return (
      <div className={classnames(css.listTask, css.task)}>
        <div className={classnames({
          [css.actionButton]: true,
          [css.locked]: this.props.item.status !== 'inhold' && this.props.item.status !== 'inprogress'
        })}>
          {this.getActionButton()}
        </div>
        <div className={css.taskNameWrapper}>
          <div className={css.taskTitle}>
            <div className={css.meta}>
              { prefix ? <span>{prefix}</span> : null}
              { project ? <span>{project}</span> : null}
              { stage ? <span>{stage}</span> : null}
              <span className={classnames({[css.commentToggler]: true, [css.green]: comment})} onClick={this.toggleComment}><IconComment/></span>
            </div>
            <div className={css.taskName}>
              {name}
            </div>
          </div>
        </div>
        <div className={css.time}>
          <div className={css.today}>
            <input type="text" onChange={this.handleChangeTime} defaultValue={time}/>
          </div>
          <div className={css.other}>
            <span data-tip="Всего потрачено" data-place="bottom">{factTime}</span>
            {
              type !== 'magicActivity'
              ? <span> / <span data-tip="Запланировано" data-place="bottom">{plannedTime}</span></span>
              : null
            }
          </div>
        </div>
        {
          this.state.isCommentOpen
          ? <div className={css.comment}>
            <textarea autoFocus onChange={this.handleChangeComment} defaultValue={comment} value={this.state.comment} placeholder="Введите текст комментария"/>
            <div className={css.actionButton} onClick={this.toggleComment}>
              <IconCheck style={{width: '1.5rem', height: '1.5rem'}} />
            </div>
          </div>
          : null
        }
      </div>
    );
  }
}

PlaylistItem.propTypes = {
  item: PropTypes.object
};
