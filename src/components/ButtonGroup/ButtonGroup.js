import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './ButtonGroup.scss';

const ButtonGroup = (props) => {

  let childrens = props.children;

  const {
    children,
    stage,
    type,
    ...other
  } = props;

  if (children.length) {
    childrens = props.children.map(function (item, i) {
      return (
        <div
          className={classnames({
            [css.buttonContainer]: true,
            [css.unit]: (type === 'lifecircle')
          })}
          key={i}>
          {item}
        </div>
      );
    });
  }

  return (
    <div
      {...other}
      className={classnames({
        [css[stage]]: !!css[stage],
        [css.buttonGroup]: true
      })}>
      {childrens}
    </div>
  );
};

ButtonGroup.propTypes = {
  children: PropTypes.array,
  stage: PropTypes.string,
  type: PropTypes.string
};

export default ButtonGroup;
