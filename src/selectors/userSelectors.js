import { createSelector } from 'reselect';

const userListSelector = state => state.UserList;
export const userSelector = createSelector([userListSelector], state => {
  return state.user;
});

const authUserSelector = ({ state }) => state.Auth.user;
const paramsFromPropsSelector = ({ props }) => props.params;
export const userIdSelector = createSelector([authUserSelector, paramsFromPropsSelector], (user, params) => {
  const userId = 'id' in params ? params.id : user.id;

  return String(userId);
});

const langSelector = ({ state }) => state.Localize.lang;
const multilingualDictionarySelector = ({ multilingualDictionary }) => {
  return multilingualDictionary;
};
export const dictionarySelector = createSelector(
  [langSelector, multilingualDictionarySelector],
  (lang, multilingualDictionary) => {
    return multilingualDictionary[lang];
  }
);
