import React, { Component } from 'react';
import { IconArrowLeft } from '../Icons';
import PropTypes from 'prop-types';

import * as css from './GoBackPanel.scss';
import { history } from '../../History';

export default class GoBackPanel extends Component {
  static propTypes = {
    defaultPreviousUrl: PropTypes.string,
    parentRef: PropTypes.object
  };

  static defaultProps = {
    defaultPreviousUrl: '/'
  };

  goBack = () => {
    if (window.history.length > 1) {
      history.goBack();
    } else {
      history.push(this.props.defaultPreviousUrl);
    }
  };

  render() {
    return (
      <div className={css.gobackButton} onClick={this.goBack}>
        <IconArrowLeft />
        <span className={css.gobackButtonText}>Назад</span>
      </div>
    );
  }
}
