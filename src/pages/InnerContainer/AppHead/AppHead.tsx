import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { IconExitApp, IconInfo, IconMenu } from '../../../components/Icons';
import Toggle from '../../../components/LanguageToggle';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Logo from '../../../components/Logo';
import { EXTERNAL_USER } from '../../../constants/Roles';
import Loader from './Loader';
import { history } from '../../../History';
import Playlist from './Playlist';
import { connect } from 'react-redux';
import { setLocalize } from '../../../actions/localize';
import classNames from 'classnames';

import * as css from './AppHead.scss';
import Button from '~/components/Button'; // Стили для плавного появления и скрытия лоадера

class AppHead extends Component<any, any> {
  static propTypes = {
    globalRole: PropTypes.string,
    lang: PropTypes.string,
    loading: PropTypes.number,
    setLocalize: PropTypes.func,
    toggleMenu: PropTypes.func,
    toggleMenuIcon: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  handleLogout = () => {
    history.push('/logout');
  };

  toggleLanguage = lang => this.props.setLocalize(lang);

  render() {
    const iconStyles = {
      width: 16,
      height: 16
    };

    const { globalRole } = this.props;
    return (
      <div className={css.toppanel}>
        <div
          className={classNames(css.menuToggle, this.props.toggleMenuIcon ? css.toggleMenuIcon : null)}
          onClick={this.props.toggleMenu}
        >
          <IconMenu style={iconStyles} />
        </div>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Logo />
        </Link>
        {globalRole !== EXTERNAL_USER ? <Playlist /> : null}
        {/*<Link to="/common-info/philosophy" className={css.infoLink}>*/}
        {/*  <IconInfo />*/}
        {/*</Link>*/}
        <Toggle className={css.toggler} lang={this.props.lang} onChange={this.toggleLanguage} location="appHead" />

        <div className={css.logoutButton} onClick={this.handleLogout}>
          <IconExitApp style={iconStyles} />
        </div>
        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.props.loading ? <Loader /> : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.Loading.loading,
    globalRole: state.Auth.user.globalRole,
    lang: state.Localize.lang
  };
};

const mapDispatchToProps = {
  setLocalize
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppHead);
