import React, { Component } from 'react';
import { Link } from 'react-router';
import { CounterButton, GithubButton } from 'components';
import config from '../../config';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/lib/flat-button';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    const logoImage = require('./logo.png');
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>
         <FlatButton label="Primary" primary={true} />
        <div className={styles.masthead}>
        </div>

      </div>
    );
  }
}
