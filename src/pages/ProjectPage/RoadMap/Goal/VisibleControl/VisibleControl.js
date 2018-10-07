import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { IconEye } from '../../../../../components/Icons';
import styles from './VisibleControl.scss';

class Sprint extends Component {
  static propTypes = {
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible } = this.props;
    const classnames = cn(styles.visibleControl, { [styles.invisible]: !visible });
    const tip = visible ? 'Видимая цель' : 'Скрытая цель';

    return (
      <div className={classnames} data-tip={tip}>
        <IconEye />
      </div>
    );
  }
}

export default Sprint;
