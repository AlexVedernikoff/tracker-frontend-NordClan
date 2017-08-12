import React from 'react';
import * as css from '../Logout/Logout.scss';
import Logo from '../../components/Logo';
import bg from '../Login/bg.jpg';

const Redirect = () => (
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

export default Redirect;
