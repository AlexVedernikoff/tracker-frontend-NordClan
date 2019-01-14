import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import get from 'lodash/get';
import { dateMask } from '../../utils/masks';
import createAutoCorrectedDatePipe from '../../utils/createAutoCorrectedDatePipe';

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd.mm.yyyy');

class InputWithDateMask extends Component {
  // Method 'focus' is a workaround for an error with custom inputs in react-day-picker library.
  // You can find more info at https://github.com/gpbl/react-day-picker/issues/378
  focus() {
    if (!get(this, 'inputNode.inputElement')) {
      return;
    }

    this.inputNode.inputElement.focus();
  }

  handleRef = node => {
    this.inputNode = node;
  };

  render() {
    return (
      <MaskedInput
        autoComplete="off"
        ref={this.handleRef}
        mask={dateMask}
        pipe={autoCorrectedDatePipe}
        keepCharPositions
        {...this.props}
      />
    );
  }
}

export default InputWithDateMask;
