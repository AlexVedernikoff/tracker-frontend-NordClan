import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import cn from 'classnames';
import styles from './TimeLine.scss';
import { IconArrowDown } from '../../../../components/Icons';

class TimeLine extends Component {
  static propTypes = {
    globalEnd: PropTypes.number,
    globalStart: PropTypes.number,
    sprintEnd: PropTypes.string,
    sprintStart: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  get currentDate() {
    return moment();
  }

  get lineStart() {
    return moment([this.props.globalStart, 0, 1]);
  }

  get lineEnd() {
    return moment([this.props.globalEnd, 11, 30]);
  }

  get sprintStart() {
    return moment(this.props.sprintStart);
  }

  get sprintEnd() {
    return moment(this.props.sprintEnd);
  }

  get progressStart() {
    return moment(this.props.sprintStart);
  }

  get progressEnd() {
    if (this.currentDate.isAfter(this.sprintEnd)) {
      return this.sprintEnd;
    }
    return this.currentDate;
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

  get progressPosition() {
    const left = this.progressStart.diff(this.lineStart, 'days') * this.segment + '%';
    const right = this.lineEnd.diff(this.progressEnd, 'days') * this.segment + '%';
    return { left, right };
  }

  get todayPosition() {
    const right = this.lineEnd.diff(this.currentDate, 'days') * this.segment + '%';
    return { right };
  }

  get isProgress() {
    return this.currentDate.isAfter(this.sprintStart);
  }

  get isCurrentSprint() {
    return this.currentDate.isAfter(this.sprintStart) && this.currentDate.isBefore(this.sprintEnd);
  }

  render() {
    const diffSprintByDay = this.sprintEnd.diff(this.sprintStart, 'days');
    const { left, right } = this.progressPosition;
    const leftInt = parseInt(left);
    const rightInt = parseInt(right);
    const progressPositionStyles = {
      left: leftInt > 0 ? left : 0,
      right: rightInt > 0 ? right : 0
    };
    return (
      <div className={styles.lineContainer}>
        <div className={styles.timeline}>
          <div className={styles.currentSprint} style={this.sprintPosition}>
            {leftInt > 0 ? (
              <div className={styles.start}>
                <span className={styles.date}>{this.sprintStart.format('DD.MM.YYYY')}</span>
              </div>
            ) : null}
            {rightInt > 0 ? (
              <div className={styles.end}>
                <span className={cn(styles.date, { [styles.down]: diffSprintByDay < 15 })}>
                  {this.sprintEnd.format('DD.MM.YYYY')}
                </span>
              </div>
            ) : null}
          </div>
        </div>
        {this.isProgress && <div className={styles.progress} style={progressPositionStyles} />}
        {this.isCurrentSprint && <IconArrowDown className={styles.today} style={this.todayPosition} />}
      </div>
    );
  }
}

export default TimeLine;
