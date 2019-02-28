import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Checkbox from '../../../../components/Checkbox';
import VisibleControl from './VisibleControl';
import Meta from './Meta';
import { IconArrowLeft, IconEdit, IconDelete, IconPlus, IconArrowRight } from '../../../../components/Icons';

import styles from './Goal.scss';

class Sprint extends Component {
  static propTypes = {
    addTask: PropTypes.func,
    editGoal: PropTypes.func,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    removeGoal: PropTypes.func,
    transferGoal: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item, modifyGoalId } = this.props;
    const { id, budget, tasksCount, removedFromSprint, removedToSprint } = item;
    const metaProps = {
      budget,
      tasksCount,
      removedFromSprint,
      removedToSprint,
      item
    };

    const modifyItem = modifyGoalId === id ? styles.modify : null;
    return (
      <div className={cn(styles.goal, modifyItem)}>
        <div className={styles.mainContainer}>
          {!removedToSprint && <VisibleControl visible={item.visible} />}
          {!removedToSprint && (
            <span className={styles.checkbox}>
              <Checkbox checked={item.done} />
            </span>
          )}
          {!!removedToSprint && (
            <span className={styles.removedIcon}>
              <IconArrowLeft />
            </span>
          )}
          <span className={cn(styles.name, { [styles.removed]: !!removedToSprint })}>{item.name}</span>
          <Meta {...metaProps} />
          {!removedToSprint && (
            <span className={styles.actionButtons}>
              <IconPlus className={styles.actionIcon} data-tip="Добавить задачу в цель" onClick={this.props.addTask} />
              <IconEdit className={styles.actionIcon} data-tip="Изменить цель" onClick={this.props.editGoal} />
              <IconDelete className={styles.actionIcon} data-tip="Удалить цель" onClick={this.props.removeGoal} />
              <IconArrowRight
                className={styles.actionIcon}
                data-tip="Перенести в следующий спринт"
                onClick={this.props.transferGoal}
              />
            </span>
          )}
        </div>
        <div className={styles.description}>{item.description}</div>
      </div>
    );
  }
}

export default Sprint;
