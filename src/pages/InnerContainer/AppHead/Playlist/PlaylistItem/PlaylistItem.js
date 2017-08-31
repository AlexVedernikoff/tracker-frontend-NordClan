import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  updateTimesheet
} from '../../../../../actions/TimesheetPlayer';
import _ from 'lodash';
import * as css from '../Playlist.scss';
import * as TimesheetTypes from '../../../../../constants/TimesheetTypes';

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
  IconOrganization,
  IconCase,
  IconHospital,
  IconCheckList,
  IconEye,
  IconEyeDisable
} from '../../../../../components/Icons';


const getActivityButtonStyle = {width: '1.5rem', height: '1.5rem'};

const getActivityButton = (activityType) => {
  switch (activityType) {
  default:
    return <IconCheckCircle style={getActivityButtonStyle}/>;
  case TimesheetTypes.IMPLEMENTATION:
    return <IconLaptop style={getActivityButtonStyle}/>;
  case TimesheetTypes.MEETING:
    return <IconCall style={getActivityButtonStyle}/>;
  case TimesheetTypes.EDUCATION:
    return <IconBook style={getActivityButtonStyle}/>;
  case TimesheetTypes.VACATION:
    return <IconPlane style={getActivityButtonStyle}/>;
  case TimesheetTypes.BUSINESS_TRIP:
    return <IconCase style={getActivityButtonStyle}/>;
  case TimesheetTypes.HOSPITAL:
    return <IconHospital style={getActivityButtonStyle}/>;
  }
  // case 'inprogress':
  //   return <IconPause style={{width: '1.5rem', height: '1.5rem'}}/>;
  // case 'inhold':
  //   return <IconPlay style={{width: '1.5rem', height: '1.5rem'}}/>;
  // case 'delegated':
  //   return <IconCheckCircle style={{width: '1.5rem', height: '1.5rem'}}/>;
  // case 'work':
  //   return <IconLaptop style={{width: '1.5rem', height: '1.5rem'}}/>;
  // case 'control':
  //   return <IconOrganization style={{width: '1.5rem', height: '1.5rem'}}/>;
  // case 'presale':
  //   return <IconCheckList style={{width: '1.5rem', height: '1.5rem'}}/>;
};


class PlaylistItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isCommentOpen: false
    };
    this.debounceUpdateTimesheet = _.debounce(this.props.updateTimesheet, 500);
  }

  toggleComment = () => {
    this.setState({isCommentOpen: !this.state.isCommentOpen});
  };

  pushComment = (comment) => {
    return () => {
      this.props.updateTimesheet({
        taskId: this.props.item.task.id,
        timesheetId: this.props.item.id,
        body: {
          comment
        }
      });
    };
  };

  handleChangeTime = (e) => {
    const value = e.target.value;

    this.debounceUpdateTimesheet({
      taskId: this.props.item.task.id,
      timesheetId: this.props.item.id,
      body: {
        spentTime: value
      }
    });
  };

  handleChangeComment = (e) => {
    this.setState({comment: e.target.value});
  };

  render () {
    const {
      task,
      prefix,
      project,
      factTime,
      plannedTime,
      spentTime,
      comment,
      type,
      taskStatus: prevStatus
    } = this.props.item;
    const status = this.props.item.task.taskStatus;

    return (
      <div className={classnames(css.listTask, css.task)}>
        <div className={classnames({
          [css.actionButton]: true,
          [css.locked]: this.props.item.status !== 'inhold' && this.props.item.status !== 'inprogress'
        })}>
          {getActivityButton(this.props.item.typeId)}
        </div>
        <div className={css.taskNameWrapper}>
          <div className={css.taskTitle}>
            <div className={css.meta}>
              { task.prefix ? <span>{prefix}</span> : null}
              { project ? <span>{project.name}</span> : null}
              { status
                ? <span>
                    {
                      prevStatus
                        ? (<span>{prevStatus.name}<span style={{display: 'inline-block', margin: '0 0.25rem'}}> → </span></span>)
                        : null
                    }
                  {status.name}
                  </span>
                : null}
              <span className={classnames({[css.commentToggler]: true, [css.green]: !!comment})} onClick={this.toggleComment}><IconComment/></span>
              { status !== 'education'
                ? (this.props.visible
                  ? <span className={css.visibleToggler} onClick={this.toggleComment} data-tip="Скрыть"><IconEyeDisable/></span>
                  : <span className={css.visibleToggler} data-tip="Показать"><IconEye/></span>)
                : null
              }
            </div>
            <div className={css.taskName}>
              {task.name}
            </div>
          </div>
        </div>
        <div className={css.time}>
          <div className={css.today}>
            <input type="text" onChange={this.handleChangeTime} defaultValue={spentTime}/>
          </div>
          <div className={classnames({[css.other]: true, [css.exceeded]: factTime > plannedTime})}>
            <span data-tip="Всего потрачено" data-place="bottom">{task.factExecutionTime}</span>
            {
              type !== 'magicActivity'
                ? <span> / <span data-tip="Запланировано" data-place="bottom">{task.plannedExecutionTime}</span></span>
                : null
            }
          </div>
        </div>
        {
          this.state.isCommentOpen
            ? <div className={css.comment}>
              <textarea autoFocus onChange={this.handleChangeComment} defaultValue={comment} value={this.state.comment} placeholder="Введите текст комментария"/>
              <div className={css.actionButton} onClick={this.pushComment(this.state.comment)}>
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
  item: PropTypes.object.isRequired,
  updateTimesheet: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    tracks: state.TimesheetPlayer.tracks
  };
};

const mapDispatchToProps = {
  updateTimesheet
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);
