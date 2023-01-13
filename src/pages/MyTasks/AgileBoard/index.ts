import { connect } from 'react-redux';

import flow from 'lodash/flow';

import AgileBoard from './AgileBoard';
import localize from './AgileBoard.json';
import { initialFilters } from '../constants';

import { includeExtUsersSelector, sortedUsersSelector } from '../../../selectors/Project';
import { getSortedTasks, getMyTasks } from '../../../selectors/agileBoard';

import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';

import { changeTask, startTaskEditing } from '../../../actions/Task';
import { getProjectUsers, getProjectInfo } from '../../../actions/Project';

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, initialFilters),
  connect(
    state => ({
      devOpsUsers: state.UserList.devOpsUsers,
      globalRole: state.Auth.user.globalRole,
      isCreateTaskModalOpen: state.Project.isCreateTaskModalOpen,
      lang: state.Localize.lang,
      localizationDictionary: localize[state.Localize.lang],
      myTasks: getMyTasks(state),
      sortedUsers: sortedUsersSelector(state),
      sprintTasks: state.Tasks.tasks,
      tasks: getSortedTasks(state),
      unsortedUsers: includeExtUsersSelector(state), 
      user: state.Auth.user,
    }),
    {
      changeTask,
      getProjectInfo,
      getProjectUsers,
      startTaskEditing
    }
  )
)(AgileBoard);
