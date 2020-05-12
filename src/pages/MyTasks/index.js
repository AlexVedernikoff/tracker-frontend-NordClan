import { connect } from 'react-redux';

import flow from 'lodash/flow';

import localize from './MyTasks.json';

import MyTasks from './MyTasks';
import { initialFilters } from './constants';

import withFiltersManager from '../../components/FiltrersManager/FiltersManager';

import getTasks from '../../actions/Tasks';

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, initialFilters),
  connect(
    state => ({
      localizationDictionary: localize[state.Localize.lang],
      lang: state.Localize.lang
    }),
    {
      getTasks
    }
  )
)(MyTasks);
