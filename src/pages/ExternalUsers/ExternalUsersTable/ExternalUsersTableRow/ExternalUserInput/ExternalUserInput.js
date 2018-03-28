import React, { Component } from 'react';
// import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import Input from '../../../../../components/Input';
import { IconEdit, IconCheck, IconClose } from '../../../../../components/Icons';

class ExternalUserInput extends Component {
  constructor(props) {
    super(props);
  }

  onInputChange = e => {
    this.props.onValueChange(e.target.value);
  };

  render() {
    return (
      <div>
        {this.props.isEditing ? (
          <Input type="text" maxLength={100} defaultValue={this.props.value} onChange={this.onInputChange} />
        ) : (
          <div>{this.props.value}</div>
        )}
      </div>
    );
  }
}
ExternalUserInput.propTypes = {
  fieldType: PropTypes.string,
  isEditing: PropTypes.bool,
  onValueChange: PropTypes.func,
  value: PropTypes.string
};
export default ExternalUserInput;
