import { connect } from 'react-redux';

import flow from 'lodash/flow';

import localize from './MyTasks.json';

import MyTasks from './MyTasks';
import { initialFilters } from './constants';

import withFiltersManager from '../../components/FiltrersManager/FiltersManager';

import { getTypeOptions } from '../../selectors/agileBoard';

import getTasks from '../../actions/Tasks';
import { getAllUsers } from '../../actions/Users';

import isAdmin from '../../utils/isAdmin';

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, { ...initialFilters }),
  connect(
    state => ({
      isAdmin: isAdmin(state.Auth.user.globalRole),
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
