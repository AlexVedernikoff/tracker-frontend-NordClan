import classnames from 'classnames';
import React from 'react';
import * as css from './Input.scss';

const Input = props => {
  /* eslint-disable no-unused-vars */
  const { inputRef, canClear, onClear, ...other } = props;
  const inputElem = <input type="text" {...other} ref={props.inputRef} className={css.input} />;
  return canClear ? (
    <div className={classnames({ [css.inputWrapper]: true })}>
      {inputElem}
      <span
        className="ClearValue"
        onClick={e => {
          if (props.onClear) {
            props.onClear();
          }
        }}
      >
        ×
      </span>
    </div>
  ) : (
    inputElem
  );
};

export default Input;
