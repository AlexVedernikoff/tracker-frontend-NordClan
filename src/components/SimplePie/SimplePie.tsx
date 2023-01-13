import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import css from './SimplePie.scss';

class SimplePie extends Component<any, any> {
  static propTypes = {
    className: PropTypes.string,
    size: PropTypes.number,
    value: PropTypes.number
  };

  static defaultProps = {
    size: 80,
    value: 0
  };

  render() {
    const { className, size, value } = this.props;

    const isInverse = value > 0.5;
    const rotateValue = `rotate(${isInverse ? 360 * value - 180 : 360 * value}deg)`;

    return (
      <div
        className={cn([css.pieContainer, { [className]: !!className }])}
        style={{
          width: size,
          height: size
        }}
      >
        <div className={cn([css.base, { [css.inverse]: isInverse }])}>
          <div className={css.part} style={{ transform: rotateValue }} />
        </div>
      </div>
    );
  }
}

export default SimplePie;
