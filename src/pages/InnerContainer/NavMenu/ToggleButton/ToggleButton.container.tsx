import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import * as css from '../NavMenu.styles.scss';
import { IconArrowLeft, IconArrowRight } from '../../../../components/Icons';
import { iconStyles } from '../NavMenu.constants';

export function ToggleButton({ mqlMatches, toggleMenu, sidebarOpened }) {
  const Arrow = sidebarOpened ? IconArrowLeft : IconArrowRight;

  if (mqlMatches) {
    return (
      <button key="toggle_btn" className={classNames(css.sidebarClosed, css.toggleButton)} onClick={toggleMenu}>
        <Arrow style={iconStyles} />
      </button>
    );
  }

  return null;
}

ToggleButton.propTypes = {
  mqlMatches: PropTypes.bool.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
  toggleMenu: PropTypes.func.isRequired
};
