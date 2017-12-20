import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import TaskRow from '../../../components/TaskRow';
import InlineHolder from '../../../components/InlineHolder';
import Priority from '../../../components/Priority';
import Button from '../../../components/Button';
import SprintSelector from '../../../components/SprintSelector';
import SelectDropdown from '../../../components/SelectDropdown';
import Input from '../../../components/Input';
import Pagination from '../../../components/Pagination';
import * as css from './TaskList.scss';
import TagsFilter from '../../../components/TagsFilter';
import PerformerFilter from '../../../components/PerformerFilter';
import _ from 'lodash';
import PerformerModal from '../../../components/PerformerModal';
import SprintModal from '../../../components/SprintModal';
import getTasks from '../../../actions/Tasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';

class TaskList extends Component {

  constructor (props) {
    super(props);
    const projectId = this.props.params.projectId;
    this.state = {
      ...this.initialFilters,
      activePage: 1,
      isPerformerModalOpen: false,
      isSprintModalOpen: false,
      changedFilters: {
        projectId
      }
    };
  }

  componentDidMount () {
    if (this.props.project.id) {
      this.loadTasks();
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.project.id !== nextProps.project.id) {
      this.loadTasks({
        projectId: nextProps.project.id
      });
    }
  }

  initialFilters = {
    prioritiesId: null,
    typeId: [],
    statusId: [],
    filterByName: '',
    sprintId: null,
    performerId: null,
    authorId: null,
    tags: [],
    changedFilters: {}
  }

  openSprintModal = (taskId, sprintId) =>{
    this.setState({
      isSprintModalOpen: true,
      sprintId: sprintId,
      changedTask: taskId
    });
  }

  closeSprintModal = () => {
    this.setState({ isSprintModalOpen: false });
  }

  changeSprint = (sprintId) => {
    this.props.changeTask({
      id: this.state.changedTask,
      sprintId: sprintId
    }, 'Sprint');
    this.props.startTaskEditing('Sprint');
    this.closeSprintModal();
  }

  openPerformerModal = (taskId, performerId) => {
    this.setState({
      isPerformerModalOpen: true,
      performer: performerId,
      changedTask: taskId
    });
  }

  closePerformerModal = () => {
    this.setState({ isPerformerModalOpen: false });
  }

  changePerformer = (performerId) => {
    this.props.changeTask({
      id: this.state.changedTask,
      performerId: performerId
    }, 'User');
    this.props.startTaskEditing('User');
    this.closePerformerModal();
  };

  getUsers = () => {
    return this.props.project.users.map((user) => ({
      value: user.id,
      label: user.fullNameRu
    }));
  }

  changeSingleFilter = (option, name) => {

    this.setState(state => {

      const filterValue = option ? option.value : null;
      const changedFilters = state.changedFilters;
      if (~[null, [], undefined, ''].indexOf(filterValue)) {
        delete changedFilters[name];
      } else {
        changedFilters[name] = filterValue;
      }

      const newState = {
        [name]: filterValue,
        activePage: state[name] !== filterValue ? 1 : state.activePage,
        changedFilters
      };

      return newState;

    }, this.loadTasks);
  }

  changeMultiFilter = (options, name) => {

    this.setState(state => {

      const filterValue = options.map(option => option.value);
      const changedFilters = state.changedFilters;
      if (filterValue.length) {
        changedFilters[name] = filterValue;
      } else {
        delete changedFilters[name];
      }

      const newState = {
        [name]: filterValue,
        activePage: state[name].length !== filterValue.length ? 1 : state.activePage,
        changedFilters
      };

      return newState;

    }, this.loadTasks);
  }

  changeNameFilter = event => {

    const value = event.target.value;

    this.setState(state => {

      const changedFilters = state.changedFilters;
      if (value) {
        changedFilters.name = value;
      } else {
        delete changedFilters.name;
      }

      const newState = {
        filterByName: value,
        activePage: state.filterByName !== value ? 1 : state.activePage,
        changedFilters
      };

      return newState;
    }, this.loadTasks);
  };

