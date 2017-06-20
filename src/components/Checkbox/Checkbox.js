import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Checkbox.scss';
import { IconCheck } from '../Icons';

const Checkbox = (props) => {

  const {
    checked,
    onChange,
    ...other
  } = props;

  return (
    <label {...other} className={css.wrapper}>
      <input type="checkbox" checked={checked} onChange={onChange}/>
      <span className={css.pseudoSquare}>
        <IconCheck />
      </span>
    </label>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func
};

export default Checkbox;
