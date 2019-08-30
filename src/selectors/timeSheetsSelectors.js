import { createSelector } from 'reselect';
import { isArray, get } from 'lodash';
import moment from 'moment';

const timesheetsSelector = state => state.Timesheets;

export const timesheetsListSelector = createSelector(timesheetsSelector, timesheets => {
  const timesheetsList = get(timesheets, 'list', []);

  if (isArray(timesheetsList)) {
    return timesheetsList.map(userTimesheetData => {
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
