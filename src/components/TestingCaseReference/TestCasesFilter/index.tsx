import flow from 'lodash/flow';
import TestCasesFilter from './TestCasesFilter';
import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';

const initialFilters = Object.freeze({
  title: '',
  priority: null,
  severityId: 1,
  testSuiteId: null,
  authorId: null
});

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, initialFilters),
)(TestCasesFilter);
