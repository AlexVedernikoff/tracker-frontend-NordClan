import TestCases from './TestCases';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  testSuitesReferenceSelector,
  testCasesReferenceSelector,
  testSuitesByProjectSelector,
  testCasesByProjectSelector,
} from '../../../selectors/testingCaseReference';
import {
  getAllTestSuites,
  getTestSuitesReference,
  updateTestSuite,
  copyTestSuite,
} from '../../../actions/TestSuite';
import {
  getAllTestCases,
  getTestCasesReference,
  updateTestCase,
  copyTestCase,
  deleteTestCase,
} from '../../../actions/TestCase';
import { showNotification } from '../../../actions/Notifications';
import css from './TestCases.scss';
import { Props } from './types';

const mapStateToProps = state => ({
  testSuitesReference: testSuitesReferenceSelector(state),
  testCasesReference: testCasesReferenceSelector(state),
  testSuitesByProject: testSuitesByProjectSelector(state),
  testCasesByProject: testCasesByProjectSelector(state),
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getAllTestCases,
  getAllTestSuites,
  getTestSuitesReference,
  getTestCasesReference,
  updateTestSuite,
  copyTestCase,
  copyTestSuite,
  deleteTestCase,
  showNotification,
};

interface TestCasesRouterProp extends Props {
  testSuitesReference: any[]
  testCasesReference: any
  lang: 'en' | 'ru'
  getAllTestCases: Function
  getAllTestSuites: Function
  getTestSuitesReference: Function
  getTestCasesReference: Function
  updateTestSuite: Function
  copyTestCase: Function
  copyTestSuite: Function
  deleteTestCase: Function
  showNotification: Function
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
