import React from 'react';
import PropTypes from 'prop-types';
import Title from 'react-title-component';

import { getFullName } from '../../../utils/NameLocalisation';

export function UserTitle({ user, renderTitle }) {
  return (
    <div>
      <Title render={renderTitle} />
      <h1>{getFullName(user)}</h1>
      <hr />
    </div>
  );
}

UserTitle.propTypes = {
  renderTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  user: PropTypes.object.isRequired
};
