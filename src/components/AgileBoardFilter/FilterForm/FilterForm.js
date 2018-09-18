import React from 'react';

import { Row, Col } from 'react-flexbox-grid/lib/index';
import { UnmountClosed } from 'react-collapse';

import * as css from './FilterForm.scss';
import localize from './FilterForm.json';

import Input from '../../Input';
import SelectDropdown from '../../SelectDropdown';
import Button from '../../Button';
import Priority from '../../Priority';
import Checkbox from '../../Checkbox';
import PerformerFilter from '../../PerformerFilter';
import SprintSelector from '../../SprintSelector';

class FilterForm extends React.Component {
  updateListsAndTasks = () => {
    this.props.getTasks();
    this.props.updateFilterList();
  };

  onPrioritiesFilterChange = option =>
    this.props.setFilterValue('prioritiesId', option.prioritiesId, this.updateListsAndTasks);
  onSprintsFilterChange = options => this.props.setFilterValue('changedSprint', options, this.updateListsAndTasks);
  onAuthorFilterChange = option =>
    this.props.setFilterValue('authorId', option ? option.value : null, this.updateListsAndTasks);
  onTypeFilterChange = options => this.props.setFilterValue('typeId', options, this.updateListsAndTasks);
  onNameFilterChange = e => this.props.setFilterValue('name', e.target.value, this.updateListsAndTasks);
  onIsOnlyMineFilterChange = () => {
    this.props.setFilterValue('isOnlyMine', !this.props.filters.isOnlyMine, this.updateListsAndTasks);
  };

  getFilterTagsProps() {
    const {
      tags,
      noTagData,
      filters: { filterTags, noTag }
    } = this.props;
    return {
      value: !noTag ? filterTags : [noTagData].concat(filterTags),
      options: filterTags.length ? tags : [noTagData].concat(tags)
    };
  }

  getSprintTime(sprints) {
    return sprints && sprints.length && this.props.sprints.length
      ? sprints.map(sprint => {
          const sprintData = this.props.sprints.find(data => data.id === +sprint.value) || {};
          return `${sprintData.spentTime || 0} / ${sprintData.budget || 0}`;
        })
      : [];
  }

  clearFilters = () => {
    this.props.clearFilters(this.updateListsAndTasks);
  };

  render() {
    const { filters, lang, isOpened } = this.props;
    return (
      <UnmountClosed isOpened={isOpened} springConfig={{ stiffness: 90, damping: 15 }}>
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
                {...this.getFilterTagsProps()}
              />
            </Col>
            {!this.isVisor ? (
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
          </Row>
          <Row className={css.filtersRow}>
            <Col xs={12} sm={6}>
              <Input
                placeholder={localize[lang].TASK_NAME}
                value={filters.name || ''}
                onChange={this.onNameFilterChange}
              />
            </Col>
            <Col xs={12} sm={3}>
              <PerformerFilter
                onPerformerSelect={options =>
                  this.props.setFilterValue('performerId', options, this.updateListsAndTasks)
                }
                selectedPerformerId={this.props.filters.performerId}
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
              />
            </Col>
          </Row>
          <Row className={css.filtersRow}>
            <Col xs={12} sm={6} className={css.changedSprint}>
              <SprintSelector
                name="changedSprint"
                placeholder={localize[lang].SELECT_SPRINT}
                multi
                backspaceToRemoveMessage=""
                value={filters.changedSprint.map(sprint => sprint.value)}
                onChange={this.onSprintsFilterChange}
                noResultsText={localize[lang].NO_RESULTS}
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
                noResultsText={localize[lang].NO_RESULTS}
                options={this.props.authorOptions}
              />
            </Col>
            <Col className={css.filterButtonCol}>
              <Button
                onClick={this.clearFilters}
                type="primary"
                text={localize[lang].CLEAR_FILTERS}
                icon="IconBroom"
                name="right"
                disabled={!this.props.filtersIsEmpty}
              />
            </Col>
          </Row>
        </div>
      </UnmountClosed>
    );
  }
}

export default FilterForm;
