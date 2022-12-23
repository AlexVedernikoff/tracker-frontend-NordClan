import * as vacationSteps from './Timesheets/VacationGuide/constants';
import * as writeOffSteps from './Timesheets/WriteOffGuide/constants';
import * as sickLeaveSteps from './Timesheets/SickLeave/constants';

export const guideSteps = {
  ...vacationSteps,
  ...writeOffSteps,
  ...sickLeaveSteps
};
