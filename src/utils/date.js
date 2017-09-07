import moment from 'moment';

export const startOfCurrentWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
export const endOfCurrentWeek = moment().endOf('isoWeek').format('YYYY-MM-DD');
