import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Button.scss';
import * as icons from '../Icons';

const Button = (props) => {

  const {
    icon,
    type,
    text,
    ...other
  } = props;

  const Icon = icon ? icons[icon] : null;

  return (
    <button
      {...other}
      className={classnames({
        [css.btn]: true,
        [css[type]]: !!type,
        [css.withIcon]: !!icon,
        [css.onlyIcon]: !!icon && !text
      })}>
      {icon
        ? <Icon className={css.icon}/>
        : null}
      {text}
    </button>
  );
};

Button.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string
};

export default Button;
