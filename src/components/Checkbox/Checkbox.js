import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Checkbox.scss';
import { IconCheck } from '../Icons';

const Checkbox = (props) => {

  const {
    checked,
    disabled,
    onChange,
    label,
    className,
    ...other
  } = props;

  return (
    <label {...other} className={classnames({[css.wrapper]: true, className, checked: checked, [css.disabled]: disabled})}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
      <span className={classnames({[css.pseudoSquare]: true, [css.withText]: !!label})}>
        <IconCheck />
      </span>
      <span>{label}</span>
    </label>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func
};

export default Checkbox;
