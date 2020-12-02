import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InputNumberClass from 'rc-input-number';

import * as css from './InputNumber.scss';

interface Props extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
}

const InputNumber = InputNumberClass as unknown as React.ComponentClass<Props>

type CustomInputNumberOption = {
  className?: string | number | Record<string, boolean>,
  postfix: React.ReactElement | string,
  min?:	number,
  onClick?: () => void,
  placeholder?:	string,
  max?:	number,
  step?:	number,
  precision?:	number
  disabled?:	boolean,
  focusOnUpDown?:	boolean,
  required?:	boolean,
  autoFocus?:	boolean,
  readOnly?:	boolean,
  name?:	string,
  id?:	string,
  value?:	number,
  defaultValue?:	number,
  onChange?:	(value: number) => void,
  onFocus?:	() => void,
  style?:	object,
  upHandler?:	React.ReactNode,
  downHandler?:	React.ReactNode,
  formatter?:	(value: number|string) => string,
  parser?:	(displayValue: string) => number,
  pattern?:	string
  maxLength?:	number
}

const CustomInputNumber = (option: CustomInputNumberOption) => {
  const { className, postfix, ...props } = option;
  return (
    <div className={css.inputContainer}>
      <InputNumber className={classnames([className, css.input])} {...(props as any)} />
      {postfix ? <span className={css.postfix}>{postfix}</span> : null}
    </div>
  )
  };

(CustomInputNumber as any).propTypes = {
  className: PropTypes.string,
  postfix: PropTypes.string
};

export default CustomInputNumber;
