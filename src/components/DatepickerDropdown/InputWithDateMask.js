import React, { Component } from 'react';
import MaskedInput from 'react-text-mask';
import get from 'lodash/get';
import { dateMask } from '../../utils/masks';
import createAutoCorrectedDatePipe from '../../utils/createAutoCorrectedDatePipe';
import * as css from './DatepickerDropdown.scss';
import classnames from 'classnames';

const autoCorrectedDatePipe = createAutoCorrectedDatePipe('dd.mm.yyyy');

class InputWithDateMask extends Component {
  constructor() {
    super();
    this.state = {
      isHovered: false
    };
  }
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

  showCross() {
    this.setState({ isHovered: true });
  }

  hideCross() {
    this.setState({ isHovered: false });
  }

  render() {
    const canClear = this.props.canClear && this.state.isHovered && this.props.value;
    return (
      <div
        className={classnames({ [css.canClear]: canClear })}
        onMouseEnter={() => this.showCross()}
        onMouseLeave={() => this.hideCross()}
      >
        <MaskedInput
          autoComplete="off"
          ref={this.handleRef}
          mask={dateMask}
          pipe={autoCorrectedDatePipe}
          keepCharPositions
          {...this.props}
        />
        {canClear && (
          <span className="ClearValue" onClick={this.props.onClear}>
            ×
          </span>
        )}
      </div>
    );
  }
}

export default InputWithDateMask;
