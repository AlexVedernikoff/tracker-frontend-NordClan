import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';

import TaskRow from '../../../components/TaskRow';
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

import getTasks from '../../../actions/Tasks';

class TaskList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      ...this.initialFilters,
      activePage: 1
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
    typeIds: [],
    statusIds: [],
    filterByName: '',
    sprintId: null,
    performerId: null,
    filterTags: []
  }

  changeSprintFilter = (option) => {
    this.setState({
      sprintId: option ? option.value : null,
      activePage: 1
    }, this.loadTasks);
  }

  changePriorityFilter = (option) => {
    this.setState({
      prioritiesId: option ? option.prioritiesId : null,
      activePage: 1
    }, this.loadTasks);
  }

  changeNameFilter = event => {
    const value = event.target.value;

    this.setState(state => ({
      filterByName: value,
      activePage: state.filterByName !== value ? 1 : state.activePage
    }), this.loadTasks);
  };

  changeStatusFilter = (options) => {
    this.setState({
      statusIds: options.map(option => option.value),
      activePage: 1
    }, this.loadTasks);
  };

  changeTypeFilter = (options) => {
    this.setState({
      typeIds: options.map(option => option.value),
      activePage: 1
    }, this.loadTasks);
  };

  changePerformerFilter = (performer) => {
    const performerId = performer ? performer.value : 0;

    this.setState(state=> ({
      performerId,
      activePage: state.performerId !== performerId ? 1 : state.activePage
    }), this.loadTasks);
  }

  handlePaginationClick = e => {
    this.setState(
      {
        activePage: e.activePage
      },
      this.loadTasks
    );
  };

  loadTasks = (options = {}) => {
    const tags = this.state.filterTags.map(el => el.value).join(',');
    const statusId = this.state.statusIds.join(',');
    const typeId = this.state.typeIds.join(',');
    this.props.getTasks({
      projectId: this.props.project.id,
      performerId: this.state.performerId,
      currentPage: this.state.activePage,
      prioritiesId: this.state.prioritiesId,
      pageSize: 50,
      name: this.state.filterByName,
      statusId,
      tags,
      typeId,
      sprintId: this.state.sprintId,
      ...options
    });
  }

  onTagSelect = (tags) => {
    this.setState({
      filterTags: tags
    }, this.loadTasks);
  };

  onClickTag = (tag) => {
    this.setState(state => ({
      filterTags: _.uniqBy(state.filterTags.concat({
        value: tag,
        label: tag
      }), 'value')
    }), this.loadTasks);
  };

  clearFilters = () => {
    this.setState(this.initialFilters, this.loadTasks);
  }

  createOptions = (array) => {
    return array.map(
      element => ({
        value: element.id,
        label: element.name
      })
    );
  }

  render () {
    const {
      tasksList: tasks,
      statuses,
      taskTypes,
      project
    } = this.props;

    const {
      prioritiesId,
      typeIds,
      statusIds,
      filterByName,
      sprintId,
      performerId,
      filterTags
    } = this.state;

    const statusOptions = this.createOptions(statuses);
    const typeOptions = this.createOptions(taskTypes);

    const isFilter
      = prioritiesId
      || typeIds.length
      || statusIds.length
      || filterByName
      || sprintId
      || performerId
      || filterTags.length;

    return (
      <div>
        <section>
          <div className={css.filters}>
            <Row className={css.search} top="xs">
              <Col xs={12} sm={3} className={css.priorityFilter}>
                <Priority onChange={this.changePriorityFilter} priority={prioritiesId}/>
              </Col>
              <Col smOffset={6} xs={12} sm={3} className={css.clearFilters}>
                <Button text="Очистить фильтры" icon="IconClose" disabled={!isFilter} type="primary" onClick={this.clearFilters}/>
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
                  value={typeIds}
                  options={typeOptions}
                  onChange={this.changeTypeFilter}
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
                  value={statusIds}
                  options={statusOptions}
                  onChange={this.changeStatusFilter}
                />
              </Col>
              <Col xs={12} sm={6}>
                <SprintSelector
                  value={sprintId}
                  sprints={project.sprints}
                  onChange={this.changeSprintFilter}
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
                  onPerformerSelect={this.changePerformerFilter}
                  selectedPerformerId={performerId}
                />
              </Col>
              <Col xs={12} sm={3}>
                <TagsFilter
                  filterFor={'task'}
                  onTagSelect={this.onTagSelect}
                  filterTags={filterTags}
                />
              </Col>
            </Row>
          </div>
          {
            tasks.map((task) => {
              return <TaskRow
                key={`task-${task.id}`}
                task={task}
                prefix={project.prefix}
                onClickTag={this.onClickTag}
              />;
            })
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
      </div>
    );
  }
}

TaskList.propTypes = {
  getTasks: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  project: PropTypes.object.isRequired,
  statuses: PropTypes.array,
  taskTypes: PropTypes.array,
  tasksList: PropTypes.array.isRequired
};


const mapStateToProps = state => ({
  tasksList: state.Tasks.tasks,
  pagesCount: state.Tasks.pagesCount,
  project: state.Project.project,
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: state.Dictionaries.taskTypes
});

const mapDispatchToProps = { getTasks };

export default connect(mapStateToProps, mapDispatchToProps)(TaskList);

