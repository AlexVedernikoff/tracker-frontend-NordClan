import { createSelector } from 'reselect';
import { isArray, size, map, reduce, range, floor } from 'lodash';
import moment from 'moment';

const timesheetsListSelector = state => state.Timesheets.list;
const timesheetsDateBeginSelector = state => state.Timesheets.dateBegin;

export const timesheetsListCompleteSelector = createSelector(timesheetsListSelector, timesheetsList => {
  if (isArray(timesheetsList)) {
    return map(timesheetsList, userTimesheetData => {
      const createdAt = (() => {
        if (userTimesheetData.createdAt) {
          return moment(userTimesheetData.createdAt).format('DD.MM.YYYY');
        }
        return '';
      })();
      return {
        ...userTimesheetData,
        createdAt
      };
    });
  }

  return [];
});

const WORKED_DAYS = 5;
const workWeekArr = range(WORKED_DAYS);
export const averageNumberOfEmployeesPerWeekSelector = createSelector(
  [timesheetsListSelector, timesheetsDateBeginSelector],
  (timesheetsList, dateBegin) => {
    const usersSize = size(timesheetsList);
    const momentDateBegin = moment(dateBegin);
    if (usersSize) {
      const result = reduce(
        timesheetsList,
        (accumulator, ths) => {
          const momentCreatedAt = moment(ths.createdAt);
          const totalUserNotEmployee = reduce(
            workWeekArr,
            (total, weekDay) => {
              const momentNewWeekDay = moment(momentDateBegin).add(weekDay, 'days');
              if (momentNewWeekDay.isSameOrAfter(momentCreatedAt, 'day')) {
                return total + 1;
              }
              return total;
            },
            0
          );
          return accumulator + totalUserNotEmployee;
        },
        0
      );
      return floor(result / WORKED_DAYS, 1);
    }
    return 0;
  }
);
