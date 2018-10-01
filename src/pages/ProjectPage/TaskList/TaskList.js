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
import { EXTERNAL_USER } from '../../../constants/Roles';
import uniqBy from 'lodash/uniqBy';
import PerformerModal from '../../../components/PerformerModal';
import SprintModal from '../../../components/SprintModal';
import getTasks from '../../../actions/Tasks';
import { history } from '../../../History';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import DatepickerDropdown from '../../../components/DatepickerDropdown';
import moment from 'moment';
import CreateTaskModal from '../../../components/CreateTaskModal';
import { openCreateTaskModal } from '../../../actions/Project';
import localize from './taskList.json';
import { getFullName, getDictionaryName } from '../../../utils/NameLocalisation';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses } from '../../../selectors/dictionaries';

const dateFormat = 'DD.MM.YYYY';

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePage: 1,
      isPerformerModalOpen: false,
      isSprintModalOpen: false,
      ...this.getQueryFilters()
    };
  }

  componentDidMount() {
    if (this.props.project.id) {
      this.loadTasks();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.project.id !== nextProps.project.id) {
      this.loadTasks();
    }

    if (this.props.lastCreatedTask !== nextProps.lastCreatedTask && nextProps.project.id) {
      this.loadTasks();
    }
  }

  translateToNumIfNeeded = value => {
    const re = /^\d+$/;
    return re.test(value) ? +value : value;
  };

  multipleQueries = queries => {
    if (Array.isArray(queries)) return queries.map(queryValue => this.translateToNumIfNeeded(queryValue));
    return queries ? [this.translateToNumIfNeeded(queries)] : [];
  };

  singleQuery = currentQuery => {
    return currentQuery ? this.translateToNumIfNeeded(currentQuery) : null;
  };

  makeFiltersObject = (name, value) => {
    if (!!value && !Array.isArray(value)) {
      return { [name]: this.singleQuery(value) };
    }
    if (!!value && Array.isArray(value)) {
      return { [name]: this.multipleQueries(value) };
    }
  };

  getUrlQueries = () => {
    const {
      performerId,
      sprintId,
      statusId,
      name,
      authorId,
      prioritiesId,
      typeId,
      tags,
      isOnlyMine,
      changedSprint,
      dateFrom,
      dateTo
    } = (this.props.location && this.props.location.query) || {};

    return {
      ...this.makeFiltersObject('performerId', performerId),
      ...this.makeFiltersObject('sprintId', sprintId),
      ...this.makeFiltersObject('name', name),
      ...this.makeFiltersObject('authorId', authorId),
      ...this.makeFiltersObject('prioritiesId', prioritiesId),
      ...this.makeFiltersObject('tags', tags),
      ...this.makeFiltersObject('typeId', typeId),
      ...this.makeFiltersObject('isOnlyMine', isOnlyMine),
      ...this.makeFiltersObject('changedSprint', changedSprint),
      ...this.makeFiltersObject('statusId', statusId),
      ...this.makeFiltersObject('dateFrom', dateFrom),
      ...this.makeFiltersObject('dateTo', dateTo)
    };
  };

  getQueryFilters() {
    const projectId = this.props.params.projectId;

    return {
      changedFilters: {
        projectId,
        ...this.getUrlQueries()
      }
    };
  }

  changeUrl(changedFilters) {
    const query = {};

    for (const [key, value] of Object.entries(changedFilters)) {
      if (value && key !== 'projectId') {
        query[key] = value;
      }
    }

    history.replace({
      ...this.props.location,
      query
    });
  }

  openSprintModal = (taskId, sprintId) => {
    this.setState({
      isSprintModalOpen: true,
      sprintId: sprintId,
      changedTask: taskId
    });
  };

  closeSprintModal = () => {
    this.setState({ isSprintModalOpen: false });
  };

  changeSprint = sprintId => {
    this.props.changeTask(
      {
        id: this.state.changedTask,
        sprintId: sprintId
      },
      'Sprint',
      this.loadTasks
    );
    this.closeSprintModal();
  };

  openPerformerModal = (taskId, performerId) => {
    this.setState({
      isPerformerModalOpen: true,
      performer: performerId,
      changedTask: taskId
    });
  };

  closePerformerModal = performerId => {
    if (performerId === 0) {
      this.changePerformer(performerId);
    } else {
      this.setState({ isPerformerModalOpen: false });
    }
  };

  changePerformer = performerId => {
    this.props.changeTask(
      {
        id: this.state.changedTask,
        performerId: performerId
      },
      'User',
      this.loadTasks
    );
    this.closePerformerModal();
  };

  getUsers = () => {
    return this.props.project.users.map(user => ({
      value: user.id,
      label: getFullName(user)
    }));
  };

  changeSingleFilter = (option, name) => {
    this.setState(state => {
      let filterValue = option ? option.value : null;
      const changedFilters = { ...state.changedFilters };
      if (name === 'prioritiesId') {
        filterValue = option.prioritiesId;
      }

      if (name === 'performerId') {
        filterValue = option.map(singleValue => singleValue.value);
      }

      if (~[null, [], undefined, ''].indexOf(filterValue)) {
        delete changedFilters[name];
      } else {
        changedFilters[name] = filterValue;
      }

      this.changeUrl(changedFilters);

      return {
        activePage: state[name] !== filterValue ? 1 : state.activePage,
        changedFilters
      };
    }, this.loadTasks);
  };

  changeMultiFilter = (options, name) => {
    this.setState(state => {
      const filterValue = options.map(option => option.value);
      const changedFilters = { ...state.changedFilters };

      if (filterValue.length) {
        changedFilters[name] = filterValue;
      } else {
        delete changedFilters[name];
      }

      this.changeUrl(changedFilters);

      return {
        activePage:
          state.changedFilters[name] && state.changedFilters[name].length !== filterValue.length ? 1 : state.activePage,
        changedFilters
      };
    }, this.loadTasks);
  };

  changeNameFilter = event => {
    const value = event.target.value;

    this.setState(state => {
      const changedFilters = state.changedFilters;
      if (value) {
        changedFilters.name = value;
      } else {
        delete changedFilters.name;
      }

      this.changeUrl(changedFilters);

      return {
        activePage: state.filterByName !== value ? 1 : state.activePage,
        changedFilters
      };
    }, this.loadTasks);
  };

  onClickTag = tag => {
    const sortedTags = uniqBy(
      this.state.tags.concat({
        value: tag,
        label: tag
      }),
      'value'
    );

    this.setState(
      state => ({
        tags: sortedTags,
        changedFilters: {
          ...state.changedFilters,
          tags: sortedTags.map(el => el.value).join(',')
        }
      }),
      this.loadTasks
    );
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
    this.props.getTasks(
      { ...this.state.changedFilters, allStatuses: true, currentPage: this.state.activePage, pageSize: 25 },
      true
    );
  };

  clearFilters = () => {
    this.setState(
      {
        changedFilters: {
          projectId: this.props.params.projectId
        }
      },
      this.loadTasks
    );
    this.changeUrl({});
  };

  createOptions = (array, labelField = 'name') => {
    return array.map(element => ({
      value: element.id,
      label: labelField === 'name' ? getDictionaryName(element) : getFullName(element)
    }));
  };

  handleDayChange(value, name) {
    this.setState(state => {
      const changedFilters = { ...this.state.changedFilters };

      if (value) {
        changedFilters[name] = this.formatDate(value);
      } else {
        delete changedFilters[name];
      }

      this.changeUrl(changedFilters);

      return { changedFilters };
    }, this.loadTasks);
  }

  formatDate = date => date && moment(date).format(dateFormat);

  onChangePrioritiesFilter = option => this.changeSingleFilter(option, 'prioritiesId');
  onChangeTypeFilter = options => this.changeMultiFilter(options, 'typeId');
  onChangeStatusFilter = options => this.changeMultiFilter(options, 'statusId');
  onChangeAuthorFilter = option => this.changeSingleFilter(option, 'authorId');
  onChangeSprintFilter = options => this.changeMultiFilter(options, 'sprintId');
  onChangeDateFromFilter = option => this.handleDayChange(option, 'dateFrom');
  onChangeDateToFilter = option => this.handleDayChange(option, 'dateTo');
  onChangePerformerFilter = option => this.changeSingleFilter(option, 'performerId');
  onChangeTagFilter = options => this.changeMultiFilter(options, 'tags');

  render() {
    const { tasksList: tasks, statuses, taskTypes, project, isReceiving, lang } = this.props;

    const { prioritiesId, typeId, statusId, sprintId, performerId, authorId, tags } = this.state.changedFilters;

    const statusOptions = this.createOptions(statuses);
    const typeOptions = this.createOptions(taskTypes);
    const authorOptions = this.createOptions(project.users, 'fullNameRu');
    const isFilter = Object.keys(this.state.changedFilters).length > 1;
    const isLoading = isReceiving && !tasks.length;
    const isExternal = this.props.globalRole === EXTERNAL_USER;
    const singleSprint = Array.isArray(sprintId) ? (sprintId.length === 1 ? sprintId[0] : null) : sprintId;
    const taskHolder = (
      <div style={{ marginBottom: '1rem' }}>
        <hr style={{ margin: '0 0 1rem 0' }} />
        <Row>
          <Col xs={12} sm={6}>
            <InlineHolder length="80%" />
            <InlineHolder length="50%" />
          </Col>
          <Col xs={12} sm>
            <InlineHolder length="50%" />
            <InlineHolder length="70%" />
            <InlineHolder length="30%" />
          </Col>
          <Col xs>
            <InlineHolder length="20%" />
            <InlineHolder length="20%" />
          </Col>
        </Row>
      </div>
    );

    return (
      <div>
        <section>
          <div className={css.filters}>
            <Row className={css.search} top="xs">
              <Col xs={12} sm={3} className={css.priorityFilter}>
                <Priority onChange={this.onChangePrioritiesFilter} priority={prioritiesId} canEdit />
              </Col>
              <Col smOffset={4} xs={12} sm={5} className={css.clearFilters}>
                <Button
                  onClick={this.props.openCreateTaskModal}
                  type="primary"
                  text={localize[lang].CREATE_TASK}
                  icon="IconPlus"
                  name="right"
                />
                <Button
                  type="primary"
                  text={localize[lang].CLEAR_FILTERS}
                  icon="IconBroom"
                  disabled={!isFilter}
                  onClick={this.clearFilters}
                />
              </Col>
            </Row>
            <Row className={css.search} top="xs">
              <Col xs={12} sm={3}>
                <SelectDropdown
                  name="type"
                  placeholder={localize[lang].SELECT_TYPE_TASK}
                  multi
                  noResultsText={localize[lang].SELECT_TYPE_TASK_EMPTY}
                  backspaceToRemoveMessage={''}
                  clearAllText={localize[lang].CLEAR_ALL}
                  value={typeId}
                  options={typeOptions}
                  onChange={this.onChangeTypeFilter}
                />
              </Col>
              <Col xs={12} sm={3}>
                <SelectDropdown
                  name="status"
                  placeholder={localize[lang].SELECT_STATUS_TASK}
                  multi
                  noResultsText={localize[lang].NO_MATCH_STATUS}
                  backspaceToRemoveMessage={''}
                  clearAllText={localize[lang].CLEAR_ALL}
                  value={statusId}
                  options={statusOptions}
                  onChange={this.onChangeStatusFilter}
                />
              </Col>
              <Col xs={12} sm={3}>
                <SelectDropdown
                  name="author"
                  placeholder={localize[lang].SELECT_AUTHOR_TASK}
                  multi={false}
                  value={authorId}
                  onChange={this.onChangeAuthorFilter}
                  noResultsText={localize[lang].NO_RESULTS}
                  options={authorOptions}
                />
              </Col>
              <Col xs={12} sm={3}>
                <SprintSelector
                  value={sprintId}
                  sprints={project.sprints}
                  onChange={this.onChangeSprintFilter}
                  multi
                  useId
                />
              </Col>
            </Row>
            <Row className={css.search}>
              <Col xs={6} sm={3}>
                <DatepickerDropdown
                  name="dateFrom"
                  value={this.state.changedFilters ? this.state.changedFilters.dateFrom : ''}
                  disabledDataRanges={[
                    {
                      after:
                        (this.state.changedFilters.dateTo &&
                          moment(this.state.changedFilters.dateTo, dateFormat).toDate()) ||
                        new Date()
                    }
                  ]}
                  onDayChange={this.onChangeDateFromFilter}
                  placeholder={localize[lang].FROM}
                  format={dateFormat}
                />
              </Col>
              <Col xs={6} sm={3}>
                <DatepickerDropdown
                  name="dateTo"
                  value={this.state.changedFilters ? this.state.changedFilters.dateTo : ''}
                  onDayChange={this.onChangeDateToFilter}
                  disabledDataRanges={[
                    {
                      before:
                        this.state.changedFilters.dateFrom &&
                        moment(this.state.changedFilters.dateFrom, dateFormat).toDate(),
                      after: new Date()
                    }
                  ]}
                  placeholder={localize[lang].TO}
                  format={dateFormat}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Input
                  placeholder={localize[lang].ENTER_TITLE_TASK}
                  value={this.state.changedFilters.name || ''}
                  onChange={this.changeNameFilter}
                />
              </Col>
            </Row>
            <Row className={css.search}>
              <Col xs={12} sm={3}>
                <PerformerFilter onPerformerSelect={this.onChangePerformerFilter} selectedPerformerId={performerId} />
              </Col>
              <Col xs={12} sm={3}>
                <TagsFilter filterFor={'task'} onTagSelect={this.onChangeTagFilter} filterTags={tags} />
              </Col>
            </Row>
          </div>

          {isLoading
            ? taskHolder
            : tasks.map(task => (
                <TaskRow
                  key={`task-${task.id}`}
                  task={task}
                  prefix={project.prefix}
                  onClickTag={this.onClickTag}
                  onOpenPerformerModal={this.openPerformerModal}
                  onOpenSprintModal={this.openSprintModal}
                  isExternal={isExternal}
                />
              ))}
          {!isLoading && tasks.length === 0 ? <div className={css.notFound}>Ничего не найдено</div> : null}
          {this.props.pagesCount > 1 ? (
            <Pagination
              itemsCount={this.props.pagesCount}
              activePage={this.state.activePage}
              onItemClick={this.handlePaginationClick}
            />
          ) : null}
        </section>
        {this.state.isPerformerModalOpen ? (
          <PerformerModal
            defaultUser={this.state.performer}
            onChoose={this.changePerformer}
            onClose={this.closePerformerModal}
            title={localize[lang].EDIT_TASK_PERFORMER}
            users={this.getUsers()}
          />
        ) : null}
        {this.state.isSprintModalOpen ? (
          <SprintModal
            defaultSprint={this.state.sprintId}
            onChoose={this.changeSprint}
            onClose={this.closeSprintModal}
            title={localize[lang].EDIT_TASK_SPRINT}
            sprints={this.props.project.sprints}
          />
        ) : null}
        {this.props.isCreateTaskModalOpen ? (
          <CreateTaskModal
            selectedSprintValue={singleSprint}
            project={this.props.project}
            defaultPerformerId={performerId}
          />
        ) : null}
      </div>
    );
  }
}

TaskList.propTypes = {
  changeTask: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  globalRole: PropTypes.string,
  isCreateTaskModalOpen: PropTypes.bool,
  isReceiving: PropTypes.bool,
  lastCreatedTask: PropTypes.object,
  location: PropTypes.object,
  openCreateTaskModal: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  params: PropTypes.object,
  project: PropTypes.object.isRequired,
  startTaskEditing: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  taskTypes: PropTypes.array,
  tasksList: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  lastCreatedTask: state.Project.lastCreatedTask,
  globalRole: state.Auth.user.globalRole,
  tasksList: state.TaskList.tasks,
  pagesCount: state.TaskList.pagesCount,
  isReceiving: state.TaskList.isReceiving,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  project: state.Project.project,
  statuses: getLocalizedTaskStatuses(state),
  taskTypes: getLocalizedTaskTypes(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = { getTasks, startTaskEditing, changeTask, openCreateTaskModal };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
