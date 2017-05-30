import React from 'react';
import PropTypes from 'prop-types';
import * as css from './Button.scss';
import classnames from 'classnames';
import * as icons from '../Icons';

const Button = (props) => {

  const Icon = props.icon ? icons[props.icon] : null;

  return (
    <button
      className={classnames({
        [css.btn]: true,
        [css[props.type]]: !!props.type,
        [css.withIcon]: !!props.icon,
        [css.onlyIcon]: !!props.icon && !props.text
      })}>
      {props.icon
        ? <Icon className={css.icon}/>
        : null}
      {props.text}
    </button>
  );
};

Button.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string
};

export default Button;
