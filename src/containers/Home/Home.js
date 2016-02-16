import React, { Component } from 'react';
// import { Link } from 'react-router';
// import { CounterButton, GithubButton } from 'components';
// import config from '../../config';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/lib/flat-button';

import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    const primary = true;
    // require the logo image both from client and server
  //  const logoImage = require('./logo.png');
    return (
      <div>
        <div className={styles.home}>
          <Helmet title="Home"/>
        </div>
        <Grid fluid>
          <Row center="md">
            <Col md={3} ><FlatButton label="rew" primary={primary} /></Col>
            <Col md={3} ><FlatButton label="rew" primary={primary} /></Col>
            <Col md={3} ><FlatButton label="rew" primary={primary} /></Col>
            <Col md={3} ><FlatButton label="rew" primary={primary} /></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
