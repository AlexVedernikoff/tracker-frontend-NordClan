import { createSelector } from 'reselect';
import sortPerformer from '../utils/sortPerformer';
import { getGitlabProjectRoles } from '../utils/gitlab';
import { uniqBy } from 'lodash';

export const usersSelector = state => state.Project.project.users;
export const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));

export const gitLabProjectsSelector = createSelector(
  state => state.Project.project,
  project => (project ? project.gitlabProjects || [] : [])
);
export const localizedGitlabRolesSelector = createSelector(
  state => state.Localize.lang,
  lang => getGitlabProjectRoles(lang)
);
export const projectIdSelector = state => state.Project.project.id;
export const selectJiraProject = state => {
  return {
    id: state.Project.project.externalId,
    hostname: state.Project.project.jiraHostname,
    jiraProjectName: state.Project.project.jiraProjectName
  };
};
export const projectPerformersSelector = createSelector(
  state => {
    return state.Project.project.users;
  },
  state => {
    return state.Project.project.performersTasksUniq;
  },
  (users = [], performers = []) => {
    return uniqBy([...users, ...performers], 'id');
  }
);
