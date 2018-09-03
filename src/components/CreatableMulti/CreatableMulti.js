import React, { Component } from 'react';
import Select from 'react-select';
import './CreatableMulti.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import localize from './CreatableMulti.json';

class CreatableMulti extends Component {
  static propTypes = {
    hint: PropTypes.string,
    label: PropTypes.string,
    options: PropTypes.array
  };

  render() {
    const { options, onChange, value, ...other } = this.props;

    return (
      <div>
        <Select.Creatable multi showNewOptionAtTop options={options} onChange={onChange} value={value} {...other} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(CreatableMulti);
