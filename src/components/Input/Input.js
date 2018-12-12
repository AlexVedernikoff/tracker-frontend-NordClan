import React from 'react';
import * as css from './Input.scss';

const Input = props => {
  /* eslint-disable no-unused-vars */
  const { inputRef, ...other } = props;
  return <input type="text" {...other} ref={props.inputRef} className={css.input} />;
};

export default Input;
