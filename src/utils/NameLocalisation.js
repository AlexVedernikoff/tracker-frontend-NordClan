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

const fullEn = 'fullNameEn';
const fullRu = 'fullNameRu';
const firstEn = 'firstNameEn';
const firstRu = 'firstNameRu';
const lastEn = 'lastNameEn';
const lastRu = 'lastNameRu';

const config = {
  en: { full: fullEn, altFull: fullRu, first: firstEn, last: lastEn },
  ru: { full: fullRu, altFull: fullEn, first: firstRu, last: lastRu }
};

const getLocalize = ({ full, first, last, altFull }, user) => {
  if (user[full]) {
    return user[full];
  } else if (user[first] && user[last]) {
    return `${user[first]} ${user[last]}`;
  } else {
    return user[altFull];
  }
};

export function getFullName(user) {
  return getLocalize(config[lang], user);
}
