import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { history } from '../../../../../History';
import { updateDraft, updateTimesheet } from '../../../../../actions/TimesheetPlayer';
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import get from 'lodash/get';
import css from '../Playlist.scss';
import * as timesheetsConstants from '../../../../../constants/Timesheets';
import getMaIcon from '../../../../../constants/MagicActivityIcons';
import roundNum from '../../../../../utils/roundNum';
import validateNumber from '../../../../../utils/validateNumber';

import { IconComment, IconCheck, IconEye, IconEyeDisable } from '../../../../../components/Icons';
import localize from './playlistItem.json';
import { getMagicActiveTypes } from '../../../../../selectors/dictionaries';

type PlaylistItemProps = {
  index: number,
  lang: 'en' | 'ru',
  item: any,
  task: any,
  visible: boolean,
  handleToggleList?: () => void,
  magicActivitiesTypes?: any[],
  updateDraft: ({ sheetId: any, isVisible: boolean }) => void,
  updateTimesheet: ({ sheetId: any, isVisible: boolean }) => void,
  disabled?: boolean,
}

class PlaylistItem extends Component<PlaylistItemProps, any> {
  debouncedUpdateDraft: (...args: any[]) => any;
  debouncedUpdateOnlyTimesheet:  (...args: any[]) => any;

  constructor(props) {
    super(props);

    this.state = {
      itemSpentTime: roundNum(this.props.item.spentTime, 2),
      isCommentOpen: false
    };
    this.debouncedUpdateDraft = debounce(this.props.updateDraft, 500);
    this.debouncedUpdateOnlyTimesheet = debounce(this.props.updateTimesheet, 500);
  }

  toggleComment = event => {
    event.stopPropagation();
    this.setState({ isCommentOpen: !this.state.isCommentOpen });
  };

  pushComment = comment => {
    return () => {
      this.debouncedUpdateOnlyTimesheet({
        sheetId: this.props.item.id,
        comment
      });

      this.setState(prevState => ({ isCommentOpen: !prevState.isCommentOpen }));
    };
  };

  handleChangeTime = e => {
    let value = e.target.value;

    if (!validateNumber(value) || +value > 24) {
      return false;
    }

    const replacedStr = value.replace(',', '.');
    value = parseFloat(replacedStr) || 0;
    if (parseFloat(this.state.itemSpentTime) !== value && this.props.item.spentTime !== value) {
      if (this.props.item.isDraft) {
        if (value > 0) {
          this.debouncedUpdateDraft(
            {
              sheetId: this.props.item.id,
              spentTime: value,
              isVisible: this.props.item.isVisible,
              onDate: this.props.item.onDate,
              typeId: this.props.item.typeId,
              projectId: this.props.item.project ? this.props.item.project.id : 0,
              sprintId: this.props.item.task && this.props.item.task.sprint ? this.props.item.task.sprint.id : 0,
              taskId: this.props.item.task && this.props.item.task.id
            },
            {
              onDate: this.props.item.onDate
            }
          );
        }
      } else {
        this.debouncedUpdateOnlyTimesheet({
          sheetId: this.props.item.id,
          spentTime: value,
          isVisible: this.props.item.isVisible,
          comment: this.props.item.comment,
          onDate: this.props.item.onDate,
          projectId: this.props.item.project ? this.props.item.project.id : 0,
          sprintId: this.props.item.sprint ? this.props.item.sprint.id : 0,
          taskId: this.props.item.task && this.props.item.task.id
        });
      }
    }
    this.setState({
      itemSpentTime: replacedStr
    });
  };

  handleChangeComment = e => {
    this.setState({ comment: e.target.value });
  };

  changeVisibility = (e, visibility) => {
    e.stopPropagation();
    const params = {
      sheetId: this.props.item.id,
      isVisible: !!visibility
    };
    if (this.props.item.isDraft) {
      this.props.updateDraft(params);
    } else {
      this.props.updateTimesheet(params);
    }
  };

  getNameByType = typeId => {
    const { lang } = this.props;
    const activity = find(this.props.magicActivitiesTypes, { id: typeId });
    return activity ? localize[lang][activity.codename] : localize[lang].UNDEFINED;
  };

  getSprintName = () => {
    const { task, sprint } = this.props.item;
    const defaultSprint = 'Backlog';

    if (task) {
      return get(task, 'sprint.name') ? task.sprint.name : defaultSprint;
    }

    return get(sprint, 'name') ? sprint.name : defaultSprint;
  };

  goToDetailPage = () => {
    const {handleToggleList, item: { task, project }} = this.props;
    if (task) {
      history.push(`/projects/${project.id}/tasks/${task.id}`);
      if (handleToggleList) handleToggleList();
    }
  };

  giveRealValue = () => this.setState({ itemSpentTime: roundNum(this.props.item.spentTime, 2) });

