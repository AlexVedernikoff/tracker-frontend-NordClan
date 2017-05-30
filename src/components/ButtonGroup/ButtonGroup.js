import React from 'react';
import PropTypes from 'prop-types';
import * as css from './ButtonGroup.scss';

const ButtonGroup = (props) => {

  let childrens = props.children;

  if (props.children.length) {
    childrens = props.children.map(function (item, i) {
      return (
        <div className={css.unit} key={i}>
          {item}
        </div>
      );
    });
  }

  return (
    <div className={css[props.stage]}>
      {childrens}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.array,
  length: PropTypes.number,
  stage: PropTypes.string,
  type: PropTypes.string
};

export default ButtonGroup;
