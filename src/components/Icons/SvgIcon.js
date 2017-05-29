import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SvgIcon extends Component {

  static propTypes = {
    children: PropTypes.node,
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
      ...other
    } = this.props;

    const mergedStyles = {
      display: 'inline-block',
      fill: 'currentColor',
      height: 24,
      width: 24,
      userSelect: 'none',
      ...style
    };

    return (
      <svg
        {...other}
        style={mergedStyles}
        viewBox={viewBox}
      >
        {children}
      </svg>
    );
  }
}

export default SvgIcon;
