import TestCases from './TestCases';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { testCasesSelector, testSuitesSelector } from '../../../selectors/testingCaseReference';
import { updateTestCase } from '../../../actions/TestCase';
import { getAllTestCases } from '../../../actions/TestCase';
import css from './TestCases.scss';

const mapStateToProps = state => ({
  testSuites: testSuitesSelector(state),
  testCases: testCasesSelector(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getAllTestCases,
  updateTestCase
};

type TestCasesRouterProp = {
  testSuites: any[],
  testCases: any[],
  lang: string,
  getAllTestCases: (...args: any[]) => any,
  updateTestCase: (...args: any[]) => any,
  params: { projectId: string },
}

class TestCasesRouter extends Component<TestCasesRouterProp, any> {
  render() {
    debugger;
    return <TestCases {...this.props} css={css} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestCasesRouter);
