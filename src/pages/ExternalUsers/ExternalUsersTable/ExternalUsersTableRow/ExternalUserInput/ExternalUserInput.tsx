import React, { Component } from 'react';
// import css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
// import Input from '../../../../../components/Input';
// import { IconEdit, IconCheck, IconClose } from '../../../../../components/Icons';
import css from '../../../../../components/Input/Input.scss';
import classnames from 'classnames';
import ownStyles from './ExternalUserInput.scss';

class ExternalUserInput extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  onInputChange = e => {
    this.props.onValueChange(e.target.value);
  };

  get maxLength() {
    const defaultMaxLength = 100;
    return this.props.noLengthConstraints ? undefined : defaultMaxLength;
  }

  render() {
    const { isValid } = this.props;
    return (
      <div className={ownStyles.container}>
        {this.props.isEditing ? (
          <input
            type="text"
            maxLength={this.maxLength}
            defaultValue={this.props.value}
            onChange={this.onInputChange}
            className={classnames(css.input, {
              [css.inputError]: isValid && isValid !== undefined
            })}
          />
        ) : (
          <div title={this.props.value} className={ownStyles.value}>
            {this.props.value}
          </div>
        )}
      </div>
    );
  }
}
(ExternalUserInput as any).propTypes = {
  fieldType: PropTypes.string,
  isEditing: PropTypes.bool,
  isValid: PropTypes.bool,
  noLengthConstraints: PropTypes.bool,
  onValueChange: PropTypes.func,
  value: PropTypes.string
};
export default ExternalUserInput;
