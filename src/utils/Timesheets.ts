import find from 'lodash/find';
import * as timesheetsConstants from '../constants/Timesheets';
import moment from 'moment';

export const findTimesheet = (timesheetList, targetTimesheet) =>
  targetTimesheet.task
    ? find(
        timesheetList,
        curTimesheet =>
          curTimesheet.task.id === targetTimesheet.task.id && curTimesheet.taskStatusId === targetTimesheet.taskStatusId
      )
    : targetTimesheet.typeId !== 1
      ? find(timesheetList, curTimesheet => {
          const isSameType = curTimesheet.typeId === targetTimesheet.typeId;
          const isSameProject =
            (targetTimesheet.project ? targetTimesheet.project.id : 0) ===
            (curTimesheet.project ? curTimesheet.project.id : 0);
          const isSameSprint =
            (targetTimesheet.sprint ? targetTimesheet.sprint.id : 0) ===
            (curTimesheet.sprint ? curTimesheet.sprint.id : 0);
          return isSameType && isSameProject && isSameSprint;
        })
      : null;

// Проходит по массиву таймшитов и возвращает false если хотябы один таймшит засабмичен или апрувед
// Для случая с кнопкой для добавления активности при наличии апрувед и реджектед таймшитом используется флаг isRejectedTimesheetsAllowed=true
export const isTimesheetsCanBeChanged = (timesheetList, startingDay, isRejectedTimesheetsAllowed = false) => {
  if (!Array.isArray(timesheetList)) {
    return true;
  }

  if (timesheetList.length === 0) {
    return true;
  }

  const startingMoment = moment(startingDay).weekday(0);
  const weekDays = [0, 1, 2, 3, 4, 5, 6, 7].map((value, index) => {
    return startingMoment.add(index, 'days').format('DD.MM.YY');
  });

  if (isRejectedTimesheetsAllowed) {
    return !timesheetList.every(
      tsh =>
        weekDays.indexOf(moment(tsh.onDate).format('DD.MM.YY')) !== -1 &&
        (tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
          tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED)
    );
  } else {
    return !timesheetList.find(
      tsh =>
        weekDays.indexOf(moment(tsh.onDate).format('DD.MM.YY')) !== -1 &&
        (tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
          tsh.statusId === timesheetsConstants.TIMESHEET_STATUS_APPROVED)
    );
  }
};
