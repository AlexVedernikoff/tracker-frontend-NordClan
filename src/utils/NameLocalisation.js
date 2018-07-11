import { store } from '../History';

let lang = 'en';
store.subscribe(() => {
  lang = store.getState().Localize.lang;
});

export function getFirstName(user) {
  return lang === 'ru' ? user.firstNameRu : user.firstNameEn;
}

export function getLastName(user) {
  return lang === 'ru' ? user.lastNameRu : user.lastNameEn;
}

export function getFullName(user) {
  return lang === 'ru'
    ? user.fullNameRu || `${user.firstNameRu} ${user.lastNameRu}`
    : user.fullNameEn || `${user.firstNameEn} ${user.lastNameEn}`;
}
