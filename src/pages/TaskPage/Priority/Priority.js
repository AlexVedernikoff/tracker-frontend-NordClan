import React from 'react';
import PropTypes from 'prop-types';
import * as css from './Priority.scss';

const Priority = (props) => {
  return (
    <div className={css.priority}>
      Приоритет:
      <span className={css.count}>
        <span>5</span>
        <span>4</span>
        <span className={css.active}>3</span>
        <span>2</span>
        <span>1</span>
      </span>
    </div>
  );
};

Priority.propTypes = {

};

export default Priority;
