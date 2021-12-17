import React from 'react';
import { oneOf, func, exact, arrayOf, number, string, bool, array } from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib';
import ReactTooltip from 'react-tooltip';

import flow from 'lodash/flow';
import isEqual from 'lodash/isEqual';

import * as css from './FilterForm.scss';
import localize from './FilterForm.json';

import Input from '../../../../components/Input';
import SelectDropdown from '../../../../components/SelectDropdown';
import Button from '../../../../components/Button';
import Priority from '../../../../components/Priority';
import Checkbox from '../../../../components/Checkbox';

import layoutAgnosticFilter from '../../../../utils/layoutAgnosticFilter';
import { removeNumChars } from '../../../../utils/formatter';
import { getFullName } from '../../../../utils/NameLocalisation';

type FilterFormProps = {
    clearFilters: Function
    filters: {
      isOnlyMine: boolean,
      typeId: Array<number>,
      name: string,
      authorId: Array<number>,
      prioritiesId: number,
      performerId: Array<number>
      projectIds: Array<number>
    },
    initialFilters: {
      isOnlyMine: boolean,
      typeId: Array<number>,
      name: string,
      authorId: Array<number>,
      prioritiesId: number,
      performerId: Array<number>
    },
    lang: string,
    setFilterValue: Function,
    typeOptions: Array<{
      value: number,
      label: string
    }>,
    updateFilterList: Function,
    users: Array<{
      id: number
    }>,
    isAdmin: boolean,
    isVisor: boolean,
    projects: Array<{
      id: number,
      name: string
    }>,
    getProjectsAll: () => void,
}  

class FilterForm extends React.Component<FilterFormProps, any> {

  private taskNameRef: HTMLInputElement | null = null;

  
  static defaultProps = {
    users: []
  };
  

