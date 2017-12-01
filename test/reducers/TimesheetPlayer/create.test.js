import reducer from '../../../src/reducers/handlers/TimesheetPlayer'
import * as TimesheetPlayersActions from '../../../src/constants/TimesheetPlayer';
import * as TimesheetsActions from '../../../src/constants/Timesheets';

describe('reducer for timesheet player', () => {
  describe('create draft', () => {
    it('should return the initial state', () => {
      const initState = {
        tracks: {
          '2017-12-01': {
            tracks: [],
            scales: { all: 0 }
          }
        }
      }

      const expectedState = {
        tracks: {
          '2017-12-01': {
            tracks: [
              { id: 3, onDate: '2017-12-01', spentTime: '0.00', isDraft: true, taskId: 1, typeId: 0 }
            ],
            scales: {
              0: '0',
              all: '0'
            }
          }
        }
      }

      const action = {
        type: TimesheetsActions.CREATE_TIMESHEET_SUCCESS,
        timesheet: { id: 3, onDate: '2017-12-01', spentTime: '0.00', isDraft: true, taskId: 1, typeId: 0 }
      }

      expect(reducer(initState, action)).toEqual(expectedState);
    })
  })
})
