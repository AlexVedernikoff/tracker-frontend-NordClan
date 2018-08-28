import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './MyTasks.scss';
import { connect } from 'react-redux';
import localize from './MyTasks.json';

import AgileBoard from '../ProjectPage/AgileBoard';
import localization from '../Projects/projects';
import Title, { flushTitle } from 'react-title-component';

class MyTasks extends Component {
  render() {
    return (
      <div>
        <Title render={`SimTrack - ${localize[this.props.lang].MY_TASKS}`} />
        <h1>{localize[this.props.lang].MY_TASKS}</h1>
        <hr />
        <AgileBoard myTaskBoard />
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
)(MyTasks);
