import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router';
import { DragSource } from 'react-dnd';

import { TASK_CARD } from '../../constants/DragAndDrop';
import { IconPlay, IconPause, IconTime, IconBug, IconEdit } from '../Icons';
import { history } from '../../History';
import CopyThis from '../../components/CopyThis';
import PriorityBox from './PriorityBox';
import getTypeById from '../../utils/TaskTypes';
import roundNum from '../../utils/roundNum';
import getProrityById from '../../utils/TaskPriority';
import { isTaskInHold, isTaskInProgress, isTaskInWork } from '../../utils/TaskStatuses';
import * as css from './TaskCard.scss';
import { compose } from 'redux';
import { connect } from 'react-redux';
import localize from './TaskCore.json';
import { getFullName, notFoundEn, notFoundRu } from '../../utils/NameLocalisation';

const taskCardSource = {
  beginDrag(props) {
    return {
      id: props.task.id,
      section: props.section,
      statusId: props.task.statusId
    };
  }
};

function collect(connection, monitor) {
  return {
    connectDragSource: connection.dragSource(),
    isDragging: monitor.isDragging()
  };
}

const getTaskTime = (factTime, planTime, lang) => {
  if (factTime) {
    return planTime
      ? `${roundNum(factTime, 2)} ${localize[lang].OF} ${roundNum(planTime, 2)} ${localize[lang].H}`
      : `${roundNum(factTime, 2)} ${localize[lang].H}`;
  } else {
    return planTime
      ? `0 ${localize[lang].OF} ${roundNum(planTime, 2)} ${localize[lang].H}`
      : `0 ${localize[lang].OF} 0 ${localize[lang].H}`;
  }
};

class TaskCore extends PureComponent<any, any> {
  static propTypes = {
    classPriority: PropTypes.any,
    connectDragSource: PropTypes.func,
    factPlanDivision: PropTypes.number,
    isBug: PropTypes.bool,
    isDragging: PropTypes.bool,
    isExternal: PropTypes.bool,
    lang: PropTypes.string,
    lightTask: PropTypes.func,
    lighted: PropTypes.bool,
    myTaskBoard: PropTypes.bool,
    onChangeStatus: PropTypes.func,
    onOpenPerformerModal: PropTypes.func,
    projectPrefix: PropTypes.string,
    projectUsers: PropTypes.arrayOf(PropTypes.object),
    section: PropTypes.string.isRequired,
    task: PropTypes.object,
    taskTypes: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = { isOpenPriority: false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.task.statusId !== nextProps.task.statusId) {
      ReactTooltip.hide();
    }
  }

  handleClick = event => {
    event.stopPropagation();
    const { task, onChangeStatus } = this.props;
    onChangeStatus(task.id, task.statusId);
  };

  handlePerformerClick = event => {
    event.stopPropagation();
    const { task, onOpenPerformerModal } = this.props;
    onOpenPerformerModal(
      task.id,
      task.performer ? task.performer.id : null,
      task.project ? task.project.id : null,
      task.statusId,
      null,
      true,
      task.isDevOps,
      true
    );
  };

  togglePriorityBox = () => {
    this.setState({ isOpenPriority: !this.state.isOpenPriority });
  };

  showPriorityBox = event => {
    event.stopPropagation();
    this.togglePriorityBox();
  };

  isInPlan = (plannedTime, factTime) => factTime / plannedTime <= 1 && plannedTime;

  isOutOfPlan = (plannedTime, factTime) => factTime / plannedTime > 1 && plannedTime;

  goToDetailPage = () => {
    history.push(`/projects/${this.props.task.projectId}/tasks/${this.props.task.id}`);
  };

  getPrefixFromProject = () => {
    const { projectPrefix } = this.props;
    return projectPrefix ? projectPrefix : '';
  };

  getUserFromProject = id => {
    const { projectUsers } = this.props;
    return projectUsers.find(user => user.id === id);
  };

  handleTaskNameClick = event => {
    // fix for FF to open task page only in the new and not in the same tab
    // on mouse middle button click
    event.stopPropagation();
  };

