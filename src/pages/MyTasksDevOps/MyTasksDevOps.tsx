import React, { Component } from 'react';
import { connect } from 'react-redux';
import localize from './MyTasksDevOps.json';

import AgileBoard from '../ProjectPage/AgileBoard';
import Title from '../../components/Title';
import ScrollTop from '../../components/ScrollTop';

class MyTasksDevOps extends Component<any, any> {
  render() {
    return (
      <div>
        <Title render={`[Epic] - ${localize[this.props.lang].MY_TASKS}`} />
        <h1>{localize[this.props.lang].MY_TASKS}</h1>
        <hr />
        <AgileBoard isDevOps {...this.props} />
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
)(MyTasksDevOps);