  onClickTag = (tag) => {
    const sortedTags = _.uniqBy(this.state.tags.concat({
      value: tag,
      label: tag
    }), 'value');

    this.setState(state => ({
      tags: sortedTags,
      changedFilters: {
        ...state.changedFilters,
        tags: sortedTags.map(el => el.value).join(',')
      }
    }), this.loadTasks);
  };

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      this.loadTasks
    );
  };

  loadTasks = () => {
    this.props.getTasks(this.state.changedFilters, true);
  }

  clearFilters = () => {
    this.setState(this.initialFilters, this.loadTasks);
  }

  createOptions = (array, labelField = 'name') => {
    return array.map(
      element => ({
        value: element.id,
        label: element[labelField]
      })
    );
  }

  render () {
    const {
      tasksList: tasks,
      statuses,
      taskTypes,
      project,
      isReceiving
    } = this.props;

    const {
      prioritiesId,
      typeId,
      statusId,
      sprintId,
      performerId,
      authorId,
      tags
    } = this.state;
    const statusOptions = this.createOptions(statuses);
    const typeOptions = this.createOptions(taskTypes);
    const authorOptions = this.createOptions(project.users, 'fullNameRu');
    const isFilter = Object.keys(this.state.changedFilters).length;
    const isLoading = isReceiving && !tasks.length;
    const taskHolder
      = <div style={{marginBottom: '1rem'}}>
      <hr style={{margin: '0 0 1rem 0'}}/>
      <Row>
        <Col xs={12} sm={6}>
          <InlineHolder length="80%"/>
          <InlineHolder length="50%"/>
        </Col>
        <Col xs={12} sm>
          <InlineHolder length="50%"/>
          <InlineHolder length="70%"/>
          <InlineHolder length="30%"/>
        </Col>
        <Col xs>
          <InlineHolder length="20%"/>
          <InlineHolder length="20%"/>
        </Col>
      </Row>
    </div>;

    return (
      <div>
        <section>
          <div className={css.filters}>
            <Row className={css.search} top="xs">
              <Col xs={12} sm={3} className={css.priorityFilter}>
                <Priority
                  onChange={(option) => this.changeSingleFilter(option, 'prioritiesId')}
                  priority={prioritiesId}
                />
              </Col>
              <Col smOffset={6} xs={12} sm={3} className={css.clearFilters}>
                <Button
                  type="primary"
                  text="Очистить фильтры"
                  icon="IconClose"
                  disabled={!isFilter}
                  onClick={this.clearFilters}
                />
              </Col>
            </Row>
            <Row className={css.search} top="xs">
              <Col xs={12} sm={3}>
                <SelectDropdown
                  name="type"
                  placeholder="Тип задачи"
                  multi
                  noResultsText="Нет подходящих типов"
                  backspaceToRemoveMessage={''}
                  clearAllText="Очистить все"
                  value={typeId}
                  options={typeOptions}
                  onChange={(options) => this.changeMultiFilter(options, 'typeId')}
                />
              </Col>
              <Col xs={12} sm={3}>
                <SelectDropdown
                  name="status"
                  placeholder="Стадия задачи"
                  multi
                  noResultsText="Нет подходящих статусов"
                  backspaceToRemoveMessage={''}
                  clearAllText="Очистить все"
                  value={statusId}
                  options={statusOptions}
                  onChange={(options) => this.changeMultiFilter(options, 'statusId')}
                />
              </Col>
              <Col xs={12} sm={3}>
                <SelectDropdown
                  name="author"
                  placeholder="Автор"
                  multi={false}
                  value={authorId}
                  onChange={(option) => this.changeSingleFilter(option, 'authorId')}
                  noResultsText="Нет результатов"
                  options={authorOptions}
                />
              </Col>
              <Col xs={12} sm={3}>
                <SprintSelector
                  value={sprintId}
                  sprints={project.sprints}
                  onChange={(option) => this.changeSingleFilter(option, 'sprintId')}
                />
              </Col>
            </Row>

            <Row className={css.search}>
              <Col xs={12} sm={6}>
                <Input
                  placeholder="Название задачи"
                  onChange={this.changeNameFilter}
                />
              </Col>
              <Col xs={12} sm={3}>
                <PerformerFilter
                  onPerformerSelect={(option) => this.changeSingleFilter(option, 'performerId')}
                  selectedPerformerId={performerId}
                />
              </Col>
              <Col xs={12} sm={3}>
                <TagsFilter
                  filterFor={'task'}
                  onTagSelect={(options) => this.changeMultiFilter(options, 'tags')}
                  filterTags={tags}
                />
              </Col>
            </Row>
          </div>

          {
            isLoading
            ? taskHolder
            : tasks.map((task) =>
                <TaskRow
                  key={`task-${task.id}`}
                  task={task}
                  prefix={project.prefix}
                  onClickTag={this.onClickTag}
                  onOpenPerformerModal={this.openPerformerModal}
                  onOpenSprintModal={this.openSprintModal}
                />
              )
          }

          <hr/>
          { this.props.pagesCount > 1
            ? <Pagination
              itemsCount={this.props.pagesCount}
              activePage={this.state.activePage}
              onItemClick={this.handlePaginationClick}
            />
            : null
          }
        </section>
        {
          this.state.isPerformerModalOpen
          ? <PerformerModal
              defaultUser={this.state.performer}
              onChoose={this.changePerformer}
              onClose={this.closePerformerModal}
              title="Изменить исполнителя задачи"
              users={this.getUsers()}
            />
          : null
        }
        {
          this.state.isSprintModalOpen
          ? <SprintModal
              defaultSprint={this.state.sprintId}
              onChoose={this.changeSprint}
              onClose={this.closeSprintModal}
              title="Изменить спринт задачи"
              sprints={this.props.project.sprints}
            />
          : null
        }
      </div>
    );
  }
}

TaskList.propTypes = {
  getTasks: PropTypes.func.isRequired,
  isReceiving: PropTypes.bool,
  pagesCount: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  statuses: PropTypes.array,
  taskTypes: PropTypes.array,
  tasksList: PropTypes.array.isRequired,
  changeTask: PropTypes.func.isRequired,
  startTaskEditing: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tasksList: state.TaskList.tasks,
  pagesCount: state.TaskList.pagesCount,
  isReceiving: state.TaskList.isReceiving,
  project: state.Project.project,
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: state.Dictionaries.taskTypes
});

const mapDispatchToProps = { getTasks, startTaskEditing, changeTask };

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

