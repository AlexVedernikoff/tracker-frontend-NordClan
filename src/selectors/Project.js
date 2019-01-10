import { createSelector } from 'reselect';
import sortPerformer from '../utils/sortPerformer';
import { getGitlabProjectRoles } from '../utils/gitlab';

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
