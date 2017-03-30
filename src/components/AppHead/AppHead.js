import React, {Component, PropTypes} from 'react';

import styles from './appHead.scss';

export default class AppHead extends Component {

  static contextTypes = {
    user: PropTypes.object
  };

  render() {
    const { user } = this.context;
    if (!user) {
      return null;
    }

    return (
      <div className={styles.toppanel}>
        <a href="/" className={styles.logo}>
          <span>Sim</span>Track
        </a>
      </div>
    );
  }
}

