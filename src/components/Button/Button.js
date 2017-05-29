import React from 'react';
import PropTypes from 'prop-types';
import * as css from './Button.scss';
import classnames from 'classnames';

const Button = (props) => {
  return (
    <button
      className={classnames({
        [css.btn]: true,
        [css[props.type]]: !!props.type
      })}>
      {props.text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  type: PropTypes.string
};

export default Button;
