import { connect } from 'react-redux';

import CreateTestCaseModal from './CreateTestCaseModal';

import { createTestCase, getAllTestCases } from '../../../actions/TestCase';
import { getOptionsFrom } from '../../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities, getLocalizedTestCaseStatuses } from '../../../selectors/dictionaries';
import { testSuitesOptionsSelector } from '../../../selectors/testingCaseReference';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  statuses: getOptionsFrom(getLocalizedTestCaseStatuses(state), 'name', 'id'),
  severities: getOptionsFrom(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  testSuites: testSuitesOptionsSelector(state),
  authorId: state.Auth.user.id,
  isLoading: !!state.Loading.loading
});

const mapDispatchToProps = {
  createTestCase,
  getAllTestCases
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateTestCaseModal);
