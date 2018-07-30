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
    } else if (!user.fullNameRu && user.firstNameRu && user.lastNameRu) {
      return `${user.firstNameRu} ${user.lastNameRu}`;
    } else {
      return user.fullNameEn || `${user.firstNameEn} ${user.lastNameEn}`;
    }
  } else if (lang === 'en') {
    if (user.fullNameEn) {
      return user.fullNameEn;
    } else if (!user.fullNameEn && user.firstNameEn && user.lastNameEn) {
      return `${user.firstNameEn} ${user.lastNameEn}`;
    } else {
      return user.fullNameRu || `${user.firstNameRu} ${user.lastNameRu}`;
    }
  }
}