  static getValuesCollection(options) {
    return options?.map(option => option.value);
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  updateListsAndTasks = () => {
    const { updateFilterList } = this.props;

    updateFilterList();
  };

  onPrioritiesFilterChange = option => {
    const { initialFilters, setFilterValue } = this.props;

    setFilterValue(
      'prioritiesId',
      option.prioritiesId ? option.prioritiesId : initialFilters.prioritiesId,
      this.updateListsAndTasks
    );
  };

  onAuthorFilterChange = options => {
    const { setFilterValue } = this.props;

    setFilterValue('authorId', FilterForm.getValuesCollection(options), this.updateListsAndTasks);
  };

  onProjectFilterChange = options => {
    const { setFilterValue } = this.props;

    setFilterValue('projectIds', FilterForm.getValuesCollection(options), this.updateListsAndTasks);
  };

  onTypeFilterChange = options => {
    const { setFilterValue } = this.props;

    setFilterValue('typeId', FilterForm.getValuesCollection(options), this.updateListsAndTasks);
  };

  onNameFilterChange = e => {
    const { setFilterValue } = this.props;

    setFilterValue('name', e.target.value, this.updateListsAndTasks);
  };

  onIsOnlyMineFilterChange = () => {
    const { filters, setFilterValue, clearFilters, initialFilters } = this.props;

    const isOnlyMine = !filters.isOnlyMine;
    setFilterValue('isOnlyMine', isOnlyMine, this.updateListsAndTasks);
  };

  onPerformerFilterChange = options => {
    const { setFilterValue } = this.props;

    const newPerformers = FilterForm.getValuesCollection(options);

    setFilterValue('performerId', newPerformers, () => {
      setFilterValue('isOnlyMine', newPerformers.length === 0, this.updateListsAndTasks);
    });
  };

  clearFilters = (filterName?: any) => () => {
    const { setFilterValue, clearFilters, initialFilters } = this.props;

    if (filterName) {
      setFilterValue(filterName, initialFilters[filterName], this.updateListsAndTasks);
    } else {
      clearFilters({}, this.updateListsAndTasks);
    }
    this.resetName();
  };

  resetName = () => {
    if (this.taskNameRef) this.taskNameRef.value = '';
  };

  get sortedUsersOptions() {
    const { users } = this.props;

    return users?.map(user => ({ value: user.id, label: getFullName(user) })).sort((a, b) => {
      switch (true) {
        case a.label < b.label:
          return -1;
        case a.label > b.label:
          return 1;
        default:
          return 0;
      }
    });
  }

  render() {
    const { filters, lang, typeOptions, initialFilters, isAdmin, isVisor, projects } = this.props;
    const sortedUsersOptions = this.sortedUsersOptions;

    return (
      <div className={css.filtersRowWrapper}>
        <Row className={css.filtersRow}>
          <Col className={css.filterButtonCol}>
            <Priority
              onChange={this.onPrioritiesFilterChange}
              priority={filters.prioritiesId}
              priorityTitle={localize[lang].PRIORITY}
              canEdit
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Checkbox
              checked={filters.isOnlyMine}
              onChange={this.onIsOnlyMineFilterChange}
              label={localize[lang].MY_TASKS}
            />
          </Col>
        </Row>
        <Row className={css.filtersRow}>
          <Col xs={12} sm={6}>
            <Input
              placeholder={localize[lang].TASK_NAME}
              defaultValue={filters.name || ''}
              onChange={this.onNameFilterChange}
              inputRef={ref => (this.taskNameRef = ref)}
              canClear
              onClear={this.clearFilters('name')}
            />
          </Col>
          <Col xs={12} sm={3}>
            <SelectDropdown
              name="performer"
              placeholder={localize[lang].CHANGE_PERFORMER}
              disabled={!isAdmin && !isVisor}
              multi
              value={filters.performerId}
              onChange={this.onPerformerFilterChange}
              onInputChange={removeNumChars}
              noResultsText={localize[lang].NO_RESULTS}
              options={sortedUsersOptions}
              filterOption={layoutAgnosticFilter}
              backspaceToRemoveMessage=""
              canClear
              onClear={this.clearFilters('performerId')}
              creatable
            />
          </Col>
          <Col xs={12} sm={3}>
            <SelectDropdown
              name="type"
              placeholder={localize[lang].TASK_TYPE}
              multi
              noResultsText={localize[lang].TYPE_IS_MISS}
              backspaceToRemoveMessage=""
              clearAllText={localize[lang].CLEAR_ALL}
              value={filters.typeId}
              options={typeOptions}
              onChange={this.onTypeFilterChange}
              canClear
              filterOption={layoutAgnosticFilter}
              onClear={this.clearFilters('typeId')}
              creatable
            />
          </Col>
        </Row>
        <Row className={css.filtersRow}>
          <Col xs>
            <SelectDropdown
              name="author"
              placeholder={localize[lang].SELECT_AUTHOR}
              multi
              value={filters.authorId}
              onChange={this.onAuthorFilterChange}
              onInputChange={removeNumChars}
              noResultsText={localize[lang].NO_RESULTS}
              options={sortedUsersOptions}
              filterOption={layoutAgnosticFilter}
              backspaceToRemoveMessage=""
              canClear
              onClear={this.clearFilters('authorId')}
              creatable
            />
          </Col>
          <Col xs>
            <SelectDropdown
              name="project"
              placeholder={localize[lang].SELECT_PROJECT}
              multi
              value={filters.projectIds}
              onChange={this.onProjectFilterChange}
              noResultsText={localize[lang].NO_RESULTS}
              options={projects.map((project) => ({ label: project.name, value: project.id }))}
              filterOption={layoutAgnosticFilter}
              backspaceToRemoveMessage=""
              canClear
              onClear={this.clearFilters('projectIds')}
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Button
              onClick={this.clearFilters()}
              type="primary"
              text={localize[lang].CLEAR_FILTERS}
              icon="IconBroom"
              name="right"
              disabled={isEqual(initialFilters, filters)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default FilterForm;
