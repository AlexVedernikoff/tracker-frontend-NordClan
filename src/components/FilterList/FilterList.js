import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tag from '../Tag';
import classnames from 'classnames';
import * as css from './FilterList.scss';
import {connect} from 'react-redux';

export default class FilterList extends React.Component {
  render () {
    const {
      filters,
      ...other
    } = this.props;

    return (
      <div>
        {filters.map((filter) => {
          return <Tag name={filter.label} key={filter.name} />;
        })}
      </div>
    );
  }
}


FilterList.propTypes = {
  filters: PropTypes.object.isRequired
};
