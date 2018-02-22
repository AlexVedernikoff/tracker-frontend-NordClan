import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from '../Tag';
import Button from '../../components/Button';
import classnames from 'classnames';
import * as css from './FilterList.scss';

export default class FilterList extends React.Component {
  showAllFilters = () => {
    console.log('showmore click');
  }
  render () {
    const {
      filters,
      ...other
    } = this.props;
    const filterList = filters.length ? (
      <div className={classnames(css.filterList)}>
        {filters.map((filter) => {
          if (filter.onDelete) return <Tag name={filter.label} onDelete={filter.onDelete} key={filter.name} />;
          return <Tag name={filter.label} key={filter.name} />;
        })}
      </div>
    ) : (
      <div className={classnames(css.filterListShowMore)}>
        <hr/>
        <div className={classnames(css.filterListShowMoreButton)}>
          <Button
            type="primary"
            text="Показать все"
            name="allFilters"
            onClick={this.showAllFilters}/>
        </div>
      </div>
    );
    return (
      <div>
        {filterList}
      </div>
    );
  }
}


FilterList.propTypes = {
  filters: PropTypes.array.isRequired
};
