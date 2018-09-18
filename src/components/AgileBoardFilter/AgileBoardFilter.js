import React from 'react';

import { Row, Col } from 'react-flexbox-grid/lib/index';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import isEqual from 'lodash/isEqual';

import * as css from './AgileBoardFilter.scss';
import localize from './AgileBoardFilter.json';
import FilterForm from './FilterForm';

import Tag from '../Tag';
import getPriorityById from '../../utils/TaskPriority';
import Button from '../Button';
import { IconArrowDownThin, IconBroom } from '../Icons';
import { VISOR } from '../../constants/Roles';

class AgileBoardFilter extends React.Component {
  static propTypes = {};

  state = {
    isOpened: false,
    allFilters: []
  };

  componentDidMount = () => {
    this.updateFilterList();
  };

  componentWillReceiveProps = nextProps => {
    // TODO: на смену языка нужно обновлять стейт в FiltersManager
    if (nextProps.lang !== this.props.lang || nextProps.project.users !== this.props.project.users) {
      this.updateFilterList();
    }
  };

  toggleOpen = () => {
    this.setState(prevState => ({
      isOpened: !prevState.isOpened
    }));
  };

  get isVisor() {
    return this.props.globalRole === VISOR;
  }

  createSelectedOption = (optionList, selectedOption, optionLabel = 'name') => {
    const { lang } = this.props;
    if (Array.isArray(selectedOption)) {
      return selectedOption.map(currentId => ({
        name: `${optionLabel}-${currentId.value}`,
        label: optionLabel === 'performerId' ? `${localize[lang].PERFORMER}: ${currentId.label}` : currentId.label,
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

  removeSelectOptionByIdFromFilter = (list, id, filterField) => {
    const newList = list.filter(item => item.value !== id);
    this.props.setFilterValue(filterField, newList, this.updateListsAndTasks);
  };

  get nameField() {
    return this.props.lang === 'ru' ? 'fullNameRu' : 'fullNameEn';
  }

  updateListsAndTasks = () => {
    this.props.getTasks();
    this.updateFilterList();
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
        // TODO: не обновляется автор после получения списка юзеров
        return `${localize[lang].AUTHOR}: ${
          users.length ? users.find(user => user.id === filters.authorId)[this.nameField] : ''
        }`;
      case 'performerId':
        return `${localize[lang].PERFORMER}: ${this.createSelectedOption(users, filters.performerId, this.nameField) ||
          localize[lang].NOT_CHANGED}`;
      case 'name':
        return `${filters.name}`;
      default:
        return '';
    }
  };

  filterIsNotEmpty = filterName => {
    const filter = this.props.filters[filterName];
    if (typeof filter === 'string' || filter instanceof String || Array.isArray(filter)) {
      return filter.length > 0;
    }
    return filter !== null && filter !== false;
  };

  resetFiled = name => {
    this.props.setFilterValue(name, this.props.initialFilters[name], this.updateListsAndTasks);
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
        ...this.createSelectedOption([], this.props.filters.typeId, 'typeId'),
        ...this.createSelectedOption([], this.props.filters.performerId, 'performerId'),
        ...this.createSelectedOption([], this.props.filters.filterTags, 'filterTags')
      ]
    });
  };

  render() {
    const { clearAll, lang } = this.props;
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
        <span className={classnames(css.clearAllFilter)} data-tip={localize[lang].CLEAR_FILTERS}>
          <IconBroom onClick={clearAll} />
        </span>
      );

    return (
      <div>
        <FilterForm {...this.props} isOpened={this.state.isOpened} updateFilterList={this.updateFilterList} />
        <Row className={css.filtersRow}>
          <Col xs={12} sm={12}>
            <ReactCSSTransitionGroup transitionEnterTimeout={300} transitionLeave={false} transitionName="filter">
              {!this.state.isOpened && (
                <Row className={css.filtersRow}>
                  <Col xs>
                    {filterTags.length ? (
                      <div className={classnames(css.filterList)}>
                        <div>
                          {filterTags}
                          {clearAllButton}
                        </div>
                      </div>
                    ) : (
                      <div className={classnames(css.filterList)}>
                        <span onClick={this.toggleOpen} className={css.emptyFiltersLink}>
                          {localize[lang].NOT_SELECTED}
                        </span>
                      </div>
                    )}
                  </Col>
                  {!this.isVisor && (
                    <Col className={classnames(css.filterCol)}>
                      <Button
                        onClick={this.props.openCreateTaskModal}
                        type="primary"
                        text={localize[lang].CREATE_TASK}
                        icon="IconPlus"
                        name="right"
                      />
                    </Col>
                  )}
                </Row>
              )}
            </ReactCSSTransitionGroup>
            <div className={classnames(css.filterListShowMore)}>
              <div
                className={classnames(css.filterListShowMoreButton)}
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
