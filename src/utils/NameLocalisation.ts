import { store } from '../History';

let lang = 'en';
store.subscribe(() => {
  lang = store.getState().Localize.lang;
});

export function getFirstName(user) {
  if (lang === 'ru' && user.firstNameRu) {
    return user.firstNameRu;
  }
  return (user.firstNameEn && user.firstNameEn) || user.firstNameRu || '';
}

export function getLastName(user) {
  if (lang === 'ru' && user.lastNameRu) {
    return user.lastNameRu;
  }
  return (user.lastNameEn && user.lastNameEn) || user.lastNameRu || '';
}

const fullEn = 'fullNameEn';
const fullRu = 'fullNameRu';
const firstEn = 'firstNameEn';
const firstRu = 'firstNameRu';
const lastEn = 'lastNameEn';
const lastRu = 'lastNameRu';

export const notFoundEn = 'User Not Found';
export const notFoundRu = 'Пользователь не найден';

export const getLocalizedUserFieldNames = () => {
  return {
    firstName: lang === 'ru' ? firstRu : firstEn,
    lastName: lang === 'ru' ? lastRu : lastEn,
  }
}

export const getNonLocalizedUserFieldNames = () => {
  return {
    firstName: lang === 'ru' ? firstEn : firstRu,
    lastName: lang === 'ru' ? lastEn : lastRu,
  }
}

const config = {
  en: { full: fullEn, altFull: fullRu, first: firstEn, last: lastEn, altFirst: firstRu, altLast: lastRu },
  ru: { full: fullRu, altFull: fullEn, first: firstRu, last: lastRu, altFirst: firstEn, altLast: lastEn }
};

const getLocalize = ({ full, first, last, altFull, altFirst, altLast }, user, reverse = false) => {
  if (!user) {
    return lang === 'en' ? notFoundEn : notFoundRu;
  }

  if (user[full]) {
    return reverse
      ? user[full]
        .split(' ')
        .reverse()
        .join(' ')
      : user[full];
  }

  if (user[first] && user[last]) {
    return reverse ? `${user[last]} ${user[first]}` : `${user[first]} ${user[last]}`;
  }

  if (user[altFull]) {
    return reverse
      ? user[altFull]
        .split(' ')
        .reverse()
        .join(' ')
      : user[altFull];
  }

  if (user[altFirst] && user[altLast]) {
    return reverse ? `${user[altLast]} ${user[altFirst]}` : `${user[altFirst]} ${user[altLast]}`;
  }

  return user.login;
};

export function getFullName(user, reverse = false) {
  return getLocalize(config[lang], user, reverse);
}

export function getMessage(history) {
  return lang === 'ru' ? history.message : history.messageEn || history.message;
}

export function getDictionaryName(dictionary) {
  return lang === 'ru' ? dictionary.name : dictionary.nameEn || dictionary.name;
}
