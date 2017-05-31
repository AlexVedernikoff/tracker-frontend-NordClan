import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import { IconPlus, IconClose } from '../Icons';

const Tag = (props) => {
  const {
    name,
    create,
    ...other
  } = props;
  return (
    <span {...other} className={classnames({[css.tag]: true, [css.create]: create})}>
      <span className={classnames({[css.tagPart]: true, [css.tagCreate]: create})}>{create ? <IconPlus/> : name}</span>
      {create ? null : <span className={classnames(css.tagPart, css.tagClose)}><IconClose/></span>}
    </span>
  );
};

Tag.propTypes = {
  create: PropTypes.bool,
  name: PropTypes.string
};

export default Tag;
