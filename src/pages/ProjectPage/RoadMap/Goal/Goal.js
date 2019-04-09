import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Checkbox from '../../../../components/Checkbox';
import VisibleControl from './VisibleControl';
import Meta from './Meta';
import {
  IconArrowLeft,
  IconEdit,
  IconDelete,
  IconPlus,
  IconArrowRight,
  IconArrowDown,
  IconArrowUp
} from '../../../../components/Icons';

import localize from './localize.json';
import styles from './Goal.scss';

class Goal extends Component {
  static propTypes = {
    addTask: PropTypes.func,
    editGoal: PropTypes.func,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    lang: PropTypes.string,
    removeGoal: PropTypes.func,
    toggleStatus: PropTypes.func,
    toggleVisible: PropTypes.func,
    transferGoal: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: props.item.status === 'done',
      isOpen: false
    };
  }

  handleChangeStatus = ({ target: { checked } }) => this.setState({ checked }, () => this.props.toggleStatus(checked));

  toggleOpen = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }));
  };

  render() {
    const { checked, isOpen } = this.state;
    const { item, lang } = this.props;
    const { budget, tasksCount, removedFromSprint, removedToSprint } = item;
    const metaProps = {
      budget,
      tasksCount,
      removedFromSprint,
      removedToSprint,
      item
    };
    return (
      <div className={styles.goal}>
        <div className={styles.mainContainer}>
          {!removedToSprint && <VisibleControl visible={item.visible} onClick={this.props.toggleVisible} lang={lang} />}
          {!removedToSprint && (
            <span className={styles.checkbox}>
              <Checkbox checked={checked} onChange={this.handleChangeStatus} />
            </span>
          )}
          {!!removedToSprint && (
            <span className={styles.removedIcon}>
              <IconArrowLeft />
            </span>
          )}
          <span onClick={this.toggleOpen} className={cn(styles.name, { [styles.removed]: !!removedToSprint })}>
            {item.name}
          </span>
          <span
            data-tip={!isOpen ? localize[lang].SHOW_GOAL_INFO : localize[lang].HIDE_GOAL_INFO}
            className={styles.openButton}
            onClick={this.toggleOpen}
          >
            {!isOpen ? <IconArrowDown /> : <IconArrowUp />}
          </span>
          <Meta {...metaProps} />
          {!removedToSprint && (
            <span className={styles.actionButtons}>
              <IconPlus
                className={styles.actionIcon}
                data-tip={localize[lang].ADD_TASK_TO_TARGET}
                onClick={this.props.addTask}
              />
              <IconEdit
                className={styles.actionIcon}
                data-tip={localize[lang].CHANGE_TARGET}
                onClick={this.props.editGoal}
              />
              <IconDelete
                className={styles.actionIcon}
                data-tip={localize[lang].REMOVE_GOAL}
                onClick={this.props.removeGoal}
              />
              <IconArrowRight
                className={styles.actionIcon}
                data-tip={localize[lang].MOVE_TO_NEXT_SPRINT}
                onClick={this.props.transferGoal}
              />
            </span>
          )}
        </div>
        {isOpen && (
          <div className={styles.description}>
            <h5>{localize[lang].ACCEPTANCE_CRITERIONS}</h5>
            <p>{item.description}</p>
            <h5>{localize[lang].REQUIRED_OF_CLIENT}</h5>
            <p>{item.description}</p>
          </div>
        )}
      </div>
    );
  }
}

export default Goal;
