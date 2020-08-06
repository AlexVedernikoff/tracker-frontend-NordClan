import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import InputNumber from 'rc-input-number';

import * as css from './InputNumber.scss';

const CustomInputNumber = ({ className, postfix, ...props }) => (
  <div className={css.inputContainer}>
    <InputNumber className={classnames([className, css.input])} {...props} />
    {postfix ? <span className={css.postfix}>{postfix}</span> : null}
  </div>
);

CustomInputNumber.propTypes = {
  className: PropTypes.string,
  postfix: PropTypes.string
};

export default CustomInputNumber;
