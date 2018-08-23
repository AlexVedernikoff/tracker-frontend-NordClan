import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TwoWayOptionsClass from '../../../utils/TwoWayOptionsClass';
import * as css from './TypeFilter.scss';
import Select from '../../../components/SelectDropdown';

class TypeFilter extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    dictionary: PropTypes.array
  };

  static defaultProps = {
    dictionary: []
  };

  constructor(props) {
    super(props);
    this.TwoWayOptions = {};
  }

  componentWillReceiveProps(newProps) {
    const isOldOptions = this.props.dictionary.length;
    const isNewOptions = newProps.dictionary.length !== this.props.dictionary.length;

    if (isOldOptions || isNewOptions) {
      const sourceOptions = newProps.dictionary.map(type => ({ label: type.name, value: type.id }));
      this.TwoWayOptions = new TwoWayOptionsClass(sourceOptions, css.optGroupLabel, css.option);
    }
  }

  get options() {
    // return this.TwoWayOptions.options; // Возможность задавать иключающие опции поиска.
    return this.TwoWayOptions.sourceOptions; // Только оригинальные опции
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
          options={this.options}
          onChange={this.onChange}
          {...other}
        />
      </div>
    );
  }
}

export default TypeFilter;
