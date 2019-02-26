import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import moment from 'moment';
import { uniqBy, debounce } from 'lodash';
import ReactTooltip from 'react-tooltip';

import TaskRow from '../../../components/TaskRow';
import InlineHolder from '../../../components/InlineHolder';
import Priority from '../../../components/Priority';
import Button from '../../../components/Button';
import SprintSelector from '../../../components/SprintSelector';
import SelectDropdown from '../../../components/SelectDropdown';
import Input from '../../../components/Input';
import Pagination from '../../../components/Pagination';
import TagsFilter from '../../../components/TagsFilter';
import PerformerFilter from '../../../components/PerformerFilter';
import CollapsibleRow from '../../../components/CollapsibleRow';
import { EXTERNAL_USER } from '../../../constants/Roles';
import PerformerModal from '../../../components/PerformerModal';
import SprintModal from '../../../components/SprintModal';
import DatepickerDropdown from '../../../components/DatepickerDropdown';
import CreateTaskModal from '../../../components/CreateTaskModal';
import Tag from '../../../components/Tag';
import getPriorityById from '../../../utils/TaskPriority';

import { getFullName, getDictionaryName } from '../../../utils/NameLocalisation';
import { removeNumChars } from '../../../utils/formatter';
import { openCreateTaskModal } from '../../../actions/Project';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses } from '../../../selectors/dictionaries';
import getSortedSprints from '../../../selectors/sprints';
import { history } from '../../../History';
import getTasks from '../../../actions/Tasks';
import * as css from './TaskList.scss';
import localize from './taskList.json';
import { BACKLOG_ID } from '../../../constants/Sprint';
import { IN_PROGRESS } from '../../../constants/SprintStatuses';
import ScrollTop from '../../../components/ScrollTop';
import layoutAgnosticFilter from '../../../utils/layoutAgnosticFilter';

const dateFormat = 'DD.MM.YYYY';

export const emptyFilters = {};

