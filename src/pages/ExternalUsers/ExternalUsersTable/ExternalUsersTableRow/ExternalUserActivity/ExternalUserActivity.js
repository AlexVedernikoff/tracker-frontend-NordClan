import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../../../../components/Checkbox';
class ExternalUserActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    };
  }
  onActivityChange = () => {
    const newCheckboxState = !this.state.checked;
    this.setState(
      {
        checked: newCheckboxState
      },
      () => this.props.onValueChange(newCheckboxState)
    );
  };
  render() {
    return <Checkbox checked={this.state.checked} disabled={!this.props.isEditing} onChange={this.onActivityChange} />;
  }
}
ExternalUserActivity.propTypes = {
  checked: PropTypes.bool,
  fieldType: PropTypes.string,
  isEditing: PropTypes.bool,
  onValueChange: PropTypes.func
};
export default ExternalUserActivity;
