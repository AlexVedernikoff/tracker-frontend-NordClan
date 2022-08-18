import { createSelector } from 'reselect';
import checkRoles from '../utils/checkRoles';

const userListSelector = state => state.UserList;
export const userSelector = createSelector([userListSelector], state => {
  return state.user;
});

const authUserSelector = ({ state }) => state.Auth.user;
const paramsFromPropsSelector = ({ props }) => props.params;
export const userIdSelector = createSelector<any, any, any, any>([authUserSelector, paramsFromPropsSelector], (user, params) => {
  const userId = 'id' in params ? params.id : user.id;
  return String(userId);
});

const langSelector = ({ state }) => state.Localize.lang;
const multilingualDictionarySelector = ({ multilingualDictionary }) => {
  return multilingualDictionary;
};
export const dictionarySelector = createSelector<any, any, any, any>(
  [langSelector, multilingualDictionarySelector],
  (lang, multilingualDictionary) => {
    return multilingualDictionary[lang];
  }
);

export const globalRole = createSelector([authUserSelector], user => user.globalRole);

export const isAdmin = createSelector([globalRole], (globalRole) => checkRoles.isAdmin(globalRole));
export const isDevOps = createSelector([globalRole], (globalRole) => checkRoles.isDevOps(globalRole));
export const isExternalUser = createSelector([globalRole], (globalRole) => checkRoles.isExternalUser(globalRole));
export const isHR = createSelector([globalRole], (globalRole) => checkRoles.isHR(globalRole));
export const isVisor = createSelector([globalRole], (globalRole) => checkRoles.isVisor(globalRole));
export const isUser = createSelector([globalRole], (globalRole) => checkRoles.isUser(globalRole));