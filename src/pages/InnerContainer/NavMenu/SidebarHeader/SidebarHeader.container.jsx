import React from 'react';
import * as css from '../NavMenu.styles.scss';
import PropTypes from 'prop-types';
import { getFullName } from '../../../../utils/NameLocalisation';
import Photo from './Photo';

export function SidebarHeader({ user, sidebarOpened }) {
  const { department } = user;

  const render = (() => {
    if (sidebarOpened) {
      return (
        <div className={css.userNameContainer}>
          <div className={css.userName}>{getFullName(user)}</div>
          <div className={css.userGroups}>{department}</div>
        </div>
      );
    }
    return null;
  })();

  return (
    <div className={css.sidebarHeader}>
      <div className={css.ava}>
        <Photo user={user} />
      </div>
      {render}
    </div>
  );
}

SidebarHeader.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
  user: PropTypes.object
};
