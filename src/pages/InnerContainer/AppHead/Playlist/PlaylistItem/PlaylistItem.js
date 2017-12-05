import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import {
  updateTimesheet,
  updateTimesheetDraft,
  updateDraft,
  updateOnlyTimesheet
} from '../../../../../actions/TimesheetPlayer';
import _ from 'lodash';
import * as css from '../Playlist.scss';
import getMaIcon from '../../../../../constants/MagicActivityIcons';
import roundNum from '../../../../../utils/roundNum';

import {
  IconComment,
  IconCheck,
  IconEye,
  IconEyeDisable
} from '../../../../../components/Icons';

class PlaylistItem extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isCommentOpen: false
    };
    this.debounceUpdateTimesheet = _.debounce(this.props.updateTimesheet, 500);
    //this.debounceUpdateTimesheetDraft = _.debounce(this.props.updateTimesheetDraft, 500);
    this.debouncedUpdateDraft = _.debounce(this.props.updateDraft, 500);
    this.debouncedUpdateOnlyTimesheet = _.debounce(this.props.updateOnlyTimesheet, 500);
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
    if (this.props.item.isDraft) {
      this.debouncedUpdateDraft(
        {
          sheetId: this.props.item.id,
          spentTime: value.replace(',', '.'),
          isVisible: this.props.item.isVisible,
          return: 'trackList'
        },
        {
          onDate: this.props.item.onDate
        }
      );
    } else {
      this.debouncedUpdateOnlyTimesheet(
        {
          sheetId: this.props.item.id,
          spentTime: value.replace(',', '.'),
          isVisible: this.props.item.isVisible,
          comment: this.props.item.comment,
          statusId: this.props.item.task.taskStatus.id,
          onDate: this.props.item.onDate
          //return: 'trackList'
        },
      );
    }
    // this.debounceUpdateTimesheet({
    //   taskId: (this.props.item.task) ? this.props.item.task.id : null,
    //   timesheetId: this.props.item.id,
    //   body: {
    //     spentTime: value.replace(',', '.')
    //   }
    // }, {
    //   isDraft: this.props.item.isDraft,
    //   onDate: this.props.item.onDate,
    //   itemKey: this.props.index
    // });
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

  getNameByType = (typeId) => {
    return _.find(this.props.magicActivitiesTypes, {id: typeId}).name || 'Не определено';
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
          {getMaIcon(this.props.item.typeId)}
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
              {task ? task.name : this.getNameByType(typeId)}
            </div>
          </div>
        </div>
        <div className={css.time}>
          <div className={css.today}>
            <input type="text" onChange={this.handleChangeTime} defaultValue={roundNum(spentTime, 2)}/>
          </div>
          <div className={classnames({[css.other]: true, [css.exceeded]: factTime > plannedTime})}>
            <span
              data-tip="Всего потрачено"
              data-place="bottom"
            >
              {task ? roundNum(task.factExecutionTime, 2) : null}
            </span>
            {
              task
                ? <span> / <span data-tip="Запланировано" data-place="bottom">{roundNum(task.plannedExecutionTime, 2)}</span></span>
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
  magicActivitiesTypes: PropTypes.array,
  updateDraft: PropTypes.func,
  updateOnlyTimesheet: PropTypes.func,
  updateTimesheet: PropTypes.func.isRequired,
  updateTimesheetDraft: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    tracks: state.TimesheetPlayer.tracks,
    magicActivitiesTypes: state.Dictionaries.magicActivityTypes
  };
};

const mapDispatchToProps = {
  updateTimesheet,
  updateTimesheetDraft,
  updateDraft,
  updateOnlyTimesheet
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);
