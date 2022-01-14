import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { head } from 'lodash';
import { getFirstName, getLastName } from '../../utils/NameLocalisation';
import { IconUser, IconPhoto } from '../Icons';
import * as css from './Photo.scss';

export function PhotoInitials({ user }) {
  const [firstName, lastName] = [getFirstName, getLastName].map(fn => fn(user));
  if (firstName && lastName) {
    return <span>{`${head(firstName)} ${head(lastName)}`}</span>;
  }
  return null;
}

const iconStyles = { width: '100%', height: '100%' };
function UserAvatar({ photo }) {
  if (photo) {
    const avatarStyle = { backgroundImage: `url(${photo})` };
    return <div className={css.avatar} style={avatarStyle} />;
  }
  return <IconUser style={iconStyles} />;
}

function DumbPhoto({ user, openModal, currentUser, className }) {
  const { photo } = user;

  const isEditable =
    !!openModal && !!currentUser && user.id && (currentUser.id === user.id || currentUser.globalRole === 'ADMIN');

  return (
    <div className={`${css.wrapper} ${className}`}>
      <UserAvatar photo={photo} />
      {isEditable && (
        <div className={css.footer} onClick={openModal}>
          <IconPhoto />
        </div>
      )}
    </div>
  );
}

const mapStateToProps = store => {
  return { currentUser: store.Auth.user };
};
export const Photo = connect(mapStateToProps)(DumbPhoto);

(PhotoInitials as any).propTypes = {
  user: PropTypes.object.isRequired
};
(Photo as any).propTypes = {
  user: PropTypes.object.isRequired,
  openModal: PropTypes.func
};
