import find from 'lodash/find';

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
