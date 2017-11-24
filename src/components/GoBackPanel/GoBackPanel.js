import React, { Component } from 'react';
import { IconArrowLeft } from '../Icons';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

import * as css from './GoBackPanel.scss';
import { history } from '../../History';

export default class GoBackPanel extends Component {

  static propTypes = {
    defaultPreviousUrl: PropTypes.string,
    parentRef: PropTypes.object
  }

  static defaultProps = {
    defaultPreviousUrl: '/'
  }

  componentDidMount () {
    window.addEventListener('resize', this.setGoBackToggler);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setGoBackToggler);
  }

  setGoBackToggler = () => {
    const goBackToggler = this.refs.goBackToggler;
    const taskPage = this.props.parentRef;
    let taskPageRect = null;
    if (taskPage && taskPage.getBoundingClientRect) {
      taskPageRect = taskPage.getBoundingClientRect();
      goBackToggler.style.right = `calc(${window.innerWidth - taskPageRect.left}px + 1rem)`;
    }
  };

  goBack = () => {
    if (window.history.length > 1) {
      history.goBack();
    } else {
      history.push(this.props.defaultPreviousUrl);
    }
  }

  render () {
    this.setGoBackToggler();
    return (
      <div ref="goBackToggler" className={css.goBackTogglerWrapper}>
        <div className={css.goBackToggler} onClick={this.goBack} data-tip="Назад" data-place="right" data-for="goBackTip">
          <IconArrowLeft/>
        </div>
        <ReactTooltip id="goBackTip" className="tooltip" />
      </div>
    );
  }
}
