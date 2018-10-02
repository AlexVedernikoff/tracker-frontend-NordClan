import React from 'react';

import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import copy from 'copy-to-clipboard';
import ReactTooltip from 'react-tooltip';

import * as css from './AgileBoardFilter.scss';
import localize from './AgileBoardFilter.json';
import FilterForm from './FilterForm';

import Tag from '../Tag';
import getPriorityById from '../../utils/TaskPriority';
import Button from '../Button';
import { IconArrowDownThin, IconBroom } from '../Icons';
import { VISOR } from '../../constants/Roles';
import { getFullName } from '../../utils/NameLocalisation';

class AgileBoardFilter extends React.Component {
  static propTypes = {};

  state = {
    isOpened: false,
    allFilters: []
  };

  componentDidMount = () => {
    this.updateFilterList();
  };

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  componentDidUpdate = prevProps => {
    const { currentSprint } = this.props;
    if (currentSprint.length && currentSprint !== prevProps.currentSprint && this.isBacklogSelected) {
      this.props.setFilterValue('changedSprint', [currentSprint[0].value], this.updateFilterList);
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

  get isBacklogSelected() {
    const {
      filters: { changedSprint }
    } = this.props;
    return changedSprint.length === 1 && changedSprint[0] === 0;
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
      project: { users },
      noTagData
    } = this.props;
    switch (filterName) {
      case 'isOnlyMine':
        return localize[lang].MY_TASKS;
      case 'noTag':
        return noTagData.label;
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
    if (!this.props.project.users.length || !this.props.typeOptions.length) {
      return;
    }

    const { filters } = this.props;
    const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'name', 'noTag'];

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
    this.props.clearFilters(this.updateFilterList);
  };

  render() {
    const { lang } = this.props;
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
      <div>
        <FilterForm
          {...this.props}
          isOpened={this.state.isOpened}
          updateFilterList={this.updateFilterList}
          generateShareLink={this.generateShareLink}
          shareButtonText={localize[lang].SHARE_FILTERS}
        />
        <Row className={css.filtersRow}>
          <Col xs={12} sm={12}>
            <ReactCSSTransitionGroup transitionEnterTimeout={300} transitionLeave={false} transitionName="filter">
              {!this.state.isOpened && (
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
                  {!this.isVisor && (
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
              )}
            </ReactCSSTransitionGroup>
            <div className={css.filterListShowMore}>
              <div
                className={css.filterListShowMoreButton}
                data-tip={this.state.isOpened ? localize[lang].HIDE_FILTERS : localize[lang].SHOW_FILTERS}
                onClick={this.toggleOpen}
              >
                <IconArrowDownThin
                  className={classnames({
                    [css.filterListShowMoreIcon]: true,
                    [css.iconReverse]: this.state.isOpened
                  })}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AgileBoardFilter;
