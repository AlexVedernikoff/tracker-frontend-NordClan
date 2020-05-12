import { connect } from 'react-redux';

import flow from 'lodash/flow';

import AgileBoard from './AgileBoard';
import localize from './AgileBoard.json';
import { initialFilters } from './constants';

import { sortedUsersSelector, usersSelector } from '../../../selectors/Project';

import withFiltersManager from '../../../components/FiltrersManager/FiltersManager';

import { agileBoardSelector } from '../../../selectors/agileBoard';
import getTasks from '../../../actions/Tasks';
import { changeTask, startTaskEditing } from '../../../actions/Task';
import { openCreateTaskModal, getProjectUsers, getProjectInfo, getProjectTags } from '../../../actions/Project';
import { showNotification } from '../../../actions/Notifications';
import { getDevOpsUsers } from '../../../actions/Users';
import { addActivity } from '../../../actions/Timesheets';

export default flow(
  WrappedComponent => withFiltersManager(WrappedComponent, initialFilters),
  connect(
    state => ({
      ...agileBoardSelector(state),
      sortedUsers: sortedUsersSelector(state),
      unsortedUsers: usersSelector(state),
      localizationDictionary: localize[state.Localize.lang],
      lang: state.Localize.lang
    }),
    {
      addActivity,
      getDevOpsUsers,
      getTasks,
      changeTask,
      startTaskEditing,
      openCreateTaskModal,
      getProjectUsers,
      getProjectInfo,
      getProjectTags,
      showNotification
    }
  )
)(AgileBoard);
