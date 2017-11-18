import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Logout.scss';
import Logo from '../../components/Logo';
import bg from '../Login/bg.jpg';
import { connect } from 'react-redux';
import { history } from '../../History';
import { doLogout } from '../../actions/Authentication';

class Logout extends Component {
  static propTypes = {
    doLogout: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
  };

  constructor (props) {
    super(props);

    if (props.isLoggedIn) {
      props.doLogout();
    } else {
      history.replace('/login');
    }
  }

  componentWillReceiveProps ({ isLoggedIn }) {
    if (!isLoggedIn) {
      history.replace('/login');
    }
  }

  render () {
    return (
      <div
        className={css.formWrapper}
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className={css.logoutForm}>
          <Logo
            onLight={false}
            style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }}
            />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ Auth: { isLoggedIn } }) => ({
  isLoggedIn
});

const mapDispatchToProps = {
  doLogout
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
