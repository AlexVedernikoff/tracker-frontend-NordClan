import React from 'react';
import * as css from '../NavMenu.styles.scss';
import PropTypes from 'prop-types';
import { getFullName } from '../../../../utils/NameLocalisation';
import { PhotoInitials } from '../../../../components/Photo';

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

  const bg: any = {};
  if (user.photo) {
    bg.backgroundColor = 'transparent';
    bg.backgroundImage = `url(${user.photo})`;
  }

  return (
    <div className={css.sidebarHeader}>
      <div className={css.ava} style={bg}>
        {!user.photo && <PhotoInitials user={user} />}
      </div>
      {render}
    </div>
  );
}

(SidebarHeader as any).propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
  user: PropTypes.object
};
