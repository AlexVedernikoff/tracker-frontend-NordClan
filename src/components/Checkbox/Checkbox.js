import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Checkbox.scss';
import { IconCheck } from '../Icons';

const Checkbox = props => {
  const { checked, disabled, onChange, label, className, refCallback, ...other } = props;

  const type = 'checkbox';
  const ref = refCallback ? el => refCallback(el) : null;
  const baseProps = { type, disabled, onChange, ref };
  const inputCheckbox = checked ? <input checked={checked} {...baseProps} /> : <input {...baseProps} />;
  return (
    <label
      {...other}
      className={classnames({ [css.wrapper]: true, [className]: true, checked: checked, [css.disabled]: disabled })}
    >
      {inputCheckbox}
      <span className={classnames({ [css.pseudoSquare]: true, [css.withText]: !!label })}>
        <IconCheck />
      </span>
      <span>{label}</span>
    </label>
  );
};

Checkbox.defaultProps = {
  checked: false,
  onChange: () => {}
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  refCallback: PropTypes.func,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func
};

export default Checkbox;
