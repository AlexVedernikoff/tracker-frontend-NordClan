import React from 'react';
import PropTypes from 'prop-types';
import * as css from './RouteTabs.scss';
// import { IconPlus, IconClose } from '../Icons';

const RouteTabs = props => {
  const { children, pathname, ...other } = props;

  let modifyChildren = [];

  if (Array.isArray(children)) {
    modifyChildren = children.map((element, i) => {
      if (element.key === pathname) {
        return React.cloneElement(
          <div className="active" key={element.key}>
            {element.props.children}
          </div>,
          { className: css.active }
        );
      }
      return React.cloneElement(element, { activeClassName: css.active, key: i });
    });
  }

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
