import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import GanttChart from './GanttChart';
import classnames from 'classnames';
import * as css from './Planning.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import DraggableTaskRow from './DraggableTaskRow';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import CreateTaskModal from '../../../components/CreateTaskModal';
import SprintColumn from './SprintColumn';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';

import { createSprint } from '../../../actions/Sprint';
import CreateSprintModal from '../CreateSprintModal';
import SprintCard from '../../../components/SprintCard';
import getPlanningTasks from '../../../actions/PlanningTasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { editSprint } from '../../../actions/Sprint';
import { openCreateTaskModal } from '../../../actions/Project';
import SprintStartControl from '../../../components/SprintStartControl';
import SprintEditModal from '../../../components/SprintEditModal';
import { IconArrowDown, IconArrowRight } from '../../../components/Icons';


const getSprintTime = sprint =>
  `${moment(sprint.factStartDate).format('DD.MM')}
  ${sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM')}` : '- ...'}`;

class Planning extends Component {

  static propTypes = {
    SprintIsEditing: PropTypes.bool,
    changeTask: PropTypes.func.isRequired,
    createSprint: PropTypes.func.isRequired,
    editSprint: PropTypes.func.isRequired,
    getPlanningTasks: PropTypes.func.isRequired,
    leftColumnTasks: PropTypes.array,
    openCreateTaskModal: PropTypes.func,
    project: PropTypes.object,
    rightColumnTasks: PropTypes.array,
    sprints: PropTypes.array.isRequired,
    startTaskEditing: PropTypes.func
  };

  constructor (props) {
    super(props);
    this.state = {
      isOpenSprintList: false,
      leftColumn: null,
      rightColumn: null,
      createTaskCallee: null,
      isModalOpenAddSprint: false,
      sprintIdHovered: null,
      grantActiveYear: new Date().getFullYear(),
      isOpenEditModal: false,
      editSprint: null
    };
  }

  componentDidMount () {
    this.selectValue(0, 'leftColumn');
    this.selectValue(this.getCurrentSprint(this.props.project.sprints), 'rightColumn');
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.SprintIsEditing && this.props.SprintIsEditing) {
      this.selectValue(this.state.leftColumn, 'leftColumn');
      this.selectValue(this.state.rightColumn, 'rightColumn');
    }

    if (this.props.project.sprints !== nextProps.project.sprints) {
      this.selectValue(0, 'leftColumn');
      this.selectValue(this.getCurrentSprint(nextProps.project.sprints), 'rightColumn');
    }
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  handleOpenModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: true });
  };

  handleCloseModalAddSprint = () => {
    this.setState({ isModalOpenAddSprint: false });
  };

  getCurrentSprint = sprints => {
    const currentSprints = sprints.filter(sprint =>
      sprint.statusId === 2 && moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]')
    );

    if (currentSprints.length) {
      return currentSprints[0].id;
    } else {
      return sprints.length ? sprints.sort((a, b) => moment(a.factStartDate).diff(moment(), 'days') - moment(b.factStartDate).diff(moment(), 'days'))[0].id : 0;
    }
  };

  getSprints = () => {
    let sprints = this.props.project.sprints;

    sprints = sprints.map(sprint => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format(
        'DD.MM.YYYY'
      )} ${sprint.factFinishDate
        ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}`
        : '- ...'})`,
      statusId: sprint.statusId,
      className: classnames({
        [css.INPROGRESS]: sprint.statusId === 2,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 1
      })
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: false,
        [css.sprintMarker]: true
      })
    });

    return sprints;
  };

  getEstimatesInfo = (sprintId, tasks) => {
    if (!sprintId) {
      return {
        summary: '',
        active: false,
        exceeded: false,
        width: '0%'
      };
    } else {
      const sprint = this.props.project.sprints.filter(item => item.id === sprintId)[0];
      const tasksEstimate = tasks.reduce((sum, task) => {
        return sum + task.plannedExecutionTime;
      }, 0);
      const sprintEstimate = sprint && sprint.allottedTime ? sprint.allottedTime : 0;
      const ratio = sprintEstimate === 0 ? 0 : tasksEstimate / sprintEstimate;

      return {
        summary: `Суммарное время задач: ${tasksEstimate} ${sprintEstimate ? ' из ' + sprintEstimate : ''} ч.`,
        width: `${ratio > 1 ? 100 : ratio * 100}%`,
        active: sprintEstimate !== 0,
        exceeded: ratio > 1
      };
    }
  }

  dropTask = (task, sprint) => {
    this.props.changeTask(
      {
        id: task.id,
        sprintId: sprint
      },
      'Sprint'
    );

    this.props.startTaskEditing('Sprint');
  };

  selectValue = (e, name) => {
    this.setState({ [name]: e }, () => {
      this.props.getPlanningTasks(name === 'leftColumn' ? 'left' : 'right', {
        projectId: this.props.project.id,
        sprintId: this.state[name]
      });
    });
  };

  openModal = event => {
    this.setState({
      createTaskCallee: event.target.name
    });
    this.props.openCreateTaskModal();
  };

  onMouseOverSprint = (sprintId) => {
    return () => {
      this.setState({ sprintIdHovered: sprintId });
    };
  };

  onMouseOutSprint = () => {
    this.setState({ sprintIdHovered: null });
  };

  oClickSprint = (sprintId) => {
    return () => {
      this.selectValue(
        sprintId,
        'rightColumn'
      );
    };
  };

  grantYearIncrement = () => {
    this.setState({ grantActiveYear: ++this.state.grantActiveYear });
  };

  grantYearDecrement = () => {
    this.setState({ grantActiveYear: --this.state.grantActiveYear });
  };

  getSprintBlock = (sprint, activeYear) => {
    const {factStartDate: start, factFinishDate: end} = sprint;
    const daysInYear = moment().endOf('year').dayOfYear();

    return {
      left: this.calcLeftPadding(activeYear, daysInYear, start),
      right: this.calcRightPadding(activeYear, daysInYear, end),
      zIndex: 1
    };
  };

  calcLeftPadding = (activeYear, daysInYear, date) => {
    return (+moment(date).format('YYYY') !== +activeYear)
      ? '0%'
      : ((moment(date).dayOfYear() - 1) / daysInYear * 100).toFixed(1) + '%';
  };

  calcRightPadding = (activeYear, daysInYear, date) => {
    return (+moment(date).format('YYYY') !== +activeYear)
      ? '0%'
      : (100 - (moment(date).dayOfYear() / daysInYear * 100)).toFixed(1) + '%';
  };

  sprintFilter = (sprint) => {
    return (+moment(sprint.factFinishDate).format('YYYY') === this.state.grantActiveYear)
      || (+moment(sprint.factStartDate).format('YYYY') === this.state.grantActiveYear);
  };

  openEditModal = (sprint) => {
    return () => {
      this.setState({
        editSprint: sprint,
        isOpenEditModal: true
      });
    };
  };

  handleEditSprint = (sprint) => {
    this.setState({ isOpenEditModal: false });
    this.props.editSprint(
      sprint.id,
      null,
      sprint.sprintName.trim(),
      sprint.dateFrom,
      sprint.dateTo,
      sprint.allottedTime
    );
  };

  closeEditSprintModal = () => {
    this.setState({
      editSprint: null,
      isOpenEditModal: false
    });
  };

  sprints = (sprint, i) => {
    return (
        <div key={`sprint-${i}`} className={css.tr}>
          <div
            className={classnames({
              [css.sprintBar]: true,
              [css.unactive]: sprint.statusId === 1 && moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]'),
              [css.finished]: moment(sprint.factFinishDate).isBefore(moment(), 'days'),
              [css.active]: sprint.statusId === 2,
              [css.future]: moment(sprint.factStartDate).isAfter(moment(), 'days')
            })}
            style={this.getSprintBlock(sprint, this.state.grantActiveYear)}
            data-tip={getSprintTime(sprint)}
            onClick={this.openEditModal(sprint)}
          >
            <div className={css.text}>{sprint.spentTime || 0}</div>
            <div className={css.text}>{sprint.allottedTime || 0}</div>
          </div>
        </div>
    );
  };

  render () {
    const leftColumnTasks = this.props.leftColumnTasks.map(task => {
      return (
        <DraggableTaskRow
          key={`task-${task.id}`}
          task={task}
          prefix={this.props.project.prefix}
          shortcut
          card
        />
      );
    });

    const rightColumnTasks
      = this.props.rightColumnTasks.map(task => {
        return (
        <DraggableTaskRow
          key={`task-${task.id}`}
          task={task}
          prefix={this.props.project.prefix}
          shortcut
          card
        />
        );
      });

    const leftEstimates = this.getEstimatesInfo(this.state.leftColumn, this.props.leftColumnTasks);
    const rightEstimates = this.getEstimatesInfo(this.state.rightColumn, this.props.rightColumnTasks);
    const leftColumnSprints = this.getSprints();
    const rightColumnSprints = this.getSprints();
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    return (
      <div>
        <section>
          <br />
          <hr />
          <Button
            text="Создать спринт"
            type="primary"
            style={{ float: 'right', marginTop: '-.2rem' }}
            icon="IconPlus"
            onClick={this.handleOpenModalAddSprint}
          />
          <div className={css.sprintList}>
            {this.props.sprints
              ? <div>
                <h2 className={css.name} onClick={() => this.setState({
                  ...this.state,
                  isOpenSprintList: !this.state.isOpenSprintList
                })}>
                  {this.state.isOpenSprintList ? <IconArrowDown /> : <IconArrowRight />}
                  Спринты / Фазы
                </h2>
                {this.state.isOpenSprintList
                  ? <Row>
                    {this.props.sprints.map((element, i) =>
                      <Col xs={3} key={`sprint-${i}`}>
                        <SprintCard sprint={element} inFocus={element.id === this.state.sprintIdHovered} onMouseOver={this.onMouseOverSprint(element.id)} onMouseOut={this.onMouseOutSprint} />
                      </Col>
                    )}
                  </Row>
                  : null}
              </div> : null}
          </div>
          {
            this.state.isModalOpenAddSprint
              ? <CreateSprintModal onClose={this.handleCloseModalAddSprint} />
              : null
          }
          <div className={css.graph}>
            <div className={css.wrapper}>
              <div className={css.sprintNames}>
                <div />
                <div />
                {this.props.sprints.filter(this.sprintFilter).map((sprint, i)=>
                  <div key={`sprint-${i}`}>
                    <span
                      className={classnames({
                        [css.selection]: true,
                        [css.hover]: sprint.id === this.state.sprintIdHovered
                      })}
                      data-tip={getSprintTime(sprint)} onClick={this.oClickSprint(sprint.id)} onMouseOver={this.onMouseOverSprint(sprint.id)} onMouseOut={this.onMouseOutSprint}/>
                    <SprintStartControl sprint={sprint} />
                    <span className={css.name} onClick={this.openEditModal(sprint)}>
                      {sprint.name}
                    </span>
                  </div>
                )}
              </div>
              <div className={classnames({
                [css.sprintNames]: true,
                [css.spentTime]: true
              })}>
                <span className={css.header}>План</span>
                {this.props.sprints.filter(this.sprintFilter).map((sprint, i)=>
                  <span key={`sprint-${i}`} className={css.name}>{sprint.allottedTime}</span>
                )}
              </div>
              <div className={classnames({
                [css.sprintNames]: true,
                [css.spentTime]: true
              })}>
                <span className={css.header}>Факт</span>
                {this.props.sprints.filter(this.sprintFilter).map((sprint, i)=>
                  <span key={`sprint-${i}`} className={css.name}>{0}</span>
                )}
              </div>
              <div className={css.table}>
                <div className={css.tr}>
                  <div className={css.year}>
                    <span className={css.arrow} onClick={this.grantYearDecrement}>&larr;</span>
                    <span>{this.state.grantActiveYear}</span>
                    <span className={css.arrow} onClick={this.grantYearIncrement}>&rarr;</span>
                  </div>
                </div>
                <div className={css.tr}>
                  <div className={css.nameHeader} />
                  {
                    months.map((month, i) => <div key={`sprint-${month}`} className={css.month} style={{flex: moment(`${this.state.grantActiveYear}-${(++i)}`, 'YYYY-MM').daysInMonth()}} >{month}</div>)
                  }
                </div>
                {this.props.sprints.filter(this.sprintFilter).map((sprint, i) => this.sprints(sprint, i))}
                <div className={css.grid}>
                  {
                    months.map((el, i) => <span key={`sprint-${i}`} style={{flex: moment(`${this.state.grantActiveYear}-${(++i)}`, 'YYYY-MM').daysInMonth()}}/>)
                  }
                </div>
              </div>
            </div>
          </div>
          <Row>
            <Col xs={6}>
              <div className={css.headerColumn}>
                <div className={css.selectWrapper}>
                  <SelectDropdown
                    name="leftColumn"
                    placeholder="Введите название спринта..."
                    multi={false}
                    value={this.state.leftColumn}
                    onChange={e =>
                      this.selectValue(
                        e !== null ? e.value : null,
                        'leftColumn'
                      )}
                    noResultsText="Нет результатов"
                    options={leftColumnSprints}
                  />
                </div>
                <Button
                  onClick={this.openModal}
                  type="bordered"
                  text="Создать задачу"
                  icon="IconPlus"
                  name="left"
                  style={{ marginLeft: 16 }}
                />
              </div>
              <div
                className={css.progressBarWrapper}
                data-tip={leftEstimates.summary}
              >
                <div
                  className={classnames({
                    [css.progressBar]: leftEstimates.active,
                    [css.exceeded]: leftEstimates.exceeded
                  })}
                  style={{ width: leftEstimates.width }}
                />
              </div>
              {this.state.leftColumn || this.state.leftColumn === 0
                ? <SprintColumn
                  onDrop={this.dropTask}
                  sprint={this.state.leftColumn}
                  tasks={leftColumnTasks}
                />
                : null}
            </Col>
            <Col xs={6}>
              <div className={css.headerColumn}>
                <div className={css.selectWrapper}>
                  <SelectDropdown
                    name="rightColumn"
                    placeholder="Введите название спринта..."
                    multi={false}
                    value={this.state.rightColumn}
                    onChange={e =>
                      this.selectValue(
                        e !== null ? e.value : null,
                        'rightColumn'
                      )}
                    noResultsText="Нет результатов"
                    options={rightColumnSprints}
                  />
                </div>
                <Button
                  onClick={this.openModal}
                  type="bordered"
                  text="Создать задачу"
                  icon="IconPlus"
                  name="right"
                  style={{ marginLeft: 16 }}
                />
              </div>
              <div
                className={css.progressBarWrapper}
                data-tip={rightEstimates.summary}
              >
                <div
                  className={classnames({
                    [css.progressBar]: rightEstimates.active,
                    [css.exceeded]: rightEstimates.exceeded
                  })}
                  style={{ width: rightEstimates.width }}
                />
              </div>
              {this.state.rightColumn || this.state.rightColumn === 0
                ? <SprintColumn
                  onDrop={this.dropTask}
                  sprint={this.state.rightColumn}
                  tasks={rightColumnTasks}
                />
                : null}
            </Col>
          </Row>
        </section>
        {/* <GanttChart /> */}
        <CreateTaskModal
          selectedSprintValue={
            this.state.createTaskCallee === 'left'
              ? this.state.leftColumn
              : this.state.rightColumn
          }
          project={this.props.project}
          column={this.state.createTaskCallee}
        />
        {this.state.isOpenEditModal
        ? <SprintEditModal sprint={this.state.editSprint} handleEditSprint={this.handleEditSprint} handleCloseModal={this.closeEditSprintModal}/>
        : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  leftColumnTasks: state.PlanningTasks.leftColumnTasks,
  rightColumnTasks: state.PlanningTasks.rightColumnTasks,
  SprintIsEditing: state.Task.SprintIsEditing
});

const mapDispatchToProps = {
  getPlanningTasks,
  editSprint,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(Planning);
