import moment from 'moment';

export const startOfCurrentWeek = moment()
  .startOf('week')
  .format('YYYY-MM-DD');
export const endOfCurrentWeek = moment()
  .endOf('week')
  .format('YYYY-MM-DD');
export const initMomentLocale = () => {
  const lang = localStorage.getItem('lang') || 'en';
  moment.locale(lang, {
    week: {
      dow: 1
    }
  });
  return lang;
};
