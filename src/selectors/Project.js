import { createSelector } from 'reselect';
import sortPerformer from '../utils/sortPerformer';

export const usersSelector = state => state.Project.project.users;
export const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));
export const projectIdSelector = state => state.Project.project.id;
export const selectJiraProject = state => {
  return {
    id: state.Project.project.externalId,
    hostname: state.Project.project.jiraHostname,
    jiraProjectName: state.Project.project.jiraProjectName
  };
};
