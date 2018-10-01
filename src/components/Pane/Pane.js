import React from 'react';
import PropTypes from 'prop-types';

const Pane = props => {
  return <div>{props.children}</div>;
};

Pane.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  label: PropTypes.string.isRequired
};

export default Pane;
