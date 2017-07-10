import React, {Component} from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';

import TaskCard from '../../../components/TaskCard';
import PhaseColumn from './PhaseColumn';
import SelectDropdown from '../../../components/SelectDropdown';
import { IconArrowDown, IconArrowRight } from '../../../components/Icons';
import * as css from './AgileBoard.scss';

import GetTasks from '../../../actions/Tasks';

const filterTasks = (array, sortedObject) => {
  array.forEach((element) => {
    switch (element.statusId) {
    case 1: sortedObject.new.push(element);
            break;
    case 2: sortedObject.dev.push(element);
            break;
    case 3: sortedObject.dev.push(element);
            break;
    case 4: sortedObject.codeReview.push(element);
            break;
    case 5: sortedObject.codeReview.push(element);
            break;
    case 6: sortedObject.qa.push(element);
            break;
    case 7: sortedObject.qa.push(element);
            break;
    case 8: sortedObject.done.push(element);
            break;
    default: break;
    }
  });
};

const sortTasks = (sortedObject, prefix, section) => {
  for (const key in sortedObject) {
    sortedObject[key].sort((a, b) => {
      if (a.priority > b.priority) return 1;
      if (a.priority < b.priority) return -1;
    });
    sortedObject[key] = sortedObject[key].map((task) => {
      return <TaskCard
        key={`task-${task.id}`}
        task={task}
        prefix={prefix}
        section={section}
      />;
    });
  }
};


class AgileBoard extends Component {

  constructor (props) {
    super(props);
    this.state = {
      isSectionOpen: {
        myTasks: false,
        allTasks: true
      },
      filterTags: [],
      changedSprint: 0
    };
  }

  toggleSection = (sectionName) => {
    const allSectionsStatus = this.state.isSectionOpen;
    this.setState({
      isSectionOpen: {
        ...allSectionsStatus,
        [sectionName]: !this.state.isSectionOpen[sectionName]
      }
    });
  }

  selectValue = (e, name) => {
    this.setState({[name]: e}, () => {
      this.props.GetTasks({
        projectId: this.props.project.Id,
        sprintId: this.state.changedSprint
      });
    });
  }

  dropTask = (taskId, section, phase) => {
    // let obj, task;

    // switch (section) {
    //   case 'mine':
    //     obj = mineSorted;
    //     break;
    //   case 'all':
    //     obj = allSorted;
    //     break;
    //   default:
    //     break;
    // }

    // for (const key in obj) {
    //   obj[key].forEach((element, i) => {
    //     if (element.props.task.id === taskId.id) {
    //       task = obj[key].splice(i, 1)[0];
    //     }
    //   });
    // }

    // task.props.task.stage = phase;

    // switch (phase) {
    //   case 'NEW':
    //     obj.new.push(task);
    //     break;
    //   case 'DEVELOP':
    //     obj.dev.push(task);
    //     break;
    //   case 'CODE_REVIEW':
    //     obj.codeReview.push(task);
    //     break;
    //   case 'QA':
    //     obj.qa.push(task);
    //     break;
    //   case 'DONE':
    //     obj.done.push(task);
    //     break;
    //   default:
    //     break;
    // }

    // this.forceUpdate();
  }

  getSprints = () => {
    let sprints = _.sortBy(this.props.sprints, sprint => {
      return new moment(sprint.factFinishDate);
    });

    sprints = sprints.map((sprint, i) => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${sprint.factFinishDate
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
    return sprints;
  };

  componentWillMount () {
    this.selectValue(0, 'changedSprint');
  }

  componentDidUpdate () {
    ReactTooltip.rebuild();
  }

  render () {
    const allSorted = {
      new: [],
      dev: [],
      codeReview: [],
      qa: [],
      done: []
    };

    filterTasks(this.props.sprintTasks, allSorted);
    sortTasks(allSorted, this.props.project.prefix, 'all');

    const mineSorted = {
      new: [],
      dev: [],
      codeReview: [],
      qa: [],
      done: []
    };

    const myTasks = this.props.sprintTasks.filter((task) => {
      // заменить на проверку id исполнителя
      return true;
    });

    filterTasks(myTasks, mineSorted);
    sortTasks(mineSorted, this.props.project.prefix, 'mine');

    return (
        <section className={css.agileBoard}>
          {/*<h2 style={{display: 'inline-block'}}>Спринт №1 (01.06.2017 - 30.06.2017)</h2>*/}
          <Row>
            <Col xs>
              <SelectDropdown
                name="changedSprint"
                placeholder="Введите название спринта..."
                multi={false}
                value={this.state.changedSprint}
                onChange={(e) => this.selectValue(e ? e.value : null, 'changedSprint')}
                noResultsText="Нет результатов"
                options={this.getSprints()}
              />
            </Col>
            <Col xs>
              <SelectDropdown
                name="filterTags"
                multi
                placeholder="Введите название тега..."
                backspaceToRemoveMessage="BackSpace для очистки поля"
                value={this.state.filterTags}
                onChange={(e) => this.selectValue(e, 'filterTags')}
                noResultsText="Нет результатов"
                options={[
                  {value: 'develop', label: 'develop'},
                  {value: 'frontend', label: 'frontend'},
                  {value: 'backend', label: 'backend'}
                ]}
              />
            </Col>
          </Row>
          <hr/>
          <h3 onClick={() => this.toggleSection('myTasks')} className={css.taskSectionTitle}>
            <IconArrowDown className={classnames({
              [css.close]: !this.state.isSectionOpen.myTasks,
              [css.open]: this.state.isSectionOpen.myTasks
            })} /> Мои задачи
          </h3>
          {
            this.state.isSectionOpen.myTasks
            ? <Row>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'New'} tasks={mineSorted.new}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Dev'} tasks={mineSorted.dev}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Code Review'} tasks={mineSorted.codeReview}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'QA'} tasks={mineSorted.qa}/>
                <PhaseColumn onDrop={this.dropTask} section={'mine'} title={'Done'} tasks={mineSorted.done}/>
              </Row>
            : null
          }
          <hr/>
          <h3 onClick={() => this.toggleSection('allTasks')} className={css.taskSectionTitle}>
            <IconArrowDown className={classnames({
              [css.close]: !this.state.isSectionOpen.allTasks,
              [css.open]: this.state.isSectionOpen.allTasks
            })} /> Все задачи
          </h3>
          {
            this.state.isSectionOpen.allTasks
            ? <Row>
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'New'} tasks={allSorted.new}/>
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Dev'} tasks={allSorted.dev} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Code Review'} tasks={allSorted.codeReview} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'QA'} tasks={allSorted.qa} />
                <PhaseColumn onDrop={this.dropTask} section={'all'} title={'Done'} tasks={allSorted.done} />
              </Row>
            : null
          }
          <hr/>
        </section>
    );
  }
}

AgileBoard.propTypes = {
  GetTasks: PropTypes.func.isRequired,
  project: PropTypes.object,
  sprintTasks: PropTypes.array,
  sprints: PropTypes.array
};

const mapStateToProps = state => ({
  sprintTasks: state.Tasks.tasks,
  sprints: state.Project.project.sprints,
  project: state.Project.project
});

const mapDispatchToProps = { GetTasks };

export default connect(mapStateToProps, mapDispatchToProps)(AgileBoard);
