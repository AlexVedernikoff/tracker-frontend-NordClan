import TestRuns from './TestRuns';
import { connect } from 'react-redux';
import React, { Component } from 'react';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {};

class TestRunsRouter extends Component<any, any> {
  render() {
    return <TestRuns />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestRunsRouter);
