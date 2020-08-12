import TestCases from './TestCases';
import { connect } from 'react-redux';
import React, { Component } from 'react';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {};

class TestCasesRouter extends Component {
  render() {
    return <TestCases />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestCasesRouter);
