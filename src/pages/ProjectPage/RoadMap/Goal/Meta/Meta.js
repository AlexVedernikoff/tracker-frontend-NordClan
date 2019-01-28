import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import { IconArrowLeft } from '../../../../../components/Icons';
import styles from './Meta.scss';

class Meta extends Component {
  static propTypes = {
    budget: PropTypes.number,
    item: PropTypes.object,
    project: PropTypes.object,
    removedFromSprint: PropTypes.object,
    removedToSprint: PropTypes.object,
    tasksCount: PropTypes.string
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
        <Link to={`/projects/${this.props.project.id}?goal[]=${this.props.item.id}`}>{tasksCount} задач</Link>
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

const mapStateToProps = state => ({
  project: state.Project.project
});

const mapDispatchToProps = {
  //
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Meta);
