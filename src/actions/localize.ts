import moment from 'moment';

export const setLocalize = lang => {
  moment.locale(lang, {
    week: {
      dow: 1
    } as any
  });
  localStorage.setItem('lang', lang);
  return {
    type: 'SET_LOCALIZE',
    lang
  };
};