  render() {
    const {
      task,
      project,
      comment,
      typeId,
      taskStatus: createDraftStatus,
      isDraft,
      isVisible,
      statusId,
      spentTime
    } = this.props.item;
    const { lang, disabled: timesheetDisabled } = this.props;
    const status = task ? task.taskStatus : null;
    const redColorForTime = task ? parseFloat(task.factExecutionTime) > parseFloat(task.plannedExecutionTime) : false;
    const taskName = task ? task.name : this.getNameByType(typeId);

    const prefix = project && project.prefix ? `${project.prefix}-` : '';
    const taskLabel = task && prefix ? prefix + task.id : null;

    const createDraftStatusName = createDraftStatus ? createDraftStatus.name.replace(' stop', '') : '';
    return (
      <div className={classnames(css.listTask, css.task)}>
        <div
          className={classnames({
            [css.actionButton]: true,
            [css.locked]: status !== 'inhold' && status !== 'inprogress'
          })}
        >
          {getMaIcon(typeId)}
        </div>
        <div
          className={classnames(css.taskNameWrapper, {
            [css.currentItem]:
              task && project && task.id === this.props.task.id && project.id === this.props.task.projectId
          })}
          onClick={this.goToDetailPage}
        >
          <div className={css.taskTitle}>
            <div className={css.meta}>
              {task && task.prefix ? <span>{task.prefix}</span> : null}
              <span className={css.proName}>{project ? project.name : localize[lang].WITHOUT_PROJECT}</span>
              <span title={this.getSprintName()}>{this.getSprintName()}</span>
              {status ? (
                <span>
                  {createDraftStatus ? (
                    <span>
                      {createDraftStatusName}
                      <span />
                    </span>
                  ) : null}
                </span>
              ) : null}
              {status ? (
                <span>
                  {localize[lang].CURRENT_STATUS} {status.name}
                </span>
              ) : null}
              {!isDraft ? (
                <span
                  className={classnames({ [css.commentToggler]: true, [css.green]: !!comment })}
                  onClick={this.toggleComment}
                >
                  <IconComment />
                </span>
              ) : null}

              {status !== 'education' ? (
                isVisible ? (
                  <span
                    className={css.visibleToggler}
                    onClick={e => this.changeVisibility(e, false)}
                    data-tip={localize[lang].HIDE}
                  >
                    <IconEyeDisable />
                  </span>
                ) : (
                  <span
                    className={css.visibleToggler}
                    onClick={e => this.changeVisibility(e, true)}
                    data-tip={localize[lang].SHOW}
                  >
                    <IconEye />
                  </span>
                )
              ) : null}
            </div>
            <div className={classnames(css.taskName, css.listItem)}>
              {taskLabel ? <span>{taskLabel}</span> : null}
              <span title={taskName}>{taskName}</span>
            </div>
          </div>
          <div className={css.phoneVisibleToggle}>
            {!isDraft ? (
              <span
                className={classnames({ [css.commentToggler]: true, [css.green]: !!comment })}
                onClick={this.toggleComment}
              >
                <IconComment />
              </span>
            ) : null}

            {status !== 'education' ? (
              isVisible ? (
                <span
                  className={css.commentToggler}
                  onClick={e => this.changeVisibility(e, false)}
                  data-tip={localize[lang].HIDE}
                >
                  <IconEyeDisable />
                </span>
              ) : (
                <span
                  className={css.commentToggler}
                  onClick={e => this.changeVisibility(e, true)}
                  data-tip={localize[lang].SHOW}
                >
                  <IconEye />
                </span>
              )
            ) : null}
          </div>
        </div>
        <div className={css.time}>
          <div className={css.today}>
            <input
              className={classnames({
                [css.withStatus]: statusId,
                [css.filled]: +spentTime && statusId === timesheetsConstants.TIMESHEET_STATUS_FILLED,
                [css.approved]: statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED,
                [css.submitted]: statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED,
                [css.rejected]: statusId === timesheetsConstants.TIMESHEET_STATUS_REJECTED,
                [css.input]: true,
                [css.editable]: !timesheetDisabled
              })}
              type="text"
              onChange={this.handleChangeTime}
              value={this.state.itemSpentTime}
              disabled={timesheetDisabled}
              onBlur={this.giveRealValue}
            />
          </div>
          <div className={classnames({ [css.other]: true, [css.exceeded]: redColorForTime })}>
            <span
              data-tip={`${roundNum(task && task.factExecutionTime, 2)}/${roundNum(
                task && task.plannedExecutionTime,
                2
              )}`}
              data-place="bottom"
            >
              {task
                ? Math.trunc(roundNum(task.factExecutionTime, 2)) === roundNum(task.factExecutionTime, 2)
                  ? roundNum(task.factExecutionTime, 2)
                  : `~${Math.floor(roundNum(task.factExecutionTime, 2))}`
                : null}
            </span>
            {task ? (
              <span>
                /
                <span data-tip={localize[lang].SCHEDULED} data-place="bottom">
                  {Math.trunc(roundNum(task.plannedExecutionTime, 2)) === roundNum(task.plannedExecutionTime, 2)
                    ? roundNum(task.plannedExecutionTime, 2)
                    : Math.floor(roundNum(task.plannedExecutionTime, 2))}
                </span>
              </span>
            ) : null}
          </div>
        </div>
        {this.state.isCommentOpen ? (
          <div className={css.comment}>
            <textarea
              autoFocus
              onChange={this.handleChangeComment}
              defaultValue={comment}
              value={this.state.comment}
              placeholder={localize[lang].ENTER_COMMENT_TEXT}
              disabled={timesheetDisabled}
            />
            {!timesheetDisabled && (
              <div className={css.actionButton} onClick={this.pushComment(this.state.comment)}>
                <IconCheck style={{ width: '1.5rem', height: '1.5rem', color: '#fff', opacity: '0.9' }} />
              </div>
            )}
          </div>
        ) : null}
      </div>
    );
  }
}

(PlaylistItem as any).propTypes = {
  disabled: PropTypes.bool,
  handleToggleList: PropTypes.func,
  index: PropTypes.number.isRequired,
  item: PropTypes.object.isRequired,
  lang: PropTypes.string,
  magicActivitiesTypes: PropTypes.array,
  task: PropTypes.object,
  updateDraft: PropTypes.func,
  updateTimesheet: PropTypes.func,
  visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => {
  return {
    magicActivitiesTypes: getMagicActiveTypes(state),
    task: state.Task.task,
    lang: state.Localize.lang
  };
};

const mapDispatchToProps = {
  updateDraft,
  updateTimesheet
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistItem);
