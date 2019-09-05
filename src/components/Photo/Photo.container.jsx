import React from 'react';
import PropTypes from 'prop-types';
import { getFirstName, getLastName } from '../../utils/NameLocalisation';
import { IconUser } from '../Icons';
import { head } from 'lodash';

export function Photo({ user }) {
  const { photo } = user;

  if (photo) {
    return <img src={photo} alt="" />;
  }

  const [firstName, lastName] = [getFirstName, getLastName].map(fn => fn(user));

  if (firstName && lastName) {
    return (
      <div>{`
        ${head(firstName)}
        ${head(lastName)}
      `}</div>
    );
  }

  const iconStyles = {
    width: '100%',
    height: '100%'
  };

  return <IconUser style={iconStyles} />;
}

Photo.propTypes = {
  user: PropTypes.object.isRequired
};
