import { connect } from 'react-redux';

import TestingCaseReference from './TestingCaseReference';

import { getTestCasesReference, deleteTestCase } from '../../actions/TestCase';
import {
  updateTestSuite,
  getTestSuitesReference,
} from '../../actions/TestSuite';
import { testCasesReferenceSelector, testSuitesReferenceSelector } from '../../selectors/testingCaseReference';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  testSuites: testSuitesReferenceSelector(state),
  testCases: testCasesReferenceSelector(state)
});

const mapDispatchToProps = {
  updateTestSuite,
  deleteTestCase,
  getAllTestSuites: getTestSuitesReference,
  getAllTestCases: getTestCasesReference
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCaseReference);
