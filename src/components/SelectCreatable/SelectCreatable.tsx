import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SelectDropdown from '../SelectDropdown';
import localize from './SelectCreatable.json';

class SelectCreatable extends Component<any, any> {
  isOptionUnique = ({ option, options, labelKey }) => {
    if (!options || !options.length) {
      return true;
    }

    return !options.some(existingOption => existingOption[labelKey] === option[labelKey]);
  };

  newOptionCreator = ({ label, labelKey, valueKey }) => {
    const option = {};
    option[valueKey] = null;
    option[labelKey] = label;
    option.className = 'Select-create-option-placeholder';

    return option;
  };

  onNewOptionClick = option => {
    const { onCreateClick } = this.props;
    onCreateClick(option);
  };

  render() {
    const { options, onChange, value, lang, ...other } = this.props;

    return (
      <SelectDropdown
        creatable
        onNewOptionClick={this.onNewOptionClick}
        newOptionCreator={this.newOptionCreator}
        isOptionUnique={this.isOptionUnique}
        multi={false}
        showNewOptionAtTop
        options={options}
        onChange={onChange}
        value={value}
        promptTextCreator={label => `${localize[lang].CREATE_NEW_OPTION}: ${label}`}
        noResultsText={localize[lang].NO_RESULTS}
        {...other}
      />
    );
  }
}

(SelectCreatable as any).propTypes = {
  lang: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onCreateClick: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.object
};

export default SelectCreatable;
