import { connect } from 'react-redux';

import TestingCaseReference from './TestingCaseReference';

import { getAllTestCases } from '../../actions/TestCase';
import { getAllTestSuites } from '../../actions/TestSuite';
import { testCasesSelector, testSuitesSelector } from '../../selectors/testingCaseReference';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  testSuites: testSuitesSelector(state),
  testCases: testCasesSelector(state)
});

const mapDispatchToProps = {
  getAllTestSuites,
  getAllTestCases
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCaseReference);
