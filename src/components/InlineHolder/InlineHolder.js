import React from 'react';
import PropTypes from 'prop-types';
import * as css from './InlineHolder.scss';


const InlineHolder = (props) => {

  return (
    <span className={css.inlineHolder} style={{width: `${props.length}`}}/>
  );
};

InlineHolder.propTypes = {
  length: PropTypes.number.isRequired
};

export default InlineHolder;
