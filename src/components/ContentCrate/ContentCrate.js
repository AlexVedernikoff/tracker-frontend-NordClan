import React, { PropTypes } from 'react';

const ContentCrate = (props) => {
  const { space, style } = props;
  const finalStyle = {
    padding: space || '1em',
    ...style
  };
  return (
    <div style={finalStyle}>
      {props.children}
    </div>
  );
};

ContentCrate.propTypes = {
  children: PropTypes.array,
  space: PropTypes.string,
  style: PropTypes.object
};

ContentCrate.defaultProps = {
  children: null,
  space: '',
  style: null
};

export default ContentCrate;
