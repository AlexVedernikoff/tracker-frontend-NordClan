import React from 'react';
import classnames from 'classnames';
import { bool, func } from 'prop-types';

import * as css from './Input.scss';

const Input = props => {
  const { inputRef, canClear = false, onClear, ...restProps } = props;

  const inputElem = <input type="text" {...restProps} ref={inputRef} className={css.input} />;

  if (canClear) {
    return (
      <div className={classnames({ [css.inputWrapper]: true })}>
        {inputElem}
        <span
          className="ClearValue"
          onClick={() => {
            if (typeof onClear === 'function') {
              onClear();
            }
          }}
        >
          ×
        </span>
      </div>
    );
  }

  return inputElem;
};

Input.propTypes = {
  canClear: bool,
  onClear: func
};

export default Input;
