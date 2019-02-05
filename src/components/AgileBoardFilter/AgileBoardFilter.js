import React from 'react';

import { Row, Col } from 'react-flexbox-grid/lib/index';
import CollapsibleRow from '../CollapsibleRow';
import copy from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip';
import isEqual from 'lodash/isEqual';

import * as css from './AgileBoardFilter.scss';
import localize from './AgileBoardFilter.json';
import FilterForm from './FilterForm';

import Tag from '../Tag';
import getPriorityById from '../../utils/TaskPriority';
import Button from '../Button';
import { IconBroom } from '../Icons';
import { VISOR } from '../../constants/Roles';
import { getFullName } from '../../utils/NameLocalisation';
import { storageType } from '../FiltrersManager/helpers';
import { isOnlyDevOps } from '../../utils/isDevOps';

const storage = storageType === 'local' ? localStorage : sessionStorage;

class AgileBoardFilter extends React.Component {
  static propTypes = {};

  state = {
    isOpened: false,
    allFilters: []
  };

  componentDidMount() {
    if (storage.getItem('sprintFilterChanged') === null) {
      storage.setItem('sprintFilterChanged', 0);
    }
  }

  componentDidUpdate = prevProps => {
    ReactTooltip.rebuild();

    const { currentSprint, isProjectInfoReceiving } = this.props;

    if (!isProjectInfoReceiving && prevProps.isProjectInfoReceiving && this.isActiveSprintsChanged) {
      this.props.setFilterValue('changedSprint', currentSprint.map(s => s.value), this.updateFilterList);
    }

    if (this.isNoActiveSprintsLeft) {
      this.props.setFilterValue('changedSprint', [0], this.updateFilterList);
    }

    if (currentSprint !== prevProps.currentSprint && this.isSprintFilterEmpty) {
      const sprintValue = currentSprint && currentSprint.length ? currentSprint.map(s => s.value) : [0];
      this.props.setFilterValue('changedSprint', sprintValue, this.updateFilterList);
    }

    if (
      prevProps.project.users !== this.props.project.users ||
      prevProps.typeOptions !== this.props.typeOptions ||
      (!this.state.allFilters.length && !this.props.isFilterEmpty)
    ) {
      this.updateFilterList();
    }
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened
    }));
  };

  get isActiveSprintsChanged() {
    const { currentSprint, filters } = this.props;
    const isSprintFilterChanged = +storage.getItem('sprintFilterChanged');

    return (
      this.isSprintFilterEmpty &&
      currentSprint &&
      currentSprint.length &&
      !isEqual(currentSprint.map(s => s.value), filters.changedSprint) &&
      !isSprintFilterChanged
    );
  }

  get isNoActiveSprintsLeft() {
    const { currentSprint, filters } = this.props;
    const isSprintFilterChanged = +storage.getItem('sprintFilterChanged');

    return (
      !this.isSprintFilterEmpty &&
      currentSprint &&
      !currentSprint.length &&
      filters.changedSprint[0] !== 0 &&
      !isSprintFilterChanged
    );
  }

  get isSprintFilterEmpty() {
    const {
      filters: { changedSprint }
    } = this.props;
    return !(changedSprint.length > 1);
  }

  get isVisor() {
    return this.props.globalRole === VISOR;
  }

  removeSprint(list, value, filterName) {
    if (list.length === 1) {
      if (value === 0) {
        return;
      }
      this.props.setFilterValue(filterName, [0], this.updateFilterList);
      return;
    }

    this.removeSelectOptionByIdFromFilter(list, value, filterName);
  }

  getOptionData(label, value) {
    const {
      project: { users },
      typeOptions,
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
        return this.props.sortedSprints.find(el => el.value === value).label;
      case 'typeId':
        return typeOptions.find(el => el.value === value).label;
      default:
        return value;
    }
  }

  createSelectedOption = (optionList, selectedOption, optionLabel = 'name') => {
    const { lang } = this.props;
    if (Array.isArray(selectedOption)) {
      return selectedOption.map(currentId => ({
        name: `${optionLabel}-${currentId}`,
        label:
          optionLabel === 'performerId'
            ? `${localize[lang].PERFORMER}: ${this.getOptionData(optionLabel, currentId)}`
            : this.getOptionData(optionLabel, currentId),
        deleteHandler: () => {
          if (optionLabel === 'changedSprint') {
            storage.setItem('sprintFilterChanged', 1);
            this.removeSprint(selectedOption, currentId, optionLabel);
            return;
          }
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
    const newList = list.filter(item => item !== id);
    this.props.setFilterValue(filterField, newList, this.updateFilterList);
  };

  createFilterLabel = filterName => {
    const {
      lang,
      filters,
      project: { users }
    } = this.props;
    switch (filterName) {
      case 'isOnlyMine':
        return localize[lang].MY_TASKS;
      case 'prioritiesId':
        return `${getPriorityById(filters.prioritiesId)}`;
      case 'authorId':
        return `${localize[lang].AUTHOR}: ${
          users.length ? getFullName(users.find(user => user.id === filters.authorId)) : ''
        }`;
      case 'name':
        return `${filters.name}`;
      default:
        return '';
    }
  };

  resetFiled = name => {
    this.props.setFilterValue(name, this.props.initialFilters[name], this.updateFilterList);
  };

  updateFilterList = () => {
    const {
      filters,
      project: { users },
      sortedSprints
    } = this.props;
    const sortedSprintsValues = sortedSprints.map(el => el.value);

    // проверяем, пришли ли данные по юзерам в проекте, если они есть в фильтре
    if (
      (!users.length && (filters.authorId || filters.performerId)) ||
      !this.props.typeOptions.length ||
      (filters.changedSprint.length && !filters.changedSprint.every(el => sortedSprintsValues.includes(el)))
    ) {
      return;
    }

    const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'name'];

    const selectedFilters = singleOptionFiltersList.reduce((result, filterName) => {
      if (!this.props.checkFilterItemEmpty(filterName)) {
        result.push({
          name: filterName,
          label: this.createFilterLabel(filterName),
          deleteHandler: () => this.resetFiled(filterName)
        });
      }
      return result;
    }, []);

    this.setState({
      allFilters: [
        ...selectedFilters,
        ...this.createSelectedOption([], filters.changedSprint, 'changedSprint'),
        ...this.createSelectedOption([], filters.typeId, 'typeId'),
        ...this.createSelectedOption([], filters.performerId, 'performerId'),
        ...this.createSelectedOption([], filters.filterTags, 'filterTags')
      ]
    });
  };

  generateShareLink = () => {
    try {
      const link = this.props.mapFiltersToUrl();
      copy(link);
      this.props.showNotification({
        message: localize[this.props.lang].SHARE_SUCCESS,
        type: 'success'
      });
    } catch (e) {
      this.props.showNotification({
        message: localize[this.props.lang].SHARE_ERROR,
        type: 'error'
      });
      return {};
    }
  };

  clearFilters = () => {
    this.props.clearFilters({ changedSprint: [0] }, this.updateFilterList);
    storage.setItem('sprintFilterChanged', 1);
  };

  render() {
    const { lang, user, project } = this.props;
    const { isOpened } = this.state;
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
    const clearAllButton =
      filterTags.length === 1 && filterTags[0].key === 'Backlog' ? null : (
        <span className={css.clearAllFilter} data-tip={localize[lang].CLEAR_FILTERS} onClick={this.clearFilters}>
          <IconBroom />
        </span>
      );
    return (
      <CollapsibleRow isOpened={isOpened} toggleOpen={this.toggleOpen}>
        <FilterForm
          {...this.props}
          updateFilterList={this.updateFilterList}
          generateShareLink={this.generateShareLink}
          shareButtonText={localize[lang].SHARE_FILTERS}
        />
        <Row className={css.filtersRow}>
          <Col xs>
            {filterTags.length ? (
              <div className={css.filterList}>
                <div>
                  {filterTags}
                  {clearAllButton}
                </div>
              </div>
            ) : (
              <div className={css.filterList}>
                <span onClick={this.toggleOpen} className={css.emptyFiltersLink}>
                  {localize[lang].NOT_SELECTED}
                </span>
              </div>
            )}
          </Col>
          {!this.isVisor &&
            !isOnlyDevOps(user, project.id) && (
              <Col className={css.filterCol}>
                <Button
                  onClick={this.props.openCreateTaskModal}
                  type="primary"
                  text={localize[lang].CREATE_TASK}
                  icon="IconPlus"
                  name="right"
                />
              </Col>
            )}
          <Col className={css.filterCol}>
            <Button
              onClick={this.generateShareLink}
              data-tip={localize[lang].SHARE_FILTERS}
              type="primary"
              icon="IconLink"
              name="right"
              disabled={this.props.isFilterEmpty}
            />
          </Col>
        </Row>
      </CollapsibleRow>
    );
  }
}

export default AgileBoardFilter;
