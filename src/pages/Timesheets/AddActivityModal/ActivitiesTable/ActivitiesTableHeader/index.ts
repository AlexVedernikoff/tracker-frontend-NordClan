import ActivitiesTableHeader from '~/pages/Timesheets/AddActivityModal/ActivitiesTable/ActivitiesTableHeader/ActivitiesTableHeader';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps, null)(ActivitiesTableHeader);
