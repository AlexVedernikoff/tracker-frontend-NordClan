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

import getPlanningTasks from '../../../actions/PlanningTasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal } from '../../../actions/Project';

const sortTasks = sortedArr => {
  sortedArr.sort((a, b) => {
    if (a.prioritiesId > b.prioritiesId) return 1;
    if (a.prioritiesId < b.prioritiesId) return -1;
  });
  return sortedArr;
};

class Planning extends Component {
  constructor (props) {
    super(props);
    this.state = {
      leftColumn: null,
      rightColumn: null,
      createTaskCallee: null
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

  getCurrentSprint = sprints => {
    const currentSprints = sprints.filter(sprint =>
      sprint.statusId === 2 && moment().isBetween(moment(sprint.factStartDate), moment(sprint.factFinishDate), 'days', '[]')
    );

    if (currentSprints.length) {
      return currentSprints[0].id;
    } else {
      return sprints.length ? sprints.sort((a, b) => moment(a.factStartDate).diff(moment(), 'days') - moment(b.factStartDate).diff(moment(), 'days'))[0].id : 0;
    }
  }

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

  handleModalSprintSelect = () => {};

  render () {
    const leftColumnTasks = sortTasks(this.props.leftColumnTasks).map(task => {
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

    const rightColumnTasks = sortTasks(
      this.props.rightColumnTasks
    ).map(task => {
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

    return (
      <div>
        <section>
          <Button
            type="primary"
            text="Создать спринт"
            icon="IconPlus"
            style={{ marginBottom: 16 }}
          />
          <div className={css.graph}>
            <div className={css.wrapper}>
              <div className={css.sprintNames}>
                <div />
                <div />
                <div>
                  <span className={css.selection} />
                  <span className={css.name}>Спринт №1</span>
                </div>
                <div>
                  <span className={css.selection} />
                  <span className={css.name}>Спринт №2</span>
                </div>
                <div>
                  <span className={css.selection} />
                  <span className={css.name}>Спринт №3</span>
                </div>
                <div>
                  <span className={css.selection} />
                  <span className={css.name}>Спринт №4</span>
                </div>
                <div>
                  <span className={css.selection} />
                  <span className={css.name}>
                    Очень длинное название спринта
                  </span>
                </div>
              </div>
              <div className={css.table}>
                <div className={css.tr}>
                  <div className={css.year}>2016</div>
                  <div className={css.year}>2017</div>
                  <div className={css.year}>2018</div>
                </div>
                <div className={css.tr}>
                  <div className={css.nameHeader} />
                  <div className={css.month}>Январь</div>
                  <div className={css.month}>Февраль</div>
                  <div className={css.month}>Март</div>
                  <div className={css.month}>Апрель</div>
                  <div className={css.month}>Май</div>
                  <div className={css.month}>Июнь</div>
                  <div className={css.month}>Июль</div>
                  <div className={css.month}>Август</div>
                  <div className={css.month}>Сентябрь</div>
                  <div className={css.month}>Октябрь</div>
                  <div className={css.month}>Ноябрь</div>
                  <div className={css.month}>Декабрь</div>
                  <div className={css.month}>Январь</div>
                  <div className={css.month}>Февраль</div>
                  <div className={css.month}>Март</div>
                  <div className={css.month}>Апрель</div>
                  <div className={css.month}>Май</div>
                  <div className={css.month}>Июнь</div>
                  <div className={css.month}>Июль</div>
                  <div className={css.month}>Август</div>
                  <div className={css.month}>Сентябрь</div>
                  <div className={css.month}>Октябрь</div>
                  <div className={css.month}>Ноябрь</div>
                  <div className={css.month}>Декабрь</div>
                  <div className={css.month}>Январь</div>
                  <div className={css.month}>Февраль</div>
                  <div className={css.month}>Март</div>
                  <div className={css.month}>Апрель</div>
                  <div className={css.month}>Май</div>
                  <div className={css.month}>Июнь</div>
                  <div className={css.month}>Июль</div>
                  <div className={css.month}>Август</div>
                  <div className={css.month}>Сентябрь</div>
                  <div className={css.month}>Октябрь</div>
                  <div className={css.month}>Ноябрь</div>
                  <div className={css.month}>Декабрь</div>
                </div>
                <div className={css.tr}>
                  <div
                    className={classnames({
                      [css.sprintBar]: true,
                      [css.finished]: true
                    })}
                    style={{ left: '13%', right: '83%' }}
                  />
                </div>
                <div className={css.tr}>
                  <div
                    className={classnames({
                      [css.sprintBar]: true,
                      [css.finished]: true
                    })}
                    style={{ left: '17%', right: '81%' }}
                  />
                </div>
                <div className={css.tr}>
                  <div
                    className={classnames({
                      [css.sprintBar]: true,
                      [css.active]: true
                    })}
                    style={{ left: '19%', right: '79%' }}
                  />
                </div>
                <div className={css.tr}>
                  <div
                    className={classnames({
                      [css.sprintBar]: true,
                      [css.future]: true
                    })}
                    style={{ left: '21%', right: '75%' }}
                  />
                </div>
                <div className={css.tr}>
                  <div
                    className={classnames({
                      [css.sprintBar]: true,
                      [css.future]: true
                    })}
                    style={{ left: '25%', right: '72%' }}
                  />
                </div>
                <div className={css.grid}>
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
                  <span />
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
  getPlanningTasks: PropTypes.func.isRequired,
  leftColumnTasks: PropTypes.array,
  openCreateTaskModal: PropTypes.func,
  project: PropTypes.object,
  rightColumnTasks: PropTypes.array,
  startTaskEditing: PropTypes.func
};

const mapStateToProps = state => ({
  project: state.Project.project,
  leftColumnTasks: state.PlanningTasks.leftColumnTasks,
  rightColumnTasks: state.PlanningTasks.rightColumnTasks,
  SprintIsEditing: state.Task.SprintIsEditing
});

const mapDispatchToProps = {
  getPlanningTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Planning);
