import React from 'react';
import PropTypes from 'prop-types';

const ErrorText = (props) => {
  const {
    message,
    ...other
  } = props;

  return (
    <div style={{color: 'rgb(255, 0, 0)', padding: '8px 0', textAlign: 'center'}} {...other}>
      {message}
    </div>
  );
};

ErrorText.propTypes = {
  message: PropTypes.string
};

export default ErrorText;
