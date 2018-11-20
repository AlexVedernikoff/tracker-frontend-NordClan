import ActivityRowForTask from './ActivityRowForTask';
import { connect } from 'react-redux';
import * as timesheetsActions from '../../../../actions/Timesheets';

const mapStateToProps = state => ({
  userId: state.Auth.user.id,
  startingDay: state.Timesheets.startingDay,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  ...timesheetsActions
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityRowForTask);