class TaskList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      isProjectLoaded: false,
      allFilters: [],
      activePage: 1,
      isPerformerModalOpen: false,
      isSprintModalOpen: false,
      nameInputValue: null,
      ...this.getQueryFilters()
    };
    this.debouncedSubmitNameFilter = debounce(this.submitNameFilter, 1000);
  }

  componentDidMount() {
    if (this.props.project.id) {
      this.loadTasks();
    }
    if (this.props.isReceiving) {
      this.setBacklogSprintIfNoActiveSprints();
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

  componentDidUpdate(prevProps) {
    if (prevProps.isProjectReceiving && !this.props.isProjectReceiving && !this.state.isProjectLoaded) {
      this.setProjectLoadedFlag();
      this.setBacklogSprintIfNoActiveSprints();
    }
  }

  componentWillUnmount() {
    this.debouncedSubmitNameFilter.cancel();
  }

  setProjectLoadedFlag = () => {
    this.setState(
      {
        isProjectLoaded: true
      },
      this.updateFilterList
    );
  };

  setBacklogSprintIfNoActiveSprints() {
    const hasActiveSprints =
      this.props.project.sprints && this.props.project.sprints.find(sprint => sprint.statusId === IN_PROGRESS);

    if (!hasActiveSprints) {
      const backlog = this.props.sprints.find(sprint => sprint.value === BACKLOG_ID);
      const backlogAlreadySelected = this.state.changedFilters.sprintId.some(value => value === BACKLOG_ID);

      if (backlog && !backlogAlreadySelected) {
        const changedFiltersSprint = this.state.changedFilters.sprintId.map(value => ({ value }));

        this.onChangeSprintFilter([...changedFiltersSprint, backlog]);
      }
    }
  }

  translateToNumIfNeeded = value => {
    const re = /^\d+$/;
    return re.test(value) ? +value : value;
  };

  multipleQueries = (queries, defaultValue) => {
    if (Array.isArray(queries)) return queries.map(queryValue => this.translateToNumIfNeeded(queryValue));
    return queries ? [this.translateToNumIfNeeded(queries)] : defaultValue || [];
  };

  singleQuery = (defaultValue, currentQuery) => {
    return currentQuery ? this.translateToNumIfNeeded(currentQuery) : defaultValue || null;
  };

  makeFiltersObject = (name, value) => {
    const { project } = this.props;
    const { sprints } = project;
    let currentSprint = sprints ? sprints.filter(item => item.statusId === 2)[0] : 0;
    currentSprint = currentSprint ? currentSprint.id : 0;
    let processedValue;
    const defaultValue = emptyFilters[name];
    if (['sprintId', 'performerId', 'statusId', 'typeId', 'tags'].indexOf(name) !== -1) {
      processedValue = this.multipleQueries(value, defaultValue);
    } else if (value) {
      if (!Array.isArray(value)) {
        processedValue = this.singleQuery(value, defaultValue);
      } else {
        processedValue = this.multipleQueries(value, defaultValue);
      }
    }
    if (name === 'sprintId' && !value) {
      processedValue = currentSprint > 0 ? [currentSprint] : [0];
    }

    return { [name]: processedValue };
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
      },
      nameInputValue: (this.props.location && this.props.location.query.name) || null
    };
  }

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened
    }));
  };

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
    this.setState(
      state => {
        const filterValue = options.map(option => option.value);
        const changedFilters = { ...state.changedFilters };

        if (filterValue.length) {
          changedFilters[name] = filterValue;
        } else if (emptyFilters[name] && emptyFilters[name].length) {
          changedFilters[name] = [...emptyFilters[name]];
        } else {
          delete changedFilters[name];
        }
        this.changeUrl(changedFilters);
        return {
          activePage:
            state.changedFilters[name] && state.changedFilters[name].length !== filterValue.length
              ? 1
              : state.activePage,
          changedFilters
        };
      },
      this.loadTasks,
      this.updateFilterList
    );
  };

  clearFilter = name => {
    this.setState(
      state => {
        if (state.changedFilters[name]) {
          const filters = state.changedFilters;
          delete filters[name];
          this.changeUrl(filters);
          return { changedFilters: filters };
        }
      },
      this.loadTasks,
      this.updateFilterList
    );
  };

  changeNameFilter = event => {
    const { value, name } = event.target;
    this.setState({ nameInputValue: value });
    if (name === 'closedInput') {
      this.debouncedSubmitNameFilter(value);
    } else {
      this.submitNameFilter(value);
    }
  };

  submitNameFilter = value => {
    this.setState(state => {
      const changedFilters = state.changedFilters;
      if (value) {
        changedFilters.name = value;
      } else {
        delete changedFilters.name;
      }

      this.changeUrl(changedFilters);

      const nameInputValue = changedFilters.name ? changedFilters.name : '';
      return {
        activePage: state.filterByName !== value ? 1 : state.activePage,
        changedFilters,
        nameInputValue
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
    const { changedFilters } = this.state;
    const params = { ...changedFilters, allStatuses: true, currentPage: this.state.activePage, pageSize: 25 };
    if (changedFilters.tags) {
      params.tags = changedFilters.tags.join(',');
    }
    this.props.getTasks(params, true);
    this.updateFilterList();
  };

  removeFilter = filterName => {
    this.setState(
      prevState => ({
        ...prevState,
        changedFilters: {
          ...prevState.changedFilters,
          [filterName]: null
        },
        nameInputValue: filterName === 'name' ? null : prevState.nameInputValue
      }),
      () => {
        this.loadTasks();
        this.changeUrl(this.state.changedFilters);
      }
    );
  };

  clearFilters = () => {
    this.setState(
      {
        nameInputValue: '',
        changedFilters: {
          projectId: this.props.params.projectId,
          sprintId: [0]
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
      const changedFilters = { ...state.changedFilters };

      if (value) {
        changedFilters[name] = this.formatDate(value);
      } else {
        delete changedFilters[name];
      }

      this.changeUrl(changedFilters);

      return { ...state, changedFilters };
    }, this.loadTasks);
  }

  getEditedSprints(sprints) {
    const editedSprints = sprints.map(sprint => ({
      value: sprint.id,
      label: `${sprint.name} (${moment(sprint.factStartDate).format('DD.MM.YYYY')} ${
        sprint.factFinishDate ? `- ${moment(sprint.factFinishDate).format('DD.MM.YYYY')}` : '- ...'
      })`
    }));
    editedSprints.push({
      value: 0,
      label: 'Backlog'
    });
    return editedSprints;
  }

  getOptionData(label, value) {
    const {
      project: { users, sprints },
      taskTypes,
      statuses,
      lang
    } = this.props;
    switch (label) {
      case 'performerId':
        if (+value === 0) {
          return localize[lang].NOT_ASSIGNED;
        }
        const user = users.find(u => u.id === +value);
        return user ? getFullName(user) : '';
      case 'changedSprint':
        const editedSprints = this.getEditedSprints(sprints).find(el => el.value === value);
        return editedSprints && editedSprints.label;
      case 'typeId':
        return taskTypes.find(el => el.id === value).name;
      case 'statusId':
        return statuses.find(el => el.id === value).name;
      default:
        return value;
    }
  }

  checkFilterItemEmpty = filterName => {
    const filter = this.state.changedFilters[filterName];
    if (typeof filter === 'string' || filter instanceof String || Array.isArray(filter)) {
      return !filter.length;
    }
    return filter === null || filter === false || filter === undefined;
  };

  updateFilterList = () => {
    const filters = this.state.changedFilters;
    const singleOptionFiltersList = ['prioritiesId', 'authorId', 'name', 'dateFrom', 'dateTo'];

    const selectedFilters = singleOptionFiltersList.reduce((result, filterName) => {
      if (!this.checkFilterItemEmpty(filterName)) {
        result.push({
          name: filterName,
          label: this.createFilterLabel(filterName),
          deleteHandler: () => this.removeFilter(filterName)
        });
      }
      return result;
    }, []);
    this.setState({
      allFilters: [
        ...selectedFilters,
        ...this.createSelectedOption([], filters.sprintId, 'changedSprint'),
        ...this.createSelectedOption([], filters.typeId, 'typeId'),
        ...this.createSelectedOption([], filters.performerId, 'performerId'),
        ...this.createSelectedOption([], filters.statusId, 'statusId'),
        ...this.createSelectedOption([], filters.tags, 'tags')
      ]
    });
  };

  createSelectedOption = (optionList, selectedOption, optionLabel = 'name') => {
    const { lang } = this.props;
    if (Array.isArray(selectedOption)) {
      if (optionLabel === 'tags') {
        return selectedOption.map(tag => ({
          name: tag,
          label: tag,
          deleteHandler: () => {
            this.removeSelectOptionByIdFromFilter(selectedOption, tag, optionLabel);
          }
        }));
      }
      return selectedOption.map(currentId => ({
        name: `${optionLabel}-${currentId}`,
        label:
          optionLabel === 'performerId'
            ? `${localize[lang].PERFORMER}: ${this.getOptionData(optionLabel, currentId)}`
            : this.getOptionData(optionLabel, currentId),
        deleteHandler: () => {
          this.removeSelectOptionByIdFromFilter(selectedOption, currentId, optionLabel);
        }
      }));
    } else {
      const option = optionList.find(element => element.id === selectedOption);
      if (!option) return {};
      return option[optionLabel];
    }
  };

  removeSelectOptionByIdFromFilter = (list, id, filterField) => {
    const filterName = filterField === 'changedSprint' ? 'sprintId' : filterField;
    const newList = list.filter(item => item !== id);
    this.setState(
      prevState => ({
        ...prevState,
        changedFilters: {
          ...prevState.changedFilters,
          [filterName]: newList
        }
      }),
      () => {
        this.loadTasks();
        this.changeUrl(this.state.changedFilters);
      }
    );
  };

  createFilterLabel = filterName => {
    const {
      lang,
      project: { users }
    } = this.props;
    const { changedFilters } = this.state;
    switch (filterName) {
      case 'prioritiesId':
        return `${getPriorityById(changedFilters.prioritiesId)}`;
      case 'authorId':
        return `${localize[lang].AUTHOR}: ${
          users.length ? getFullName(users.find(user => user.id === changedFilters.authorId)) : ''
        }`;
      case 'name':
        return `${changedFilters.name}`;
      case 'dateFrom':
        return `${localize[lang].TAG_FROM} ${changedFilters[filterName]}`;
      case 'dateTo':
        return `${localize[lang].TAG_TO} ${changedFilters[filterName]}`;
      default:
        return '';
    }
  };

  isFilters = () => Object.values(this.state.allFilters).length;

  formatDate = date => date && moment(date).format(dateFormat);

  onChangePrioritiesFilter = option => {
    ReactTooltip.hide();
    return this.changeSingleFilter(option, 'prioritiesId');
  };
  onChangeTypeFilter = options => this.changeMultiFilter(options, 'typeId');
  onChangeStatusFilter = options => this.changeMultiFilter(options, 'statusId');
  onChangeAuthorFilter = option => this.changeSingleFilter(option, 'authorId');
  onChangeSprintFilter = options => this.changeMultiFilter(options, 'sprintId');
  onChangeDateFromFilter = option => this.handleDayChange(option, 'dateFrom');
  onChangeDateToFilter = option => this.handleDayChange(option, 'dateTo');
  onChangePerformerFilter = option => this.changeSingleFilter(option, 'performerId');
  onChangeTagFilter = options => this.changeMultiFilter(options, 'tags');
  sortedAuthorOptions = () => {
    const { project } = this.props;
    const authorOptions = this.createOptions(project.users, 'fullNameRu');
    return authorOptions
      ? authorOptions.sort((a, b) => {
          if (a.label < b.label) {
            return -1;
          } else if (a.label > b.label) {
            return 1;
          }
        })
      : null;
  };

  render() {
    const { tasksList: tasks, statuses, taskTypes, project, isReceiving, lang, sprints } = this.props;
    const filterTags = this.state.allFilters.map(filter => {
      return (
        <Tag
          name={filter.label}
          deleteHandler={filter.deleteHandler}
          key={`${filter.name}_${filter.label}`}
          unclickable
          blocked={filter.name === 'changedSprint'}
        />
      );
    });
    const { prioritiesId, typeId, statusId, sprintId, performerId, authorId } = this.state.changedFilters;

    let tags = this.state.changedFilters.tags;
    if (tags && Array.isArray(tags)) {
      tags = tags.map(el => ({ label: el, value: el }));
    }

    const { isOpened } = this.state;

    const statusOptions = this.createOptions(statuses);
    const typeOptions = this.createOptions(taskTypes);

    const isFilter = this.isFilters();
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
          <CollapsibleRow isOpened={isOpened} toggleOpen={this.toggleOpen}>
            <div className={css.rowWrapper}>
              <Row className={css.search} top="xs">
                <Col xs={12} sm={8} className={css.withPriority}>
                  <div className={css.priorityFilter}>
                    <Priority onChange={this.onChangePrioritiesFilter} priority={prioritiesId} canEdit />
                  </div>
                  <Input
                    name="openedInput"
                    className={css.input}
                    placeholder={localize[lang].ENTER_TITLE_TASK}
                    value={this.state.nameInputValue || ''}
                    onChange={this.changeNameFilter}
                    canClear
                    onClear={() => this.changeNameFilter({ target: { value: '' } })}
                  />
                </Col>
                <Col xs={6} sm={2}>
                  <Button
                    style={{ width: '100%' }}
                    onClick={this.props.openCreateTaskModal}
                    type="primary"
                    text={localize[lang].CREATE_TASK}
                    icon="IconPlus"
                    name="right"
                  />
                </Col>
                <Col xs={6} sm={2}>
                  <Button
                    style={{ width: '100%' }}
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
                  <div className={css.sprintSelector}>
                    <SprintSelector
                      multi
                      searchable
                      clearable
                      value={sprintId || [0]}
                      onChange={this.onChangeSprintFilter}
                      options={sprints}
                      useId
                      taskListClass
                    />
                  </div>
                </Col>
                <Col xs={12} sm={3}>
                  <SelectDropdown
                    name="author"
                    placeholder={localize[lang].SELECT_AUTHOR_TASK}
                    multi={false}
                    value={authorId}
                    onChange={this.onChangeAuthorFilter}
                    onInputChange={removeNumChars}
                    noResultsText={localize[lang].NO_RESULTS}
                    options={this.sortedAuthorOptions()}
                    filterOption={layoutAgnosticFilter}
                    canClear
                    onClear={() => this.clearFilter('authorId')}
                  />
                </Col>
                <Col xs={12} sm={3}>
                  <PerformerFilter
                    onPerformerSelect={this.onChangePerformerFilter}
                    selectedPerformerId={performerId}
                    filterOption={layoutAgnosticFilter}
                    canClear
                    onClear={() => this.clearFilter('performerId')}
                  />
                </Col>
                <Col xs={12} sm={3}>
                  <TagsFilter
                    filterFor={'task'}
                    onTagSelect={this.onChangeTagFilter}
                    filterTags={tags}
                    onClear={() => this.clearFilter('tags')}
                  />
                </Col>
              </Row>
              <Row className={css.search}>
                <Col xs={6} sm={3}>
                  <SelectDropdown
                    name="status"
                    placeholder={localize[lang].SELECT_STATUS_TASK}
                    multi
                    noResultsText={localize[lang].NO_MATCH_STATUS}
                    backspaceToRemoveMessage={''}
                    clearAllText={localize[lang].CLEAR_ALL}
                    value={statusId}
                    options={statusOptions}
                    canClear
                    onClear={() => this.clearFilter('statusId')}
                    onChange={this.onChangeStatusFilter}
                    filterOption={layoutAgnosticFilter}
                  />
                </Col>
                <Col xs={6} sm={3}>
                  <SelectDropdown
                    name="type"
                    placeholder={localize[lang].SELECT_TYPE_TASK}
                    multi
                    noResultsText={localize[lang].SELECT_TYPE_TASK_EMPTY}
                    backspaceToRemoveMessage={''}
                    clearAllText={localize[lang].CLEAR_ALL}
                    value={typeId}
                    options={typeOptions}
                    canClear
                    onClear={() => this.clearFilter('typeId')}
                    onChange={this.onChangeTypeFilter}
                    filterOption={layoutAgnosticFilter}
                  />
                </Col>
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
                    canClear
                    onClear={() => this.clearFilter('dateFrom')}
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
                    canClear
                    onClear={() => this.clearFilter('dateTo')}
                  />
                </Col>
              </Row>
            </div>
            <Row className={css.search} top="xs">
              <Col xs={12} sm={8}>
                {filterTags.length ? (
                  filterTags
                ) : (
                  <Col xs={12} sm={12} className={css.withPriority}>
                    <div className={css.priorityFilter}>
                      <Priority onChange={this.onChangePrioritiesFilter} priority={prioritiesId} canEdit />
                    </div>
                    <Input
                      name="closedInput"
                      className={css.input}
                      placeholder={localize[lang].ENTER_TITLE_TASK}
                      value={this.state.nameInputValue || ''}
                      onChange={this.changeNameFilter}
                      canClear
                      onClear={() => this.changeNameFilter({ target: { value: '' } })}
                    />
                  </Col>
                )}
              </Col>
              <Col xs={6} sm={2}>
                <Button
                  style={{ width: '100%' }}
                  onClick={this.props.openCreateTaskModal}
                  type="primary"
                  text={localize[lang].CREATE_TASK}
                  icon="IconPlus"
                  name="right"
                />
              </Col>
              <Col xs={6} sm={2}>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  text={localize[lang].CLEAR_FILTERS}
                  icon="IconBroom"
                  disabled={!isFilter}
                  onClick={this.clearFilters}
                />
              </Col>
            </Row>
          </CollapsibleRow>
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
          {!isLoading && tasks.length === 0 ? <div className={css.notFound}>{localize[lang].NOTHING_FOUND}</div> : null}
          <Pagination
            itemsCount={this.props.pagesCount}
            activePage={this.state.activePage}
            onItemClick={this.handlePaginationClick}
          />
        </section>
        {this.state.isPerformerModalOpen ? (
          <PerformerModal
            defaultUser={this.state.performer}
            onChoose={this.changePerformer}
            onClose={this.closePerformerModal}
            title={localize[lang].EDIT_TASK_PERFORMER}
            users={this.getUsers()}
            id={this.state.changedTask.id}
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
            afterCreate={this.loadTasks}
            selectedSprintValue={singleSprint}
            project={this.props.project}
            defaultPerformerId={performerId}
          />
        ) : null}
        <ScrollTop />
      </div>
    );
  }
}

TaskList.propTypes = {
  changeTask: PropTypes.func.isRequired,
  checkFilterItemEmpty: PropTypes.func,
  filters: PropTypes.array,
  getTasks: PropTypes.func.isRequired,
  globalRole: PropTypes.string,
  isCreateTaskModalOpen: PropTypes.bool,
  isProjectReceiving: PropTypes.bool,
  isReceiving: PropTypes.bool,
  lang: PropTypes.string,
  lastCreatedTask: PropTypes.object,
  location: PropTypes.object,
  openCreateTaskModal: PropTypes.func.isRequired,
  pagesCount: PropTypes.number.isRequired,
  params: PropTypes.object,
  project: PropTypes.object.isRequired,
  setFilterValue: PropTypes.func,
  sprints: PropTypes.arrayOf(PropTypes.object),
  startTaskEditing: PropTypes.func.isRequired,
  statuses: PropTypes.array,
  taskTypes: PropTypes.array,
  tasksList: PropTypes.array.isRequired,
  typeOptions: PropTypes.array
};

const mapStateToProps = state => ({
  lastCreatedTask: state.Project.lastCreatedTask,
  globalRole: state.Auth.user.globalRole,
  tasksList: state.TaskList.tasks,
  pagesCount: state.TaskList.pagesCount,
  isReceiving: state.TaskList.isReceiving,
  isProjectReceiving: state.Project.isProjectInfoReceiving,
  isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
  project: state.Project.project,
  statuses: getLocalizedTaskStatuses(state),
  taskTypes: getLocalizedTaskTypes(state),
  lang: state.Localize.lang,
  sprints: getSortedSprints(state)
});

const mapDispatchToProps = { getTasks, startTaskEditing, changeTask, openCreateTaskModal };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);
