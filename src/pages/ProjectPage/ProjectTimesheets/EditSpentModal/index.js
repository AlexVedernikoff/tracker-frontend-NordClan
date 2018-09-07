import EditSpentModal from './EditSpentModal';
import { connect } from 'react-redux';
import { getLocalizedTaskTypes } from '../../../../selectors/dictionaries';

const mapStateToProps = state => ({
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: getLocalizedTaskTypes(state),
  projectId: state.Project.project.id,
  projectSprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(EditSpentModal);
