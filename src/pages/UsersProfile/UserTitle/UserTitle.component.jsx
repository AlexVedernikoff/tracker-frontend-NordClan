import React from 'react';
import PropTypes from 'prop-types';
import Title from '../../../components/Title';

import { getFullName } from '../../../utils/NameLocalisation';

export function UserTitle({ user, renderTitle }) {
  const name = getFullName(user);
  return (
    <div>
      <Title render={name || renderTitle} />
      <h1>{name}</h1>
      <hr />
    </div>
  );
}

UserTitle.propTypes = {
  renderTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  user: PropTypes.object.isRequired
};
