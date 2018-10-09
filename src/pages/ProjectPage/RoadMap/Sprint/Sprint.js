import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IconPlus, IconDownload } from '../../../../components/Icons';
import TimeLine from '../TimeLine';
import styles from './Sprint.scss';
import Goal from '../Goal';

class Sprint extends Component {
  static propTypes = {
    globalEnd: PropTypes.string,
    globalStart: PropTypes.string,
    item: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { item, globalStart, globalEnd } = this.props;
    const goals = item.goals.map(goal => <Goal key={goal.id} item={goal} />);
    return (
      <div className={styles.sprint}>
        <div className={styles.leftBlock}>
          <h2>{item.name}</h2>
          <div className={styles.meta}>
            <div className={styles.metaItem}>{item.budget} ч.</div>
            <div className={styles.metaItem}>{item.riskBudget} ч. - риск.</div>
            <div className={styles.metaItem}>{item.qaPercent}% на QA</div>
            <div className={`${styles.metaItem}, ${styles.export}`} data-tip="Выгрузить спринт">
              <IconDownload />
            </div>
          </div>
        </div>
        <div className={styles.rightBlock}>
          <TimeLine
            globalStart={globalStart}
            globalEnd={globalEnd}
            sprintStart={item.factStartDate}
            sprintEnd={item.factFinishDate}
          />
          <div className={styles.goals}>{goals}</div>
          <div className={styles.addingButton}>
            <span className={styles.addingIcon}>
              <IconPlus />
            </span>
            Добавить цель
          </div>
        </div>
      </div>
    );
  }
}

export default Sprint;
