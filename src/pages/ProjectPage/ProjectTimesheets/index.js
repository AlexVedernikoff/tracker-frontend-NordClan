import { ProjectTimesheets } from './ProjectTimesheets';
import { createSelector } from 'reselect';
import * as timesheetsActions from '../../../actions/Timesheets';
import { connect } from 'react-redux';

const timeSheetsSelector = createSelector(
  state => state.Timesheets.list,
  state => state.Timesheets.tempTimesheets,
  function(list, tempTimesheets) {
    const defaultTaskStatusId = 2;
    const tempTimesheetsList = tempTimesheets.map(timesheet => {
      return {
        ...timesheet,
        taskStatusId: timesheet.taskStatusId || defaultTaskStatusId
      };
    });

    //TODO важен порядок сложения списков
    return list.concat(tempTimesheetsList);
  }
);

const mapStateToProps = state => ({
  startingDay: state.Timesheets.startingDay,
  list: timeSheetsSelector(state),
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd,
  lang: state.Localize.lang,
  users: state.Project.project.users
});

const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectTimesheets);
