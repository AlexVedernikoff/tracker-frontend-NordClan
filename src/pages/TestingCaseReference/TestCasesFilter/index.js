import { connect } from 'react-redux';

import flow from 'lodash/flow';

import TestCasesFilter from './TestCasesFilter';

import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';
import { getOptionsFrom } from '../../../helpers/selectOptions';
import { getLocalizedTestCaseSeverities } from '../../../selectors/dictionaries';
import { authorsOptionsSelector, testSuitesOptionsSelector } from '../../../selectors/testingCaseReference';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  authorsOptions: authorsOptionsSelector(state),
  severitiesOptions: getOptionsFrom(getLocalizedTestCaseSeverities(state), 'name', 'id'),
  testSuitesOptions: testSuitesOptionsSelector(state)
});

const initialFilters = Object.freeze({
  title: '',
  priority: null,
  severityId: 1,
  testSuiteId: null,
  authorId: null
});

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, initialFilters),
  connect(mapStateToProps)
)(TestCasesFilter);
