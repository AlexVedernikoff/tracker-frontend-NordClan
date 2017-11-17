import React from 'react';
import * as css from './Input.scss';

const Input = props => {
  const { ...other } = props;
  return <input type="text" {...other} className={css.input} />;
};

export default Input;
