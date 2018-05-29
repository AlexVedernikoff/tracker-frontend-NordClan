import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TwoWayOptionsClass from '../../../utils/TwoWayOptionsClass';
import * as css from './TypeFilter.scss';
import Select from '../../../components/SelectDropdown';

class TypeFilter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    options: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.TwoWayOptions = {};
  }

  componentWillReceiveProps(newProps) {
    // if (newProps.options.length !== this.props.options.length) {
    const sourceOptions = [
      { label: 'Стажировка', value: 1, className: css.not },
      { label: 'Продуктовый', value: 2, className: css.equal },
      { label: 'Внутренний', value: 3, className: css.equal }
    ];
    this.TwoWayOptions = new TwoWayOptionsClass(sourceOptions, css.optGroupLabel, css.option);
    // }
  }

  onChange = selectedOptions => {
    const values = selectedOptions.map(option => option.value);

    const requestOptions = this.TwoWayOptions.requestOptions(values);
    const filteredOptions = this.TwoWayOptions.filteredOptions(values);

    this.props.onChange(filteredOptions, requestOptions);
  };

  render() {
    const { onChange, ...other } = this.props;

    return (
      <div className={css.typeFilter}>
        <Select
          name="performer"
          placeholder="Выберите тип проекта"
          multi
          noResultsText="Нет результатов"
          backspaceRemoves={false}
          options={this.TwoWayOptions.options}
          onChange={this.onChange}
          {...other}
        />
      </div>
    );
  }
}

export default TypeFilter;
