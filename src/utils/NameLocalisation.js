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
  if (lang === 'ru') {
    if (user.fullNameRu) {
      return user.fullNameRu;
    } else {
      return `${user.firstNameRu} ${user.lastNameRu}`;
    }
  } else if (lang === 'en') {
    if (user.fullNameEn) {
      return user.fullNameEn;
    } else {
      return `${user.firstNameEn} ${user.lastNameEn}`;
    }
  }
}
