import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Icons.scss';

class SvgIcon extends Component {

  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.object,
    viewBox: PropTypes.string
  };

  static defaultProps = {
    viewBox: '0 0 24 24'
  };

  render () {
    const {
      children,
      style,
      viewBox,
      className,
      ...other
    } = this.props;

    return (
      <svg
        {...other}
        style={style}
        viewBox={viewBox}
        className={classnames(
          className, css.icon
        )}
      >
        {children}
      </svg>
    );
  }
}

export default SvgIcon;
