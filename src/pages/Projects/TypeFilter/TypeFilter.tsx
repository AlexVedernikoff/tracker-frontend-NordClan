import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TwoWayOptionsClass from '../../../utils/TwoWayOptionsClass';
import * as css from './TypeFilter.scss';
import Select from '../../../components/SelectDropdown';
import localize from './TypeFilter.json';
import { getProjectTypes } from '../../../selectors/dictionaries';

class TypeFilter extends Component {
  static propTypes = {
    dictionary: PropTypes.array,
    onChange: PropTypes.func
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
    const { lang, projectTypes, ...other } = this.props;
    const options = projectTypes.map(type => ({ value: type.id, label: localize[this.props.lang][type.codename] }));
    return (
      <div className={css.typeFilter}>
        <Select
          name="performer"
          placeholder={localize[lang].PLACEHOLDER}
          multi
          noResultsText={localize[lang].NO_RESULTS}
          backspaceRemoves={false}
          options={options}
          onChange={this.onChange}
          {...other}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  projectTypes: getProjectTypes(state) || []
});

export default connect(mapStateToProps)(TypeFilter);
