import { connect } from 'react-redux';

import flow from 'lodash/flow';

import localize from './MyTasks.json';

import MyTasks from './MyTasks';
import { initialFilters } from './constants';

import withFiltersManager from '../../components/FiltrersManager/FiltersManager';

import getTasks from '../../actions/Tasks';
import { getTypeOptions } from '../../selectors/agileBoard';

import { getAllUsers } from '../../actions/Users';

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, { ...initialFilters }),
  connect(
    state => ({
      lang: state.Localize.lang,
      localizationDictionary: localize[state.Localize.lang],
      typeOptions: getTypeOptions(state),
      users: state.UserList.users
    }),
    {
      getAllUsers,
      getTasks
    }
  )
)(MyTasks);
