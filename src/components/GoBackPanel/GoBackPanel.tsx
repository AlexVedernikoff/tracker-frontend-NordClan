import React, { Component } from 'react';
import { IconArrowLeft } from '../Icons';
import PropTypes from 'prop-types';

import * as css from './GoBackPanel.scss';
import { history } from '../../History';
import { connect } from 'react-redux';
import localize from './GoBackPanel.json';

class GoBackPanel extends Component {
  static propTypes = {
    defaultPreviousUrl: PropTypes.string,
    lang: PropTypes.string,
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
    const { lang } = this.props;
    return (
      <div className={css.gobackButton} onClick={this.goBack}>
        <IconArrowLeft />
        <span className={css.gobackButtonText}>{localize[lang].BACK}</span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(GoBackPanel);
