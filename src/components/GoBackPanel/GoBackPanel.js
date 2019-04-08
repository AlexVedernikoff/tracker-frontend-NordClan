import React, { Component } from 'react';
import { IconArrowLeft } from '../Icons';
import PropTypes from 'prop-types';

import * as css from './GoBackPanel.scss';
import { history } from '../../History';
import { connect } from 'react-redux';
import localize from './GoBackPanel.json';
import classnames from 'classnames';

class GoBackPanel extends Component {
  static propTypes = {
    Sidebar: PropTypes.object,
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
    const { lang, Sidebar } = this.props;
    return (
      <div
        className={classnames({ [css.gobackButton]: true, [css.gobackButton_compact]: !Sidebar.isOpen })}
        onClick={this.goBack}
      >
        <IconArrowLeft />
        <span className={css.gobackButtonText}>{localize[lang].BACK}</span>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  Sidebar: state.Sidebar
});

export default connect(
  mapStateToProps,
  null
)(GoBackPanel);
