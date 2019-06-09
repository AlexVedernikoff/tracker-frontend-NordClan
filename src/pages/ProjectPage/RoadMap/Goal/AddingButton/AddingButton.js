import React, { Component } from 'react';

import { IconPlus } from '../../../../../components/Icons';
import styles from './AddingButton.scss';

class AddingButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.addingButton} data-tip="Добавить задачу, связанную с целью">
        <IconPlus />
      </div>
    );
  }
}

export default AddingButton;
