import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import * as css from './Input.scss';

interface Props {
  onClear?: Function
  canClear: boolean
  inputRef: React.LegacyRef<HTMLInputElement>
  placeholder: string
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

const Input = (props: Props) => {
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
