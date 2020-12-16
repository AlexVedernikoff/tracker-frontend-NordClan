import { createSelector } from 'reselect';
import { ADMIN, VISOR } from '../constants/Roles';

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

export const isAdmin = state => state.Auth.user.globalRole === ADMIN;
export const isVisor = state => state.Auth.user.globalRole === VISOR; 
