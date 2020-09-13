import React from 'react';
import PropTypes from 'prop-types';

const HttpError = props => {
  const { error, whiteCentered } = props;

  return (
    <div style={whiteCentered ? { color: 'rgb(255,255,255)', textAlign: 'center' } : {}}>
      <h2>
        {error.status} {error.name}
      </h2>
      <p>{error.message}</p>
    </div>
  );
};

HttpError.propTypes = {
  error: PropTypes.object,
  whiteCentered: PropTypes.bool
};

export default HttpError;
