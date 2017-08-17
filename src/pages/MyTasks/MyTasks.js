import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as css from './MyTasks.scss';

import AgileBoard from '../ProjectPage/AgileBoard';

class MyTasks extends Component {
  render () {
    return (
      <AgileBoard myTaskBoard={true}/>
    );
  }
}

export default MyTasks;
