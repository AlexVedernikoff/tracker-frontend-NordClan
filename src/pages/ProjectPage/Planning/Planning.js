import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import GanttChart from './GanttChart';
import classnames from 'classnames';
import CreateTask from '../CreateTask';
import * as css from './Planning.scss';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import DraggableTaskRow from './DraggableTaskRow';
import Button from '../../../components/Button';
import SelectDropdown from '../../../components/SelectDropdown';
import SprintColumn from './SprintColumn';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';

import getPlanningTasks from '../../../actions/PlanningTasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import {
  openCreateTaskModal,
  closeCreateTaskModal
} from '../../../actions/Project';

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

  componentWillMount () {
    this.selectValue(0, 'leftColumn');
    //this.selectValue({value: this.props.project.sprints[0].id}, 'rightColumn');
  }

  componentWillReceiveProps (nextProps) {
    if (!nextProps.SprintIsEditing && this.props.SprintIsEditing) {
      this.selectValue(this.state.leftColumn, 'leftColumn');
      this.selectValue(this.state.rightColumn, 'rightColumn');
    }
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  setCallee (callee) {
    this.setState({
      createTaskCallee: callee
    });
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
        [css.INPROGRESS]: sprint.statusId === 1,
        [css.sprintMarker]: true,
        [css.FINISHED]: sprint.statusId === 2
      })
    }));

    sprints.push({
      value: 0,
      label: 'Backlog',
      className: classnames({
        [css.INPROGRESS]: true,
        [css.sprintMarker]: true
      })
    });

    sprints.forEach(sprint => {
      sprint.disabled = sprint.value === this.state[secondColumn];
    });

    return sprints;
  };

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

  handleModal = event => {
    const {
      isCreateTaskModalOpen,
      openCreateTaskModal,
      closeCreateTaskModal
    } = this.props;
    if (isCreateTaskModalOpen) {
      // this.setState({
      //   projectName: '',
      //   projectPrefix: '',
      //   selectedPortfolio: null
      // });
      closeCreateTaskModal();
    } else {
      this.setCallee(event.target.name);
      openCreateTaskModal();
    }
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
                  onClick={this.handleModal}
                  type="bordered"
                  text="Создать задачу"
                  icon="IconPlus"
                  name="left"
                  style={{ marginLeft: 16 }}
                />
              </div>
              <div
                className={css.progressBarWrapper}
                data-tip="Суммарное время задач: 795 ч. из 500"
              >
                <div
                  className={classnames({
                    [css.progressBar]: true,
                    [css.exceeded]: true
                  })}
                  style={{ width: '100%' }}
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
                  onClick={this.handleModal}
                  type="bordered"
                  text="Создать задачу"
                  icon="IconPlus"
                  name="right"
                  style={{ marginLeft: 16 }}
                />
              </div>
              <div
                className={css.progressBarWrapper}
                data-tip="Суммарное время задач: 257 ч. из 500"
              >
                <div
                  className={classnames({
                    [css.progressBar]: true,
                    [css.exceeded]: false
                  })}
                  style={{ width: '58%' }}
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
        <GanttChart />
        <CreateTask
          isOpen={this.props.isCreateTaskModalOpen}
          onRequestClose={this.handleModal}
          optionsList={rightColumnSprints}
          selectedSprintValue={
            this.state.createTaskCallee === 'left'
              ? this.state.leftColumn
              : this.state.rightColumn
          }
          project={this.props.project}
        />
      </div>
    );
  }
}

Planning.propTypes = {
  SprintIsEditing: PropTypes.bool,
  changeTask: PropTypes.func.isRequired,
  closeCreateTaskModal: PropTypes.func,
  getPlanningTasks: PropTypes.func.isRequired,
  isCreateTaskModalOpen: PropTypes.bool,
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
  SprintIsEditing: state.Task.SprintIsEditing,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen
});

const mapDispatchToProps = {
  getPlanningTasks,
  changeTask,
  startTaskEditing,
  openCreateTaskModal,
  closeCreateTaskModal
};

export default connect(mapStateToProps, mapDispatchToProps)(Planning);
