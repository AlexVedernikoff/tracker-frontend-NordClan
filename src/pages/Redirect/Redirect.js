import React from 'react';
import PropTypes from 'prop-types';
import * as css from '../Logout/Logout.scss';
import Logo from '../../components/Logo';
import bg from '../Login/bg.jpg';

const Redirect = (props) => (
  <div
    className={css.formWrapper}
    style={{ backgroundImage: `url(${bg})` }}
  >
    <div className={css.logoutForm}>
      <Logo
        onLight={false}
        style={{ fontSize: '3rem', padding: 0, textAlign: 'center' }}
        />
      {props.children}
    </div>
  </div>
);

Redirect.propTypes = {
  children: PropTypes.node
};

export default Redirect;
