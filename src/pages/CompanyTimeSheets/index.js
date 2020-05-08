import { connect } from 'react-redux';

import CompanyTimeSheets from './CompanyTimeSheets';

import {
  getCompanyTimesheets,
  getAverageNumberOfEmployees,
  approveTimesheets,
  changeProjectWeek,
  submitUserTimesheets,
  rejectTimesheets
} from '../../actions/Timesheets';
import { getDepartments } from '../../actions/Dictionaries';

import { timesheetsListCompleteSelector, averageNumberOfEmployeesSelector } from '../../selectors';

const mapStateToProps = state => ({
  averageNumberOfEmployees: averageNumberOfEmployeesSelector(state),
  dateBegin: state.Timesheets.dateBegin,
  dateEnd: state.Timesheets.dateEnd,
  departments: state.Dictionaries.departments,
  lang: state.Localize.lang,
  list: timesheetsListCompleteSelector(state),
  startingDay: state.Timesheets.startingDay
});

const mapDispatchToProps = {
  approveTimesheets,
  changeProjectWeek,
  getAverageNumberOfEmployees,
  getCompanyTimesheets,
  getDepartments,
  rejectTimesheets,
  submitUserTimesheets
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyTimeSheets);
