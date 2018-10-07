import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import styles from './TimeLine.scss';

class TimeLine extends Component {
  static propTypes = {
    globalEnd: PropTypes.string,
    globalStart: PropTypes.string,
    sprintEnd: PropTypes.string,
    sprintStart: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  get lineStart() {
    return moment(this.props.globalStart);
  }

  get lineEnd() {
    return moment(this.props.globalEnd);
  }

  get sprintStart() {
    return moment(this.props.sprintStart);
  }

  get sprintEnd() {
    return moment(this.props.sprintEnd);
  }

  get segment() {
    const daysCount = this.lineEnd.diff(this.lineStart, 'days');
    return 100 / daysCount;
  }

  get sprintPosition() {
    const left = this.sprintStart.diff(this.lineStart, 'days') * this.segment + '%';
    const right = this.lineEnd.diff(this.sprintEnd, 'days') * this.segment + '%';
    return { left, right };
  }

  render() {
    return (
      <div className={styles.lineContainer}>
        <div className={styles.timeline}>
          <div className={styles.currentSprint} style={this.sprintPosition}>
            <div className={styles.start}>
              <span className={styles.date}>{this.sprintStart.format('DD.MM.YYYY')}</span>
            </div>
            <div className={styles.end}>
              <span className={styles.date}>{this.sprintEnd.format('DD.MM.YYYY')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TimeLine;
