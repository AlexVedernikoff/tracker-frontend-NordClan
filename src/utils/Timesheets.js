import find from 'lodash/find';
import * as timesheetsConstants from '../constants/Timesheets';

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
export const isTimesheetsCanBeChanged = timesheetList => {
  if (!Array.isArray(timesheetList)) {
    return true;
  }

  if (timesheetList.length === 0) {
    return true;
  }

  return !timesheetList.find(
    tsh =>
      tsh.statusId !== timesheetsConstants.TIMESHEET_STATUS_SUBMITTED ||
      tsh.statusId !== timesheetsConstants.TIMESHEET_STATUS_APPROVED
  );
};
