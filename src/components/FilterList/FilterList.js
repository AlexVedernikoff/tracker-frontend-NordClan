import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import ReactTooltip from 'react-tooltip';
import classnames from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';

import * as css from './FilterList.scss';
import localize from './FilterList.json';

import Tag from '../Tag';
import Button from '../Button';
import { IconArrowDownThin, IconBroom } from '../Icons';

class FilterList extends Component {
  componentWillReceiveProps() {
    ReactTooltip.hide();
  }

  updateFilterList = () => {
    // const singleOptionFiltersList = ['isOnlyMine', 'prioritiesId', 'authorId', 'name', 'noTag'];
    const selectedFilters = [];

    const changedSprint = this.changedSprint.map(sprint => {
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

  deleteTag = value => {
    this.setState(
      {
        filterTags: this.state.filterTags.filter(el => el.value !== value)
      },
      this.getTasks
    );
  };

  toOptionArray = (arr, name) => {
    if (Array.isArray(arr)) {
      return arr.map(el => {
        return {
          name: name,
          deleteHandler: () => this.deleteTag(el.value),
          label: el.label
        };
      });
    } else {
      return [];
    }
  };

  toggleMine = () => {
    this.setFilterValue('isOnlyMine', true);
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

  render() {
    const { filters, clearAll, isVisor, lang } = this.props;
    const filterTags = filters.map(filter => {
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
        <ReactCSSTransitionGroup transitionEnterTimeout={300} transitionLeave={false} transitionName="fff">
          {!this.props.fullFilterView && (
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
                    <span onClick={this.props.toggleFilterView} className={css.emptyFiltersLink}>
                      {localize[lang].NOT_SELECTED}
                    </span>
                  </div>
                )}
              </Col>
              {!isVisor && (
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
            data-tip={this.props.fullFilterView ? localize[lang].HIDE_FILTERS : localize[lang].SHOW_FILTERS}
            onClick={this.props.toggleFilterView}
          >
            <IconArrowDownThin
              className={classnames({
                [css.filterListShowMoreIcon]: true,
                [css.iconReverse]: this.props.fullFilterView
              })}
            />
          </div>
        </div>
      </div>
    );
  }
}

FilterList.propTypes = {
  clearAll: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  fullFilterView: PropTypes.bool.isRequired,
  isVisor: PropTypes.bool.isRequired,
  lang: PropTypes.string.isRequired,
  openCreateTaskModal: PropTypes.func.isRequired,
  toggleFilterView: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});
export default connect(
  mapStateToProps,
  null
)(FilterList);
