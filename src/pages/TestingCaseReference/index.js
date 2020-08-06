import { connect } from 'react-redux';

import TestingCaseReference from './TestingCaseReference';

import { getAllTestCases } from '../../actions/TestCase';
import { testCasesSelector } from '../../selectors/testingCaseReference';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  testCases: testCasesSelector(state)
});

const mapDispatchToProps = {
  getAllTestCases
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestingCaseReference);