  render() {
    const {
      classPriority,
      isBug,
      lightTask,
      task,
      taskTypes,
      myTaskBoard,
      isExternal,
      lighted,
      factPlanDivision,
      connectDragSource,
      isDragging,
      lang
    } = this.props;

    const prefix = task.prefix ? task.prefix : this.getPrefixFromProject();
    let performer = getFullName(this.getUserFromProject(task.performerId));

    if (performer === notFoundEn || performer === notFoundRu) {
      performer = getFullName(this.props.task.performer);
    }

    return connectDragSource(
      <div
        className={classnames({
          [css.taskCard]: true,
          [css[classPriority]]: true,
          [css.bug]: isBug,
          [css.dropped]: isDragging
        })}
        onMouseEnter={() => lightTask(task.id, false)}
        onMouseLeave={() => lightTask(null, false)}
        onClick={this.goToDetailPage}
        id={`task-${task.id}`}
      >
        {isTaskInWork(task.statusId) ? (
          <div
            className={classnames({
              [css.status]: true,
              [css.inhold]: isTaskInHold(task.statusId),
              [css.inprogress]: isTaskInProgress(task.statusId)
            })}
          >
            {isTaskInProgress(task.statusId) ? (
              <IconPause data-tip={localize[lang].PAUSE} onClick={this.handleClick} />
            ) : (
              <IconPlay data-tip={localize[lang].START} onClick={this.handleClick} />
            )}
          </div>
        ) : null}

        <CopyThis
          wrapThisInto={'div'}
          isCopiedBackground
          description={`${localize[lang].LINK} ${prefix}-${task.id}`}
          textToCopy={`${location.origin}${history.createHref(`/projects/${task.projectId}/tasks/${task.id}`)}`}
        >
          <div className={css.header}>
            <span className={css.taskNum}>
              {isBug ? <IconBug style={{ verticalAlign: 'top' }} /> : null} {prefix}-{task.id}
            </span>{' '}
            | {getTypeById(task.typeId, taskTypes)}
          </div>
        </CopyThis>

        <div>
          <Link
            onClick={this.handleTaskNameClick}
            to={`/projects/${task.projectId}/tasks/${task.id}`}
            className={css.taskName}
          >
            {task.name}
          </Link>
        </div>

        <p className={css.taskMeta} onClick={this.handlePerformerClick}>
          {!myTaskBoard && (
            <span className={css.performer}>
              {task.performerId ? (
                <span>
                  {performer}
                  <span className={css.preformerEditIcon}>
                    <IconEdit />
                  </span>
                </span>
              ) : (
                <span className={css.unassigned}>{localize[lang].NOT_ASSIGNED}</span>
              )}
            </span>
          )}
        </p>

        {!!(task.factExecutionTime || task.plannedExecutionTime) &&
          !isExternal && (
            <p className={classnames(css.time, { [css.redBorder]: +task.plannedExecutionTime === 0 })}>
              <IconTime
                className={classnames({
                  [css.green]: this.isInPlan(task.plannedExecutionTime, task.factExecutionTime),
                  [css.red]: this.isOutOfPlan(task.plannedExecutionTime, task.factExecutionTime)
                })}
              />
              <span>{getTaskTime(task.factExecutionTime, task.plannedExecutionTime, lang)}</span>
            </p>
          )}

        {!!task.plannedExecutionTime &&
          !isExternal && (
            <div className={css.progressBar}>
              <div
                style={{ width: factPlanDivision < 1 ? factPlanDivision * 100 + '%' : '100%' }}
                className={classnames({
                  [css.green]: this.isInPlan(task.plannedExecutionTime, task.factExecutionTime),
                  [css.red]: this.isOutOfPlan(task.plannedExecutionTime, task.factExecutionTime)
                })}
              />
            </div>
          )}

        {this.state.isOpenPriority ? (
          <PriorityBox
            taskId={task.id}
            isTime={!!(task.factExecutionTime || task.plannedExecutionTime)}
            priorityId={task.prioritiesId}
            hideBox={this.togglePriorityBox}
          />
        ) : (
          <div
            className={css.priorityMarker}
            onClick={this.showPriorityBox}
            data-tip={`${localize[lang].PRIORITY} ${getProrityById(this.props.task.prioritiesId)}`}
          />
        )}
        {lighted ? <div className={css.lightedBorder} /> : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  projectPrefix: state.Project.project.prefix,
  projectUsers: state.Project.project.users
});

const composer = compose(
  DragSource(TASK_CARD, taskCardSource, collect),
  connect(
    mapStateToProps,
    null
  )
) as any;

export default composer(TaskCore);
