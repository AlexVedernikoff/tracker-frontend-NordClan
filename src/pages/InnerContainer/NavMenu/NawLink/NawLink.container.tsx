import React from 'react';
import css from '../NavMenu.scss';
import { iconStyles } from '../NavMenu.constants';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

export function NawLink({ to, Icon, isActive, title }) {
  if (isActive) {
    return (
      <li className={css.sidebarItem}>
        <Link className={css.sidebarLink} activeClassName={css.activeLink} to={to}>
          <button>
            <Icon style={iconStyles} />
          </button>
          <span>{title}</span>
        </Link>
      </li>
    );
  }

  return null;
}

(NawLink as any).propTypes = {
  Icon: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object]).isRequired
};
