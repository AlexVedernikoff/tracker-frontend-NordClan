import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TimeLine from '../TimeLine';
import styles from './Sprint.scss';

class Sprint extends Component {
  static propTypes = {
    globalEnd: PropTypes.string,
    globalStart: PropTypes.string,
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
    const { item, globalStart, globalEnd } = this.props;
    return (
      <div className={styles.sprint}>
        <div className={styles.leftBlock}>
          <h2>{item.name}</h2>
        </div>
        <div className={styles.rightBlock}>
          <TimeLine
            globalStart={globalStart}
            globalEnd={globalEnd}
            sprintStart={item.factStartDate}
            sprintEnd={item.factFinishDate}
          />
        </div>
      </div>
    );
  }
}

export default Sprint;
