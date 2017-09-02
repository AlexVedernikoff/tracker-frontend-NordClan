import moment from 'moment';

export const startOfCurrentWeek = moment().startOf('isoWeek').add('days', 1).format('YYYY-MM-DD');
export const endOfCurrentWeek = moment().endOf('isoWeek').add('days', 1).format('YYYY-MM-DD');
