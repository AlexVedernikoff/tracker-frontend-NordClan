import moment from 'moment';

const dateFormat = 'DD.MM.YYYY';
const dateFormat2 = 'YYYY-MM-DD';
export default (sprint, options) => {
  const { factStartDate, factFinishDate } = sprint;
  const from = moment(factStartDate).format(dateFormat2);
  const to = moment(factFinishDate).format(dateFormat2);
  const sprintDate = `&sprintStartDate=${factStartDate}&sprintFinishDate=${factFinishDate}`;
  return `lang=${options.lang}&startDate=${from}&endDate=${to}&sprintId=${sprint.id}&label=${sprint.name} (${moment(
    factStartDate
  ).format(dateFormat)} - ${moment(factFinishDate).format(dateFormat)})${sprintDate}`;
};
