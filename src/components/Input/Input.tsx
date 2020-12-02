import classnames from 'classnames';
import React, { ChangeEvent } from 'react';
import * as css from './Input.scss';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  onClear?: Function
  canClear?: boolean
  inputRef?: React.LegacyRef<HTMLInputElement>
  defaultValue?: string
  readOnly?: boolean
}

const Input = (props: Props) => {
  const { inputRef, canClear = false, onClear, readOnly, defaultValue, ...other } = props;
  const disabled = readOnly ? {'disabled' : true} : {};
  const value = defaultValue ? {'value' : defaultValue} : {};
  const inputElem = <input type="text" {...other} {...disabled} {...value} ref={props.inputRef} className={css.input} />;
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
