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
import { openCreateTaskModal } from '../../../actions/Project';


const getSprintBlock = sprint => {
  const {factStartDate: start, factFinishDate: end} = sprint;
  const daysInYear = moment().endOf('year').dayOfYear();

  return {
    left: Math.floor(moment(start).dayOfYear() / daysInYear * 100) + '%',
    right: Math.floor(100 - (moment(end).dayOfYear() / daysInYear * 100)) + '%'
  };
};

const getSprintTime = sprint =>
  `${moment(sprint.factStartDate).format('DD.MM')}
  ${sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM')}` : '- ...'}`;

class Planning extends Component {
  constructor (props) {
    super(props);
    this.state = {
      leftColumn: null,
      rightColumn: null,
      createTaskCallee: null,
      isModalOpenAddSprint: false,
      sprintIdHovered: null
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

  getSprints = column => {
    const secondColumn = column === 'leftColumn' ? 'rightColumn' : 'leftColumn';
    let sprints = _.sortBy(this.props.project.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

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

    sprints.forEach(sprint => {
      sprint.disabled = sprint.value === this.state[secondColumn];
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
      if (sprintId === this.state.leftColumn) {
        this.selectValue(
          this.state.rightColumn,
          'leftColumn'
        );
      }

      this.selectValue(
          sprintId,
          'rightColumn'
        );
    };
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

    const rightColumnTasks =
      this.props.rightColumnTasks.map(task => {
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
    const leftColumnSprints = this.getSprints('leftColumn');
    const rightColumnSprints = this.getSprints('rightColumn');
    const months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    return (
      <div>
        <section>
          {this.props.sprints
            ? <div>
            <hr />
            <h2>Спринты / Фазы</h2>
            <Row>
              {this.props.sprints.map((element, i) =>
                <Col xs={3} key={`sprint-${i}`}>
                  <SprintCard sprint={element} inFocus={element.id === this.state.sprintIdHovered} onMouseOver={this.onMouseOverSprint(element.id)} onMouseOut={this.onMouseOutSprint} />
                </Col>
              )}
            </Row>
          </div>
            : null}
          <Button
            text="Создать спринт"
            type="primary"
            style={{ marginBottom: 16, marginTop: 16 }}
            icon="IconPlus"
            onClick={this.handleOpenModalAddSprint}
          />
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
                {this.props.sprints.map((sprint, i)=>
                  <div key={`sprint-${i}`}>
                    <span
                      className={classnames({
                        [css.selection]: true,
                        [css.hover]: sprint.id === this.state.sprintIdHovered
                      })}
                      data-tip={getSprintTime(sprint)} onClick={this.oClickSprint(sprint.id)} onMouseOver={this.onMouseOverSprint(sprint.id)} onMouseOut={this.onMouseOutSprint}/>
                    <span className={css.name}>{sprint.name}</span>
                  </div>
                )}
              </div>
              <div className={css.table}>
                <div className={css.tr}>
                  <div className={css.year}>2017</div>
                </div>
                <div className={css.tr}>
                  <div className={css.nameHeader} />
                  {
                    months.map(month => <div key={`sprint-${month}`} className={css.month}>{month}</div>)
                  }
                </div>
                {this.props.sprints.map((sprint, i) =>
                  <div key={`sprint-${i}`} className={css.tr}>
                    <div
                      className={classnames({
                        [css.sprintBar]: true,
                        [css.unactive]: sprint.statusId === 1 && moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]'),
                        [css.finished]: moment(sprint.factFinishDate).isBefore(moment(), 'days'),
                        [css.active]: sprint.statusId === 2,
                        [css.future]: moment(sprint.factStartDate).isAfter(moment(), 'days')
                      })}
                      style={getSprintBlock(sprint)}
                    >
                      <div className={css.text}>{sprint.spentTime || 0}</div>
                      <div className={css.text}>{sprint.allottedTime || 0}</div>
                    </div>
                  </div>
                )}
                <div className={css.grid}>
                  {
                    months.map((el, i) => <span key={`sprint-${i}`}/>)
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
      </div>
    );
  }
}

Planning.propTypes = {
  SprintIsEditing: PropTypes.bool,
  changeTask: PropTypes.func.isRequired,
  createSprint: PropTypes.func.isRequired,
  getPlanningTasks: PropTypes.func.isRequired,
  leftColumnTasks: PropTypes.array,
  openCreateTaskModal: PropTypes.func,
  project: PropTypes.object,
  rightColumnTasks: PropTypes.array,
  sprints: PropTypes.array.isRequired,
  startTaskEditing: PropTypes.func
};

const mapStateToProps = state => ({
  sprints: state.Project.project.sprints,
  project: state.Project.project,
  leftColumnTasks: state.PlanningTasks.leftColumnTasks,
  rightColumnTasks: state.PlanningTasks.rightColumnTasks,
  SprintIsEditing: state.Task.SprintIsEditing
});

const mapDispatchToProps = {
  getPlanningTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  createSprint
};

export default connect(mapStateToProps, mapDispatchToProps)(Planning);
