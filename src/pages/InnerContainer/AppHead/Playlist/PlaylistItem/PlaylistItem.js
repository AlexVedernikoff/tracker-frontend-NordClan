import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  updateTimesheet, updateTimesheetDraft
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
  case TimesheetTypes.CONTROL:
    return <IconOrganization style={{width: '1.5rem', height: '1.5rem'}}/>;
  case TimesheetTypes.PRESALE:
    return <IconCheckList style={{width: '1.5rem', height: '1.5rem'}}/>;
  }
};


class PlaylistItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isCommentOpen: false
    };
    this.debounceUpdateTimesheet = _.debounce(this.props.updateTimesheet, 500);
    this.debounceUpdateTimesheetDraft = _.debounce(this.props.updateTimesheetDraft, 500);
  }

  toggleComment = () => {
    this.setState({isCommentOpen: !this.state.isCommentOpen});
  };

  pushComment = (comment) => {
    return () => {
      this.props.updateTimesheet({
        taskId: this.props.item.task ? this.props.item.task.id : null,
        timesheetId: this.props.item.id,
        body: {
          comment
        }
      }, {
        isDraft: this.props.item.isDraft,
        onDate: this.props.item.onDate,
        itemKey: this.props.index
      });
    };
  };

  handleChangeTime = (e) => {
    const value = e.target.value;

    this.debounceUpdateTimesheet({
      taskId: (this.props.item.task) ? this.props.item.task.id : null,
      timesheetId: this.props.item.id,
      body: {
        spentTime: value.replace(',', '.')
      }
    }, {
      isDraft: this.props.item.isDraft,
      onDate: this.props.item.onDate,
      itemKey: this.props.index
    });
  };

  handleChangeComment = (e) => {
    this.setState({comment: e.target.value});
  };

  changeVisibility = (visibility) => {
    return () => {
      this.props.updateTimesheet({
        taskId: this.props.item.task ? this.props.item.task.id : null,
        timesheetId: this.props.item.id,
        body: {
          isVisible: !!visibility
        }
      }, {
        isDraft: this.props.item.isDraft,
        onDate: this.props.item.onDate,
        itemKey: this.props.index
      });
    };
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
      typeId,
      taskStatus: prevStatus,
      isDraft
    } = this.props.item;
    const status = this.props.item.task ? this.props.item.task.taskStatus : null;


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
              { task && task.prefix ? <span>{prefix}</span> : null}
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
              {
                !isDraft
                ? <span className={classnames({[css.commentToggler]: true, [css.green]: !!comment})} onClick={this.toggleComment}><IconComment/></span>
                : null
              }

              { status !== 'education'
                ? (this.props.item.isVisible
                  ? <span className={css.visibleToggler} onClick={this.changeVisibility(false)} data-tip="Скрыть"><IconEyeDisable/></span>
                  : <span className={css.visibleToggler} onClick={this.changeVisibility(true)} data-tip="Показать"><IconEye/></span>)
                : null
              }
            </div>
            <div className={css.taskName}>
              {task ? task.name : null}
              {
                (() => {
                  switch (typeId) {
                    case 2: return 'Больничный';
                    case 3: return 'Командировка';
                    case 4: return 'Отпуск';
                    case 5: return 'Совещание';
                    case 6: return 'Обучение';
                    case 7: return 'Управление';
                    case 8: return 'Преселлинг и оценка';
                    default: return '';
                  }
                })()
              }
            </div>
          </div>
        </div>
        <div className={css.time}>
          <div className={css.today}>
            <input type="text" onChange={this.handleChangeTime} defaultValue={spentTime}/>
          </div>
          <div className={classnames({[css.other]: true, [css.exceeded]: factTime > plannedTime})}>
            <span data-tip="Всего потрачено" data-place="bottom">{task ? task.factExecutionTime : null}</span>
            {
              task
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
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  updateTimesheet: PropTypes.func.isRequired,
  updateTimesheetDraft: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    tracks: state.TimesheetPlayer.tracks
  };
};

const mapDispatchToProps = {
  updateTimesheet,
  updateTimesheetDraft
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);
