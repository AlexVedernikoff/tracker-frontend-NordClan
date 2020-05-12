import React from 'react';
import { func } from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import copy from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip';

import isEqual from 'lodash/isEqual';

import * as css from './AgileBoardFilter.scss';
import localize from './AgileBoardFilter.json';
import FilterForm from './FilterForm';

import CollapsibleRow from '../../../components/CollapsibleRow';
import Tag from '../../../components/Tag';
import Button from '../../../components/Button';
import { IconBroom } from '../../../components/Icons';

import { getFullName } from '../../../utils/NameLocalisation';
import getPriorityById from '../../../utils/TaskPriority';
import { isOnlyDevOps } from '../../../utils/isDevOps';

import { VISOR } from '../../../constants/Roles';
import { BACKLOG_ID } from '../../../constants/Sprint';

class AgileBoardFilter extends React.Component {
  static propTypes = {
    clearFilters: func.isRequired,
    setFilterValue: func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
      allFilters: []
    };
  }

  componentDidUpdate = prevProps => {
    ReactTooltip.rebuild();

    // const { currentSprint, isProjectInfoReceiving } = this.props;

    // if (!isProjectInfoReceiving && prevProps.isProjectInfoReceiving && this.isActiveSprintsChanged) {
    //   this.props.setFilterValue('changedSprint', currentSprint.map(s => s.value), this.updateFilterList);
    // }

    // if (this.isNoActiveSprintsLeft) {
    //   this.props.setFilterValue('changedSprint', [0], this.updateFilterList);
    // }

    // if (currentSprint !== prevProps.currentSprint && this.isSprintFilterEmpty) {
    //   const sprintValue = currentSprint && currentSprint.length ? currentSprint.map(s => s.value) : [0];
    //   this.props.setFilterValue('changedSprint', sprintValue, this.updateFilterList);
    // }

    // if (
    //   prevProps.project.users !== this.props.project.users ||
    //   prevProps.typeOptions !== this.props.typeOptions ||
    //   (!this.state.allFilters.length && !this.props.isFilterEmpty)
    // ) {
    //   this.updateFilterList();
    // }
  };

  toggleOpen = () => {
    this.setState(({ isOpened }) => ({ isOpened: !isOpened }));
  };

  get isActiveSprintsChanged() {
    const { currentSprint, filters } = this.props;

    return (
      this.isSprintFilterEmpty &&
      currentSprint &&
      currentSprint.length &&
      !isEqual(currentSprint.map(s => s.value), filters.changedSprint)
    );
  }

  get isNoActiveSprintsLeft() {
    const { currentSprint, filters } = this.props;

    return (
      !this.isSprintFilterEmpty &&
      currentSprint &&
      !currentSprint.length &&
      !filters.changedSprint.filter(sprint => sprint !== BACKLOG_ID).length
    );
  }

  get isSprintFilterEmpty() {
    const changedSprint = this.props.filters.changedSprint.filter(item => item !== BACKLOG_ID);
    return !changedSprint.length;
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
            // storage.setItem('sprintFilterChanged', 1);
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

  render() {
    const { lang, filters, setFilterValue, clearFilters } = this.props;

    const { isOpened } = this.state;

    return (
      <CollapsibleRow isOpened={isOpened} toggleOpen={this.toggleOpen}>
        <FilterForm
          updateFilterList={this.updateFilterList}
          shareButtonText={localize[lang].SHARE_FILTERS}
          lang={lang}
          filters={filters}
          setFilterValue={setFilterValue}
          clearFilters={clearFilters}
        />
        <Row className={css.filtersRow}>
          {/* <Col xs>
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
          </Col> */}
        </Row>
      </CollapsibleRow>
    );
  }
}

export default AgileBoardFilter;
