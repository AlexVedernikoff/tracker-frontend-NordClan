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

  const modifyChildren = children.map((element) => {
    return React.cloneElement(element, {activeClassName: css.active});
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
