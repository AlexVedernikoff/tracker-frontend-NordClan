import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { connect } from 'react-redux';
import moment from 'moment';
import Title from 'react-title-component';
import { fullHeight as fullHeightClass } from '../../styles/App.scss';
import { agileBoardWrapper } from './MyTasksDevOps.scss';
import { uniqBy, debounce } from 'lodash';
import ReactTooltip from 'react-tooltip';
import AgileBoard from '../ProjectPage/AgileBoard';
import Priority from '../../components/Priority';
import Button from '../../components/Button';
import Input from '../../components/Input';
import PerformerFilter from '../../components/PerformerFilter';
// import Tag from '../../components/Tag';
import getPriorityById from '../../utils/TaskPriority';
import { getFullName, getDictionaryName } from '../../utils/NameLocalisation';
import { changeTask, startTaskEditing } from '../../actions/Task';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses } from '../../selectors/dictionaries';
import { history } from '../../History';
import getTasks from '../../actions/Tasks';
import getDevOpsUsers from '../../actions/Users';
import * as css from './TaskList.scss';
import localize from './taskList.json';
import ScrollTop from '../../components/ScrollTop';
import { layoutAgnosticFilterGlobal } from '../../utils/layoutAgnosticFilter';

const dateFormat = 'DD.MM.YYYY';

export const emptyFilters = {};

