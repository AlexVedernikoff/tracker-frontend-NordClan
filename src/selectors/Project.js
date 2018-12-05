import { createSelector } from 'reselect';
import sortPerformer from '../utils/sortPerformer';

const usersSelector = state => state.Project.project.users;
export const sortedUsersSelector = createSelector(usersSelector, users => sortPerformer(users));
