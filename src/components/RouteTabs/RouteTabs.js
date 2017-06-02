import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './RouteTabs.scss';
import { IconPlus, IconClose } from '../Icons';

const RouteTabs = (props) => {
  const {
    children,
    ...other
  } = props;

  const modifyChildren = children.map((element, i) => {
    return React.cloneElement(element, {activeClassName: css.active, key: i});
  });

  return (
    <div {...other} className={css.routeTabs}>
      {modifyChildren}
    </div>
  );
};

RouteTabs.propTypes = {
  children: PropTypes.array
};

export default RouteTabs;
