import React from 'react';

import { Row, Col } from 'react-flexbox-grid/lib/index';
import ReactTooltip from 'react-tooltip';

import * as css from './FilterForm.scss';
import localize from './FilterForm.json';

import Input from '../../Input';
import SelectDropdown from '../../SelectDropdown';
import Button from '../../Button';
import Priority from '../../Priority';
import Checkbox from '../../Checkbox';
import PerformerFilter from '../../PerformerFilter';
import SprintSelector from '../../SprintSelector';

import layoutAgnosticFilter from '../../../utils/layoutAgnosticFilter';
import { storageType } from '../../FiltrersManager/helpers';
import { isOnlyDevOps } from '../../../utils/isDevOps';
import { removeNumChars } from '../../../utils/formatter';

const storage = storageType === 'local' ? localStorage : sessionStorage;

class FilterForm extends React.Component {
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  updateListsAndTasks = () => {
    this.props.updateFilterList();
  };

  getSprintValue(options) {
    if (options.length) {
      return options.map(op => op.value);
    }

    return [0];
  }

  onPrioritiesFilterChange = option =>
    this.props.setFilterValue('prioritiesId', option.prioritiesId, this.updateListsAndTasks);
  onSprintsFilterChange = options => {
    this.props.setFilterValue('changedSprint', this.getSprintValue(options), this.updateListsAndTasks);
    storage.setItem('sprintFilterChanged', 1);
  };
  onAuthorFilterChange = option =>
    this.props.setFilterValue('authorId', option ? option.value : null, this.updateListsAndTasks);
  onTypeFilterChange = options =>
    this.props.setFilterValue('typeId', options.map(op => op.value), this.updateListsAndTasks);
  onNameFilterChange = e => this.props.setFilterValue('name', e.target.value, this.updateListsAndTasks);
  onIsOnlyMineFilterChange = () => {
    const isOnlyMine = !this.props.filters.isOnlyMine;
    this.props.setFilterValue('isOnlyMine', isOnlyMine, this.props.updateFilterList);
  };
  onPerformerFilterChange = options =>
    this.props.setFilterValue('performerId', options.map(op => op.value), this.updateListsAndTasks);
  selectTagForFiltrated = options =>
    this.props.setFilterValue('filterTags', options.map(op => op.value), this.updateListsAndTasks);

  getFilterTagsProps() {
    const {
      tags,
      filters: { filterTags }
    } = this.props;
    return {
      value: filterTags,
      options: tags
    };
  }

  getSprintTime(sprintIds) {
    return sprintIds && sprintIds.length && this.props.sprints && this.props.sprints.length
      ? sprintIds.map(sprintId => {
          const sprintData = this.props.sprints.find(data => data.id === +sprintId) || {};
          return `${sprintData.spentTime || 0} / ${sprintData.budget || 0}`;
        })
      : [];
  }

  clearFilters = type => {
    if (type === 'sprints') {
      this.props.clearFilters({ changedSprint: [0] }, this.updateListsAndTasks);
      this.taskNameRef.value = '';
      storage.setItem('sprintFilterChanged', 1);
    } else {
      this.props.setFilterValue(type, [], this.updateListsAndTasks);
    }
  };

  render() {
    const { filters, lang, user, project } = this.props;
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
          <Col xs style={{ minWidth: 200 }}>
            <SelectDropdown
              name="filterTags"
              multi
              placeholder={localize[lang].TAG_NAME}
              backspaceToRemoveMessage=""
              onChange={this.selectTagForFiltrated}
              noResultsText={localize[lang].NO_RESULTS}
              filterOption={layoutAgnosticFilter}
              canClear
              onClear={() => this.clearFilters('filterTags')}
              {...this.getFilterTagsProps()}
            />
          </Col>
          {!this.isVisor && !isOnlyDevOps(user, project.id) ? (
            <Col className={css.filterButtonCol}>
              <Button
                onClick={this.props.openCreateTaskModal}
                type="primary"
                text={localize[lang].CREATE_TASK}
                icon="IconPlus"
                name="right"
              />
            </Col>
          ) : null}
          <Col className={css.filterButtonCol}>
            <Button
              onClick={this.props.generateShareLink}
              type="primary"
              data-tip={this.props.shareButtonText}
              icon="IconLink"
              name="right"
              disabled={this.props.isFilterEmpty}
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
            />
          </Col>
          <Col xs={12} sm={3}>
            <PerformerFilter
              onPerformerSelect={this.onPerformerFilterChange}
              selectedPerformerId={this.props.filters.performerId}
              filterOption={layoutAgnosticFilter}
            />
          </Col>
          <Col xs={12} sm={3}>
            <SelectDropdown
              name="type"
              placeholder={localize[lang].TASK_TYPE}
              multi
              noResultsText={localize[lang].TYPE_IS_MISS}
              backspaceToRemoveMessage={''}
              clearAllText={localize[lang].CLEAR_ALL}
              value={this.props.filters.typeId}
              options={this.props.typeOptions}
              onChange={this.onTypeFilterChange}
              canClear
              filterOption={layoutAgnosticFilter}
              onClear={() => this.clearFilters('typeId')}
            />
          </Col>
        </Row>
        <Row className={css.filtersRow}>
          <Col xs={12} sm={6} className={css.changedSprint}>
            <SprintSelector
              multi
              searchable
              clearable={false}
              value={filters.changedSprint}
              onChange={this.onSprintsFilterChange}
              options={this.props.sortedSprints}
            />
            <div className={css.sprintTimeWrapper}>
              {!this.isExternal
                ? this.getSprintTime(filters.changedSprint).map((time, key) => (
                    <span key={key} className={css.sprintTime}>
                      {time}
                    </span>
                  ))
                : null}
            </div>
          </Col>
          <Col xs>
            <SelectDropdown
              name="author"
              placeholder={localize[lang].SELECT_AUTHOR}
              multi={false}
              value={filters.authorId}
              onChange={this.onAuthorFilterChange}
              onInputChange={removeNumChars}
              noResultsText={localize[lang].NO_RESULTS}
              options={this.props.authorOptions}
              filterOption={layoutAgnosticFilter}
            />
          </Col>
          <Col className={css.filterButtonCol}>
            <Button
              onClick={() => this.clearFilters('sprints')}
              type="primary"
              text={localize[lang].CLEAR_FILTERS}
              icon="IconBroom"
              name="right"
              disabled={this.props.isFilterEmpty}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default FilterForm;
