import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Logo.scss';

const Logo = props => {
  return (
    <div className={classnames({ [css.logo]: true, [css.onLight]: props.onLight })} style={props.style}>
      [Epic]
    </div>
  );
};

Logo.propTypes = {
  onLight: PropTypes.bool,
  style: PropTypes.object
};

export default Logo;
