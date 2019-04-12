import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../../../../components/Checkbox';
class ExternalUserActivity extends Component {
  constructor(props) {
    super(props);
  }

  onActivityChange = event => {
    this.props.onValueChange(event.target.value === 'true' ? 0 : 1);
  };

  render() {
    const { isLoading, isEditing, checked } = this.props;
    return <Checkbox checked={checked} disabled={!isEditing || isLoading} onChange={this.onActivityChange} />;
  }
}
ExternalUserActivity.propTypes = {
  checked: PropTypes.bool,
  isEditing: PropTypes.bool,
  isLoading: PropTypes.bool,
  onValueChange: PropTypes.func
};
export default ExternalUserActivity;
