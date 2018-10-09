import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IconArrowLeft } from '../../../../../components/Icons';
import styles from './Meta.scss';

class Meta extends Component {
  static propTypes = {
    budget: PropTypes.number,
    removedFromSprint: PropTypes.object,
    removedToSprint: PropTypes.object,
    tasksCount: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { budget, tasksCount, removedFromSprint, removedToSprint } = this.props;
    const budgetNode = !!budget && <div className={styles.item}>{budget} ч.</div>;
    const tasksCountNode = !!tasksCount && (
      <div className={styles.item}>
        <a href="#">{tasksCount} задач</a>
      </div>
    );
    const removedFromSprintNode = !!removedFromSprint && (
      <div className={styles.item}>
        <span className={styles.icon}>
          <IconArrowLeft />
        </span>{' '}
        Перенесено из: {removedFromSprint.name}
      </div>
    );
    const removedToSprintNode = !!removedToSprint && (
      <div className={styles.item}>Перенесено в: {removedToSprint.name}</div>
    );

    return (
      <div className={styles.meta}>
        {budgetNode}
        {removedFromSprintNode}
        {removedToSprintNode}
        {tasksCountNode}
      </div>
    );
  }
}

export default Meta;