class MyTasksDevOps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      allFilters: [],
      nameInputValue: null,
      ...this.getQueryFilters()
    };
    this.debouncedSubmitNameFilter = debounce(this.submitNameFilter, 1000);
  }

  componentDidMount() {
    this.loadTasks();
    this.getDevOpsUsers();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.lastCreatedTask !== nextProps.lastCreatedTask && nextProps.project.id) {
      this.loadTasks();
    }
  }

  componentWillUnmount() {
    this.debouncedSubmitNameFilter.cancel();
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
    let processedValue;
    const defaultValue = emptyFilters[name];
    if (['performerId', 'statusId', 'typeId', 'tags'].includes(name)) {
      processedValue = this.multipleQueries(value, defaultValue);
    } else if (value) {
      if (!Array.isArray(value)) {
        processedValue = this.singleQuery(value, defaultValue);
      } else {
        processedValue = this.multipleQueries(value, defaultValue);
      }
    }
    return { [name]: processedValue };
  };

  getUrlQueries = () => {
    const { performerId, statusId, name, prioritiesId, typeId, tags, dateFrom, dateTo } =
      (this.props.location && this.props.location.query) || {};
    return {
      ...this.makeFiltersObject('performerId', performerId),
      ...this.makeFiltersObject('name', name),
      ...this.makeFiltersObject('prioritiesId', prioritiesId),
      ...this.makeFiltersObject('tags', tags),
      ...this.makeFiltersObject('typeId', typeId),
      ...this.makeFiltersObject('statusId', statusId),
      ...this.makeFiltersObject('dateFrom', dateFrom),
      ...this.makeFiltersObject('dateTo', dateTo)
    };
  };

  getQueryFilters() {
    return {
      changedFilters: {
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
      query[key] = value;
    }

    history.replace({
      ...this.props.location,
      query
    });
  }

  getUsers = () => {
    return this.props.devOpsUsers;
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

      if ([null, [], undefined, ''].includes(filterValue)) {
        delete changedFilters[name];
      } else {
        changedFilters[name] = filterValue;
      }

      this.changeUrl(changedFilters);

      return {
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

  loadTasks = () => {
    const { changedFilters } = this.state;
    const params = { ...changedFilters, allStatuses: true, isDevOps: true };
    if (changedFilters.tags) {
      params.tags = changedFilters.tags.join(',');
    }

    // Для корректногой работы запроса выставить принудительно 0
    if (!params.performerId) {
      params.performerId = 0;
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

  getOptionData(label, value) {
    const { taskTypes, statuses, lang, devOpsUsers } = this.props;
    const users = devOpsUsers;
    switch (label) {
      case 'performerId':
        if (+value === 0) {
          return localize[lang].NOT_ASSIGNED;
        }
        const user = users.find(u => u.id === +value);
        return user ? getFullName(user) : '';
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
    const singleOptionFiltersList = ['prioritiesId', 'name', 'dateFrom', 'dateTo'];

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
    const filterName = filterField;
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
    const { lang } = this.props;
    const { changedFilters } = this.state;
    switch (filterName) {
      case 'prioritiesId':
        return `${getPriorityById(changedFilters.prioritiesId)}`;
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
  onChangeDateFromFilter = option => this.handleDayChange(option, 'dateFrom');
  onChangeDateToFilter = option => this.handleDayChange(option, 'dateTo');
  onChangePerformerFilter = option => this.changeSingleFilter(option, 'performerId');
  onChangeTagFilter = options => this.changeMultiFilter(options, 'tags');

  render() {
    // const { tasksList: tasks, statuses, taskTypes, lang, devOpsUsers } = this.props;
    const { tasksList: tasks, lang, devOpsUsers } = this.props;
    // const filterTags = this.state.allFilters.map(filter => {
    //   return (
    //     <Tag
    //       name={filter.label}
    //       deleteHandler={filter.deleteHandler}
    //       key={`${filter.name}_${filter.label}`}
    //       unclickable
    //       blocked={filter.name === 'changedSprint'}
    //     />
    //   );
    // });
    // const { prioritiesId, typeId, statusId, performerId } = this.state.changedFilters;
    const { prioritiesId, performerId } = this.state.changedFilters;

    let tags = this.state.changedFilters.tags;
    if (tags && Array.isArray(tags)) {
      tags = tags.map(el => ({ label: el, value: el }));
    }

    // const { isOpened } = this.state;

    // const statusOptions = this.createOptions(statuses);
    // const typeOptions = this.createOptions(taskTypes);
    const isFilter = this.isFilters();

    return (
      <div className={fullHeightClass}>
        <Title render={`SimTrack - ${localize[this.props.lang].TASKS_DEV_OPS}`} />
        <h1>{localize[this.props.lang].TASKS_DEV_OPS}</h1>
        <section>
          <div>
            {/* <CollapsibleRow isOpened={isOpened} toggleOpen={this.toggleOpen}> */}
            <div className={css.rowWrapper}>
              <Row className={css.search} top="xs">
                <Col xs={12} sm={6} className={css.withPriority}>
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
                <Col xs={12} sm={4}>
                  <PerformerFilter
                    onPerformerSelect={this.onChangePerformerFilter}
                    selectedPerformerId={performerId}
                    filterOption={layoutAgnosticFilterGlobal}
                    devOpsUsers={devOpsUsers}
                    canClear
                    onClear={() => this.clearFilter('performerId')}
                  />
                </Col>
                <Col xs={12} sm={2}>
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
              {/* <Row className={css.search} top="xs"> */}

              {/* <Col xs={12} sm={3}>
                  <TagsFilter
                    filterFor={'task'}
                    onTagSelect={this.onChangeTagFilter}
                    filterTags={tags}
                    onClear={() => this.clearFilter('tags')}
                  />
                </Col> */}
              {/* </Row> */}
              {/* <Row className={css.search}> */}
              {/* <Col xs={6} sm={3}>
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
                    filterOption={layoutAgnosticFilterGlobal}
                  />
                </Col> */}
              {/* <Col xs={6} sm={3}>
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
                    filterOption={layoutAgnosticFilterGlobal}
                  />
                </Col> */}
              {/* <Col xs={6} sm={3}>
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
                </Col> */}
              {/* </Row> */}
            </div>
            <hr />
            {/* <Row className={css.search} top="xs">
              <Col xs={3} sm={3}>
                {filterTags.length ? (
                  filterTags
                ) : (
                  <Col xs={3} sm={3} className={css.withPriority}>
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
                  type="primary"
                  text={localize[lang].CLEAR_FILTERS}
                  icon="IconBroom"
                  disabled={!isFilter}
                  onClick={this.clearFilters}
                />
              </Col>
            </Row> */}
          </div>
          {/* </CollapsibleRow> */}
        </section>
        <div className={agileBoardWrapper}>
          <AgileBoard
            isDevOps
            onStatusChange={this.loadTasks}
            devOpsUsers={devOpsUsers}
            filteredTasks={tasks}
            {...this.props}
          />
        </div>
        <ScrollTop />
      </div>
    );
  }
}

MyTasksDevOps.propTypes = {
  changeTask: PropTypes.func.isRequired,
  checkFilterItemEmpty: PropTypes.func,
  devOpsUsers: PropTypes.array.isRequired,
  filters: PropTypes.array,
  getDevOpsUsers: PropTypes.func.isRequired,
  getTasks: PropTypes.func.isRequired,
  globalRole: PropTypes.string,
  isCreateTaskModalOpen: PropTypes.bool,
  isReceiving: PropTypes.bool,
  lang: PropTypes.string,
  lastCreatedTask: PropTypes.object,
  location: PropTypes.object,
  params: PropTypes.object,
  setFilterValue: PropTypes.func,
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
  devOpsUsers: state.UserList.devOpsUsers,
  isReceiving: state.TaskList.isReceiving,
  statuses: getLocalizedTaskStatuses(state),
  taskTypes: getLocalizedTaskTypes(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = { getTasks, startTaskEditing, changeTask, getDevOpsUsers };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyTasksDevOps);
