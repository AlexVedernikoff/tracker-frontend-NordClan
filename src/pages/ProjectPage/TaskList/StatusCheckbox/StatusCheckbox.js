import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../../../../components/Checkbox';

class StatusCheckbox extends Component {

  onCheckboxChange = (event) => {
    this.props.onChange(this.props.status.id, event);
  };

  render () {
    const { status, checked } = this.props;

    return (
      <Checkbox
        label={status.name}
        onChange={this.onCheckboxChange}
        checked={checked}
      />
    );
  }
}

StatusCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired
};

export default StatusCheckbox;
