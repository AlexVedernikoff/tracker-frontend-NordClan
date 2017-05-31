import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tags.scss';
import { IconPlus, IconClose } from '../Icons';
import Tag from '../Tag';

const Tags = (props) => {
  const {
    children,
    ...other
  } = props;
  return (
    <div>
      {children}
       <Tag create data-tip="Добавить тег" data-place="bottom" />
    </div>
  );
};

Tags.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.array
  ])
};

export default Tags;
