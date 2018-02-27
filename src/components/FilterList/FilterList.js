import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from '../Tag';
import Button from '../../components/Button';
import classnames from 'classnames';
import {IconClose} from '../Icons';
import * as css from './FilterList.scss';

export default class FilterList extends React.Component {
  render () {
    const {
      filters,
      clearAll,
      toggleFilterView,
      fullFilterView,
      ...other
    } = this.props;

    return (
      <div>
        {
          filters.length && !fullFilterView
          ? <div className={classnames(css.filterList)}>
            {filters.map((filter) => {
              return <Tag name={filter.label} deleteTag={filter.onDelete} key={filter.name} />;
            })}
            <span className={classnames(css.clearAllFilter)}>
              <IconClose onClick={clearAll}/>
            </span>
          </div> : ''
        }
        <div className={classnames(css.filterListShowMore)}>
          <hr/>
          <div className={classnames(css.filterListShowMoreButton)}>
            <Button
              type="primary"
              text={fullFilterView ? 'Скрыть фильтры' : 'Показать фильтры'}
              name="allFilters"
              onClick={toggleFilterView}/>
          </div>
        </div>
      </div>
    );
  }
}


FilterList.propTypes = {
  filters: PropTypes.array.isRequired,
  fullFilterView: PropTypes.bool.isRequired,
  clearAll: PropTypes.func.isRequired,
  toggleFilterView: PropTypes.func.isRequired
};
