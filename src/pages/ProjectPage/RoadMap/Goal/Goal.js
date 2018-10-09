import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import Checkbox from '../../../../components/Checkbox';
import VisibleControl from './VisibleControl';
import AddingButton from './AddingButton';
import Meta from './Meta';
import { IconArrowLeft } from '../../../../components/Icons';

import styles from './Goal.scss';

class Sprint extends Component {
  static propTypes = {
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
    const { item } = this.props;
    const { budget, tasksCount, removedFromSprint, removedToSprint } = item;
    const metaProps = {
      budget,
      tasksCount,
      removedFromSprint,
      removedToSprint
    };

    return (
      <div className={styles.goal}>
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
            <span>
              <AddingButton />
            </span>
          )}
        </div>
        <div className={styles.description}>{item.description}</div>
      </div>
    );
  }
}

export default Sprint;
