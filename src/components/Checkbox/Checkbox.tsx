import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Checkbox.scss';
import { IconCheck } from '../Icons';

const Checkbox = props => {
  const { disabled, onChange, label, className, refCallback, ...other } = props;
  const checked = props.checked || false;

  const type = 'checkbox';
  const ref = refCallback ? el => refCallback(el) : null;
  const baseProps = { type, disabled, onChange, ref };
  const inputCheckbox = checked !== undefined ? <input checked={checked} {...baseProps} /> : <input {...baseProps} />;
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
  onChange: () => {}
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  refCallback: PropTypes.func
};

export default Checkbox;
