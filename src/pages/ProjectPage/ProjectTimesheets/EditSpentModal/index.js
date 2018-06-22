import EditSpentModal from './EditSpentModal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  statuses: state.Dictionaries.taskStatuses,
  taskTypes: state.Dictionaries.taskTypes,
  projectId: state.Project.project.id,
  projectSprints: state.Project.project.sprints
});

export default connect(mapStateToProps)(EditSpentModal);
