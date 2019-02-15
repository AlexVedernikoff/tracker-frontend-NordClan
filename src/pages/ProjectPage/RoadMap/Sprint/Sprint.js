import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import { IconPlus, IconDownload, IconArrowRight, IconArrowDown } from '../../../../components/Icons';
import TimeLine from '../TimeLine';
import styles from './Sprint.scss';
import Goal from '../Goal';

class Sprint extends Component {
  static propTypes = {
    globalEnd: PropTypes.number,
    globalStart: PropTypes.number,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true
    };
  }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  toggleCollapse = () => {
    this.setState(state => ({ collapsed: !state.collapsed }));
  };

  render() {
    const { item, globalStart, globalEnd } = this.props;
    const { collapsed } = this.state;
    const goals = item.goals.map(goal => <Goal key={goal.id} item={goal} />);
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
        <div className={styles.addingButton}>
          <span className={styles.addingIcon}>
            <IconPlus />
          </span>
          Добавить цель
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
      </div>
    );
  }
}

export default Sprint;
