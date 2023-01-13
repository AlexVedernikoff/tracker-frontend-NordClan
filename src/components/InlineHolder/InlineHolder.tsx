import React from 'react';
import PropTypes from 'prop-types';
import css from './InlineHolder.scss';


const InlineHolder = (props) => {

  return (
    <span className={css.inlineHolder} style={{width: `${props.length}`}}/>
  );
};

(InlineHolder as any).propTypes = {
  length: PropTypes.string.isRequired
};

export default InlineHolder;
