import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Button.scss';
import * as icons from '../Icons';

const Checkbox = (props) => {

  const {
    checked,
    ...other
  } = props;

  return (
    <span/>
  );
};

Checkbox.propTypes = {
  checked: PropTypes.bool
};

export default Checkbox;
