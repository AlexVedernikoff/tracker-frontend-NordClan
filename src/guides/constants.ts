/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import PluggableGuideIterator from './domain/PluggableGuide/PluggableGuide';

/**
 * @description hash-пути для определения гайда
 */
export enum GuideHash {
  VACATION = '#vacation',
  TO_WRITE_OFF_TIME = '#to_write_off_time',
  SICK_LEAVE = '#sick_leave',
}

export const GuideName = {
  [GuideHash.SICK_LEAVE]: 'isSickLeaveGuideCompleted',
  [GuideHash.TO_WRITE_OFF_TIME]: 'isOffTimeGuideCompleted',
  [GuideHash.VACATION]: 'isVacationGuideCompleted'
};

export const guidesHashes = Object.values(GuideHash);

/**
 * @description Маппер window.location.hash -> функция получения нужного гайда
 *
 * @example guideIteratorByHash[window.location.hash]()
 */
export const guideIteratorByHash = {
  [GuideHash.VACATION]: (dispatch) => new PluggableGuideIterator(dispatch, [
    'vacationAddActivity',
    'vacationChooseTypeActivity',
    'vacationTaskRow'
  ]),
  [GuideHash.TO_WRITE_OFF_TIME]: (dispatch) => new PluggableGuideIterator(dispatch, [
    'writeOffAddActivity',
    'writeOffActivitiesTable',
    'writeOffTaskRow'
  ]),
  [GuideHash.SICK_LEAVE]: (dispatch) => new PluggableGuideIterator(dispatch, [
    'sickLeaveAddActivity',
    'sickLeaveTypeActivity',
    'sickLeaveTaskRow'
  ])
};
