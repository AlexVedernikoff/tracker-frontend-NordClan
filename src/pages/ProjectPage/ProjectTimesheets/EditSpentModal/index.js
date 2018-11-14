import EditSpentModal from './EditSpentModal';
import { connect } from 'react-redux';
import { getLocalizedTaskTypes, getLocalizedTaskStatuses } from '../../../../selectors/dictionaries';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  statuses: getLocalizedTaskStatuses(state),
  taskTypes: getLocalizedTaskTypes(state),
  projectId: state.Project.project.id,
  projectSprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(EditSpentModal);
