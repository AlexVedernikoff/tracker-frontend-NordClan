import reducer from '../../../src/reducers/TimesheetPlayer';
import * as TimesheetPlayersActions from '../../../src/constants/TimesheetPlayer';
import * as TimesheetsActions from '../../../src/constants/Timesheets';

describe('reducer for timesheet player', () => {
  describe('update time of draft', () => {
    it('should return the initial state', () => {
      const initState = {
        tracks: {
          '2017-12-01': {
            tracks: [{ id: 1, onDate: '2017-12-01', spentTime: '0.00', isDraft: true, taskId: 1, typeId: 0 }],
            scales: {
              0: 0,
              all: 0
            }
          }
        }
      };

      const expectedState = {
        tracks: {
          '2017-12-01': {
            tracks: [{ id: 3, onDate: '2017-12-01', spentTime: '10.00', isDraft: false, taskId: 1, typeId: 0 }],
            scales: {
              0: '10',
              all: '10'
            }
          }
        }
      };

      const action = {
        type: TimesheetsActions.CREATE_TIMESHEET_SUCCESS,
        timesheet: { id: 3, onDate: '2017-12-01', spentTime: '10.00', isDraft: false, taskId: 1, typeId: 0 }
      };

      expect(reducer(initState, action)).toEqual(expectedState);
    });
  });
});
