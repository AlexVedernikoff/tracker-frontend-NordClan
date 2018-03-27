import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../../../../components/Checkbox';
class ExternalUserActivity extends Component {
  constructor(props) {
    super(props);
  }
  onActivityChange = () => {
    this.props.changeValue({ [this.props.fieldType]: !this.props.checked });
  };
  render() {
    return <Checkbox checked={this.props.checked} onChange={this.onActivityChange} />;
  }
}
ExternalUserActivity.propTypes = {
  changeValue: PropTypes.func,
  checked: PropTypes.bool,
  fieldType: PropTypes.string
};
export default ExternalUserActivity;
