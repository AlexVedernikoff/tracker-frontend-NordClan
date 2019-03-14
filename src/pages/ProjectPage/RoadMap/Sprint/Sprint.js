import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { IconPlus, IconEdit, IconDownload, IconArrowRight, IconArrowDown } from '../../../../components/Icons';
import TimeLine from '../TimeLine';
import Goal from '../Goal';
import AddGoal from '../AddGoal/AddGoal';

import localize from './Sprint.json';
import styles from './Sprint.scss';

class Sprint extends Component {
  static propTypes = {
    create: PropTypes.func,
    edit: PropTypes.func,
    editSprint: PropTypes.func,
    globalEnd: PropTypes.number,
    globalStart: PropTypes.number,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      projectId: PropTypes.number
    }),
    lang: PropTypes.string,
    openCreateTaskModal: PropTypes.func,
    remove: PropTypes.func,
    toggleStatus: PropTypes.func,
    toggleVisible: PropTypes.func,
    transfer: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      showModal: false,
      isEdit: false,
      goal: {}
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  toggleCollapse = () => {
    this.setState(state => ({ collapsed: !state.collapsed }));
  };

  addGoal = () => this.setState({ isEdit: false, showModal: true });

  editGoal = goalItem => () => {
    this.setState({
      goalItem,
      isEdit: true,
      showModal: true
    });
  };

  removeGoal = id => () => this.props.remove(id);

  addTask = goalItem => () => {
    const { id: goalId, activeSprintId: sprintId } = goalItem;
    this.props.openCreateTaskModal({ goalId, sprintId });
  };

  transferGoal = (goalId, createdAt) => () => this.props.transfer(goalId, createdAt);

  hanldeEditSprint = () => this.props.editSprint(this.props.item);

  toggleVisible = (id, visible) => () => this.props.toggleVisible(id, !visible);

  toggleStatus = id => checked => this.props.toggleStatus(id, checked);

  render() {
    const { item, globalStart, globalEnd, lang } = this.props;
    const { collapsed, showModal, isEdit, goalItem } = this.state;

    const goals = item.goals.map(goal => (
      <Goal
        key={goal.id}
        item={goal}
        lang={lang}
        addTask={this.addTask(goal)}
        editGoal={this.editGoal(goal)}
        removeGoal={this.removeGoal(goal.id)}
        transferGoal={this.transferGoal(goal.id, item.createdAt)}
        toggleVisible={this.toggleVisible(goal.id, goal.visible)}
        toggleStatus={this.toggleStatus(goal.id)}
      />
    ));
    const meta = (
      <div className={styles.meta}>
        <div className={styles.metaItem}>{item.budget} ч.</div>
        <div className={styles.metaItem}>{item.riskBudget} ч. - риск.</div>
        <div className={styles.metaItem}>{item.qaPercent}% на QA</div>
        <div className={`${styles.metaItem}, ${styles.export}`}>
          <IconDownload data-tip={localize[lang].UNLOAD_SPRINT} />
          <IconEdit
            className={styles.actionIcon}
            data-tip={localize[lang].CHANGE_SPRINT}
            onClick={this.hanldeEditSprint}
          />
        </div>
      </div>
    );
    const goalsContainer = (
      <div className={styles.goals}>
        <div>{goals}</div>
        <div className={styles.addingButton} onClick={this.addGoal}>
          <span className={styles.addingIcon}>
            <IconPlus />
          </span>
          {localize[lang].ADD_EPIC}
        </div>
      </div>
    );
    return (
      <div className={styles.sprint}>
        <div className={styles.wrapClickableCollapse} onClick={this.toggleCollapse}>
          <div className={styles.collapseIcon}>{collapsed ? <IconArrowRight /> : <IconArrowDown />}</div>
          <div className={styles.leftBlock}>
            <h2>{item.name}</h2>
            {!collapsed && meta}
          </div>
        </div>
        <div className={styles.rightBlock}>
          <TimeLine
            globalStart={globalStart}
            globalEnd={globalEnd}
            sprintStart={item.factStartDate}
            sprintEnd={item.factFinishDate}
          />
          {!collapsed && goalsContainer}
        </div>
        <AddGoal
          showModal={showModal}
          closeModal={() => this.setState({ showModal: false })}
          item={item}
          create={this.props.create}
          edit={this.props.edit}
          isEdit={isEdit}
          goalItem={goalItem}
        />
      </div>
    );
  }
}

export default Sprint;
