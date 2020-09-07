import React from 'react';
import { oneOf, func, exact, arrayOf, number, string, bool } from 'prop-types';
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

class FilterForm extends React.Component {
  static propTypes = {
    clearFilters: func.isRequired,
    filters: exact({
      isOnlyMine: bool,
      typeId: arrayOf(number).isRequired,
      name: string,
      authorId: arrayOf(number),
      prioritiesId: number,
      performerId: arrayOf(number)
    }).isRequired,
    initialFilters: exact({
      isOnlyMine: bool,
      typeId: arrayOf(number).isRequired,
      name: string,
      authorId: arrayOf(number),
      prioritiesId: number,
      performerId: arrayOf(number)
    }).isRequired,
    lang: oneOf(['en', 'ru']).isRequired,
    setFilterValue: func.isRequired,
    typeOptions: flow(
      exact,
      arrayOf
    )({
      value: number.isRequired,
      label: string.isRequired
    }).isRequired,
    updateFilterList: func.isRequired,
    users: flow(
      exact,
      arrayOf
    )({
      emailPrimary: string,
      firstNameEn: string,
      firstNameRu: string,
      fullNameEn: string,
      fullNameRu: string,
      id: number.isRequired,
      lastNameEn: string,
      lastNameRu: string,
      mobile: string,
      photo: string,
      skype: string
    })
  };

  static defaultProps = {
    users: []
  };

  static getValuesCollection(options) {
    return options.map(option => option.value);
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

    setFilterValue('isOnlyMine', isOnlyMine, () => {
      if (!filters.isOnlyMine) {
        clearFilters(
          {
            ...filters,
            isOnlyMine,
            performerId: initialFilters.performerId
          },
          this.updateListsAndTasks
        );
      } else {
        this.updateListsAndTasks();
      }
    });
  };

  onPerformerFilterChange = options => {
    const { setFilterValue } = this.props;

    const newPerformers = FilterForm.getValuesCollection(options);

    setFilterValue('performerId', newPerformers, () => {
      setFilterValue('isOnlyMine', newPerformers.length === 0, this.updateListsAndTasks);
    });
  };

  clearFilters = type => () => {
    const { setFilterValue, clearFilters, initialFilters } = this.props;

    if (type) {
      setFilterValue(type, initialFilters[type], this.updateListsAndTasks);
    } else {
      clearFilters({}, this.updateListsAndTasks);
    }
  };

  resetName = () => {
    this.taskNameRef.value = '';
  };

  get sortedUsersOptions() {
    const { users } = this.props;

    return users.map(user => ({ value: user.id, label: getFullName(user) })).sort((a, b) => {
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
    const { filters, lang, typeOptions, initialFilters } = this.props;

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
