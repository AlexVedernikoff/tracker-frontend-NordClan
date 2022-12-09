import { stepTimeOffInfo } from './Timesheets/TimeOff/const';
import {stepAddActivity,stepActivitiesTable, stepAddProject, stepTaskRow,stepToggleComment} from './Timesheets/const';
import {stepChooseTypeActivity, stepAddVacation, stepVacationTaskRow} from './Timesheets/Vacation/const';
import {stepChooseSickLeaveTypeActivity,stepAddSickLeave,stepSickLeaveTaskRow} from './Timesheets/SickLeave/const';
import {stepWorkLaterInfo} from './Timesheets/WorkLater/const';


import {stepChooseProject, stepTaskInfo} from './ProjectPage/const';

let guideSteps = {
  stepAddActivity,
  stepActivitiesTable, 
  stepAddProject, 
  stepTaskRow,
  stepToggleComment,
  stepChooseTypeActivity,
  stepAddVacation, 
  stepVacationTaskRow,
  stepChooseSickLeaveTypeActivity,
  stepAddSickLeave,
  stepSickLeaveTaskRow,
  stepWorkLaterInfo,
  stepTimeOffInfo,
  stepChooseProject,
  stepTaskInfo
}

export const guides =  guideSteps;

export type GuideNames = keyof typeof guides;
