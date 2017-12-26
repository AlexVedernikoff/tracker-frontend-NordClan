import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { history } from '../../../../../History';
import {
  updateDraft,
  updateTimesheet
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
    this.debouncedUpdateDraft = _.debounce(this.props.updateDraft, 500);
    this.debouncedUpdateOnlyTimesheet = _.debounce(this.props.updateTimesheet, 500);
  }

  toggleComment = event => {
    event.stopPropagation();
    this.setState({isCommentOpen: !this.state.isCommentOpen});
  };

  pushComment = (comment) => {
    return () => {
      this.debouncedUpdateOnlyTimesheet({
        sheetId: this.props.item.id,
        comment
      })
    };
  };

  handleChangeTime = (e) => {
    const value = e.target.value;
    if (this.props.item.isDraft) {
      this.debouncedUpdateDraft(
       {
          sheetId: this.props.item.id,
          spentTime: value.replace(',', '.'),
          isVisible: this.props.item.isVisible
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
          onDate: this.props.item.onDate
        }
      );
    }
  };

  handleChangeComment = (e) => {
    this.setState({comment: e.target.value});
  };

  changeVisibility = (e, visibility) => {
    e.stopPropagation();
    const { item, updateTimesheet, updateDraft } = this.props;
    return () => {
      const params = {
        sheetId: item.id,
        isVisible: !!visibility
      }
      item.isDraft ? updateDraft(params) : updateTimesheet(params);
    };
  };

  getNameByType = (typeId) => {
    return _.find(this.props.magicActivitiesTypes, {id: typeId}).name || 'Не определено';
  };

  goToDetailPage = () => {
    const { task, project } = this.props.item;
    if (task) {
      history.push(`/projects/${project.id}/tasks/${task.id}`);
    }
  };

  render () {
    const {
      task,
      project,
      spentTime,
      comment,
      typeId,
      taskStatus: prevStatus,
      isDraft,
      isVisible
    } = this.props.item;
    const status = task ? task.taskStatus : null;
    const redColorForTime = task
      ? parseFloat(task.factExecutionTime) > parseFloat(task.plannedExecutionTime)
      : false;

    return (
      <div className={classnames(css.listTask, css.task)}>
        <div className={classnames({
          [css.actionButton]: true,
          [css.locked]: status !== 'inhold' && status !== 'inprogress'
        })}>
          {getMaIcon(typeId)}
        </div>
        <div className={css.taskNameWrapper} onClick={this.goToDetailPage}>
          <div className={css.taskTitle}>
            <div className={css.meta}>
              { task && task.prefix ? <span>{task.prefix}</span> : null}
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
                ? (isVisible
                  ? <span className={css.visibleToggler} onClick={(e) => this.changeVisibility(e, false)} data-tip="Скрыть"><IconEyeDisable/></span>
                  : <span className={css.visibleToggler} onClick={(e) => this.changeVisibility(e, true)} data-tip="Показать"><IconEye/></span>)
                : null
              }
            </div>
            <div className={css.taskName}>
              <span>{task ? `${project.prefix}-${task.id}` : project.prefix}</span>
              {task ? task.name : this.getNameByType(typeId)}
            </div>
          </div>
        </div>
        <div className={css.time}>
          <div className={css.today}>
            <input type="text" onChange={this.handleChangeTime} defaultValue={roundNum(spentTime, 2)}/>
          </div>
          <div className={classnames({[css.other]: true, [css.exceeded]: redColorForTime})}>
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
  updateTimesheet: PropTypes.func,
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    magicActivitiesTypes: state.Dictionaries.magicActivityTypes
  };
};

const mapDispatchToProps = {
  updateDraft,
  updateTimesheet
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistItem);
