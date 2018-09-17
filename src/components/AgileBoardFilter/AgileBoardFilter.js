import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import { UnmountClosed } from 'react-collapse';

import * as css from './AgileBoardFilter.scss';
import localize from './AgileBoardFilter.json';

import FilterList from '../FilterList';
import Input from '../Input';
import SelectDropdown from '../SelectDropdown';
import Button from '../Button';
import Priority from '../Priority';
import Checkbox from '../Checkbox';
import PerformerFilter from '../PerformerFilter';
import SprintSelector from '../SprintSelector';

import getPriorityById from '../../utils/TaskPriority';
import { VISOR } from '../../constants/Roles';

const NO_TAG_VALUE = -1;

class AgileBoardFilter extends React.Component {
  static propTypes = {
    filters: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired,
    myTaskBoard: PropTypes.bool
  };

  state = {
    fullFilterView: false,
    allFilters: []
  };

  toggleFilterView = () => {
    this.setState(prevState => ({ fullFilterView: !prevState.fullFilterView }));
  };

  updateFilterList = () => {
    const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'name', 'noTag'];
    const selectedFilters = [];

    singleOptionFiltersList.forEach(filterName => {
      if (this.filterIsNotEmpty(filterName)) {
        selectedFilters.push({
          name: filterName,
          label: this.createFilterLabel(filterName),
          deleteHandler: () => this.resetFiled(filterName)
        });
      }
    });

    const changedSprint = this.props.filters.changedSprint.map(sprint => {
      const option = this.props.sortedSprints.find(el => el.value === +sprint.value);
      return {
        ...sprint,
        ...option
      };
    });

    this.setState({
      allFilters: [
        ...selectedFilters,
        ...this.createSelectedOption([], changedSprint, 'changedSprint'),
        ...this.createSelectedOption([], this.state.typeId, 'typeId'),
        ...this.createSelectedOption([], this.state.performerId, 'performerId'),
        ...this.createSelectedOption([], this.state.filterTags, 'filterTags')
      ]
    });
  };

  createSelectedOption = (optionList, selectedOption, optionLabel = 'name') => {
    if (Array.isArray(selectedOption)) {
      return selectedOption.map(currentId => ({
        name: `${optionLabel}-${currentId.value}`,
        label: optionLabel === 'performerId' ? `исполнитель: ${currentId.label}` : currentId.label,
        deleteHandler: () => {
          this.removeSelectOptionByIdFromFilter(selectedOption, currentId.value, optionLabel);
        }
      }));
    } else {
      const option = optionList.find(element => element.id === selectedOption);
      if (!option) return {};
      return option[optionLabel];
    }
  };

  resetFiled = name => {
    this.setState(
      () => ({
        [name]: this.initialFilters[name]
      }),
      this.getTasks
    );
  };

  filterIsNotEmpty = filterName => {
    if (
      typeof this.state[filterName] === 'string' ||
      this.state[filterName] instanceof String ||
      Array.isArray(this.state[filterName])
    ) {
      return this.state[filterName].length > 0;
    }
    return this.state[filterName] !== null && this.state[filterName] !== false;
  };

  createFilterLabel = filterName => {
    switch (filterName) {
      case 'isOnlyMine':
        return 'мои задачи';
      case 'noTag':
        return this.props.noTagData.label;
      case 'prioritiesId':
        return `${getPriorityById(this.state.prioritiesId)}`;
      case 'authorId':
        return `автор: ${this.createSelectedOption(this.props.project.users, this.state.authorId, 'fullNameRu')}`;
      case 'performerId':
        return `исполнитель: ${this.createSelectedOption(
          this.props.project.users,
          this.state.performerId,
          'fullNameRu'
        ) || 'Не назначено'}`;
      case 'name':
        return `${this.state.name}`;
      default:
        return '';
    }
  };

  removeSelectOptionByIdFromFilter = (list, id, filterField) => {
    const newList = list.filter(item => item.value !== id);
    this.setState(
      {
        [filterField]: newList
      },
      this.getTasks
    );
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

  onPrioritiesFilterChange = option =>
    this.props.setFilterValue('prioritiesId', option.prioritiesId, this.updateFilterList);
  onSprintsFilterChange = options => this.props.setFilterValue('changedSprint', options, this.updateFilterList);
  onAuthorFilterChange = option =>
    this.props.setFilterValue('authorId', option ? option.value : null, this.updateFilterList);
  onTypeFilterChange = options => this.props.setFilterValue('typeId', options, this.updateFilterList);
  onNameFilterChange = e => this.props.setFilterValue('name', e.target.value, this.updateFilterList);
  onIsOnlyMineFilterChange = () => {
    this.setState(
      currentState => ({
        isOnlyMine: !currentState.isOnlyMine
      }),
      () => {
        this.props.setFilterValue('isOnlyMine', this.props.filters.isOnlyMine, this.updateFilterList);
      }
    );
  };

  getSprintTime(sprints) {
    return sprints && sprints.length && this.props.sprints.length
      ? sprints.map(sprint => {
          const sprintData = this.props.sprints.find(data => data.id === +sprint.value) || {};
          return `${sprintData.spentTime || 0} / ${sprintData.budget || 0}`;
        })
      : [];
  }

  setFilterValue = (label, options) => {
    this.props.setFilterValue(label, options, this.getTasks);
  };

  clearFilters = () => {
    this.props.clearFilters(this.getTasks);
  };

  selectTagForFiltrated = options => {
    const tags = options.filter(option => option.value !== NO_TAG_VALUE);
    const isNoTagSelected = tags.length < options.length;
    const { noTag } = this.state;

    if ((noTag && !isNoTagSelected) || (!noTag && isNoTagSelected)) {
      this.selectValue(isNoTagSelected || null, 'noTag');
    } else {
      this.selectValue(tags, 'filterTags');
    }
  };

  get isVisor() {
    return this.props.globalRole === VISOR;
  }

  render() {
    const { lang, filters } = this.props;

    return (
      <div>
        <UnmountClosed isOpened={this.state.fullFilterView} springConfig={{ stiffness: 90, damping: 15 }}>
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
                  onPerformerSelect={options => this.setFilterValue('performerId', options)}
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
        <Row className={css.filtersRow}>
          <Col xs={12} sm={12}>
            <FilterList
              clearAll={this.props.clearFilters}
              fullFilterView={this.state.fullFilterView}
              toggleFilterView={this.toggleFilterView}
              sortedSprints={this.props.sortedSprints}
              filters={this.state.allFilters}
              openCreateTaskModal={this.props.openCreateTaskModal}
              isVisor={this.isVisor}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AgileBoardFilter;
