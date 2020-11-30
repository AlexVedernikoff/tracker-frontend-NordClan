import { createSelector } from 'reselect';
import { isArray, map, isNull } from 'lodash';
import moment from 'moment';

const timesheetsListSelector = state => state.Timesheets.list;
const timesheetsAverageNumberOfEmployeesSelector = state => state.Timesheets.averageNumberOfEmployees;

export const timesheetsListCompleteSelector = createSelector(timesheetsListSelector, timesheetsList => {
  if (isArray(timesheetsList)) {
    return map(timesheetsList, userTimesheetData => {
      const employmentDate = (() => {
        if (userTimesheetData.employmentDate) {
          return moment(userTimesheetData.employmentDate).format('DD.MM.YYYY');
        }
        return '';
      })();
      return {
        ...userTimesheetData,
        employmentDate
      };
    });
  }

  return [];
});

export const averageNumberOfEmployeesSelector = createSelector(
  timesheetsAverageNumberOfEmployeesSelector,
  averageNumberOfEmployees => {
    if (isNull(averageNumberOfEmployees)) {
      return null;
    }
    return averageNumberOfEmployees.total;
  }
);
