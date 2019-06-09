import React, { Component } from 'react';
import { connect } from 'react-redux';
import localize from './MyTasks.json';

import AgileBoard from '../ProjectPage/AgileBoard';
import Title from 'react-title-component';
import ScrollTop from '../../components/ScrollTop';

class MyTasks extends Component {
  render() {
    return (
      <div>
        <Title render={`SimTrack - ${localize[this.props.lang].MY_TASKS}`} />
        <h1>{localize[this.props.lang].MY_TASKS}</h1>
        <hr />
        <AgileBoard myTaskBoard {...this.props} />
        <ScrollTop />
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
