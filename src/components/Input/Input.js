import React from 'react';
import { boolean, func } from 'prop-types';
import * as css from './Input.scss';
import classnames from 'classnames';

const Input = props => {
  /* eslint-disable no-unused-vars */
  const { inputRef, canClear, ...other } = props;
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

Input.propTypes = {
  canClear: boolean,
  onClear: func
};

export default Input;
