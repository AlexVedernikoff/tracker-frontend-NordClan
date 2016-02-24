import React, { Component } from 'react';
// import { Link } from 'react-router';
// import config from '../../config';
// import Helmet from 'react-helmet';
import { TasksList } from 'components';
import Paper from 'material-ui/lib/paper';

export default class Home extends Component {
  render() {
    // const styles = require('./Home.scss');
    const styles = {
      margin: 20
    };
    return (

      <Paper zDepth={1} style={styles}>

        <TasksList />
      </Paper>

    );
  }
}
