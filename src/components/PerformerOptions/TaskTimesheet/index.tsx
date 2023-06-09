import TaskTimesheet from './TaskTimesheet';
import { connect } from 'react-redux';
import * as timesheetsActions from '../../../actions/Timesheets';

const mapStateToProps = state => ({
  task: state.Task.task,
  selectedActivityType: state.Timesheets.selectedActivityType,
  selectedTask: state.Timesheets.selectedTask,
  startingDay: state.Timesheets.startingDay,
  tempTimesheets: state.Timesheets.tempTimesheets,
  list: state.Timesheets.list,
  userId: state.Auth.user.id,
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd,
  lang: state.Localize.lang
});
const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskTimesheet);
