import React from 'react';
import PropTypes from 'prop-types';


const HttpError = (props) => {

  const {
    error,
    ...other
  } = props;

  return (
    <div>
      <h2>{error.status} {error.name}</h2>
      <p>
        {error.message}
      </p>
    </div>
  );
};

HttpError.propTypes = {
  error: PropTypes.object
};


export default HttpError;
