import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Button.scss';
import * as icons from '../Icons';

const Button = (props) => {
  const {
    icon,
    type,
    htmlType,
    text,
    loading,
    addedClassNames,
    ...other
  } = props;

  const Icon = icon ? icons[icon] : null;

  return (
    <button
      {...other}
      type={htmlType ? htmlType : 'button'}
      className={classnames({
        [css.btn]: true,
        [css[type]]: !!type,
        [css.withIcon]: !!icon || loading,
        [css.onlyIcon]: !!icon && !text,
        ...addedClassNames
      })}>
      {icon && !loading
        ? <Icon className={css.icon}/>
        : null}
      {loading
        ? <icons.IconPreloader className={css.icon}/>
        : null}
      {text}
    </button>
  );
};

Button.propTypes = {
  addedClassNames: PropTypes.object,
  htmlType: PropTypes.string,
  icon: PropTypes.string,
  loading: PropTypes.bool,
  text: PropTypes.string,
  type: PropTypes.string
};

export default Button;
