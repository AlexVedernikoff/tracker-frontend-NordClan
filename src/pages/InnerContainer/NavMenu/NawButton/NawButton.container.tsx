import React from 'react';
import * as css from '../NavMenu.styles.scss';
import { iconStyles } from '../NavMenu.constants';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export function NawButton({ to, Icon, isActive }) {
  if (isActive) {
    return (
      <li>
        <Link className={css.sidebarLinkClosed} activeClassName={css.activeLink} to={to}>
          <Icon style={iconStyles} />
        </Link>
      </li>
    );
  }

  return null;
}

NawButton.propTypes = {
  Icon: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]).isRequired
};
