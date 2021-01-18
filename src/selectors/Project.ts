import { createSelector } from 'reselect';
import sortPerformer from '../utils/sortPerformer';
import { getGitlabProjectRoles } from '../utils/gitlab';
import StoreType from '../store/store.type';

export const usersSelector = state => state.Project.project.users;
export const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));

export const gitLabProjectsSelector = createSelector(
  (state: any) => state.Project.project,
  project => (project ? project.gitlabProjects || [] : [])
);
export const localizedGitlabRolesSelector = createSelector(
  (state: any) => state.Localize.lang,
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

const currentUserIdSelector = store => store.Auth.user.id;
export const currentUserProjectRoles = createSelector([usersSelector, currentUserIdSelector], (users, userId) => {
  const user = users.find(user => user.id == userId);
  return user?.roles || {};
});