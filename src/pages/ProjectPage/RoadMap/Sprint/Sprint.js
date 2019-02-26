import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { IconPlus, IconDownload, IconArrowRight, IconArrowDown } from '../../../../components/Icons';
import TimeLine from '../TimeLine';
import Goal from '../Goal';
import AddGoal from '../AddGoal/AddGoal';

import localize from './Sprint.json';
import styles from './Sprint.scss';

class Sprint extends Component {
  static propTypes = {
    create: PropTypes.func,
    edit: PropTypes.func,
    globalEnd: PropTypes.number,
    globalStart: PropTypes.number,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    lang: PropTypes.string
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

  render() {
    const { item, globalStart, globalEnd, lang } = this.props;
    const { collapsed, showModal, isEdit, goalItem } = this.state;

    const goals = item.goals.map(goal => <Goal editGoal={this.editGoal(goal)} key={goal.id} item={goal} />);
    const meta = (
      <div className={styles.meta}>
        <div className={styles.metaItem}>{item.budget} ч.</div>
        <div className={styles.metaItem}>{item.riskBudget} ч. - риск.</div>
        <div className={styles.metaItem}>{item.qaPercent}% на QA</div>
        <div className={`${styles.metaItem}, ${styles.export}`}>
          <IconDownload data-tip="Выгрузить спринт" />
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
          {localize[lang].ADD_GOAL}
        </div>
      </div>
    );
    return (
      <div className={styles.sprint}>
        <div className={styles.collapseIcon} onClick={this.toggleCollapse}>
          {collapsed ? <IconArrowRight /> : <IconArrowDown />}
        </div>
        <div className={styles.leftBlock}>
          <h2>{item.name}</h2>
          {!collapsed && meta}
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
