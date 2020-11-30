import { createSelector } from 'reselect';

const rootSelector = state => state.Localize;
export const langSelector = createSelector(rootSelector, root => root.lang);
