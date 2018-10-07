import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Checkbox from '../../../../components/Checkbox';
import VisibleControl from './VisibleControl';

import styles from './Goal.scss';

class Sprint extends Component {
  static propTypes = {
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item } = this.props;
    return (
      <div className={styles.goal}>
        <div className={styles.mainContainer}>
          <VisibleControl visible={item.visible} />
          <span className={styles.checkbox}>
            <Checkbox checked={item.done} />
          </span>
          <span className={styles.name}>{item.name}</span>
        </div>
        <div className={styles.description}>{item.description}</div>
      </div>
    );
  }
}

export default Sprint;
