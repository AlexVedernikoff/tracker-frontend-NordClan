import TestCases from './TestCases';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import { testCasesSelector, testSuitesSelector } from '../../../selectors/testingCaseReference';
import { updateTestCase } from '../../../actions/TestCase';
import { getAllTestCases } from '../../../actions/TestCase';
import css from './TestCases.scss';
import { Props } from './types';

const mapStateToProps = state => ({
  testSuites: testSuitesSelector(state),
  testCases: testCasesSelector(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getAllTestCases,
  updateTestCase
};

interface TestCasesRouterProp extends Props {
  testSuites: any[]
  testCases: any
  lang: 'en' | 'ru'
  getAllTestCases: Function
  updateTestCase: Function
}

class TestCasesRouter extends Component<TestCasesRouterProp, any> {
  render() {
    return <TestCases {...this.props} css={css} />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestCasesRouter);
