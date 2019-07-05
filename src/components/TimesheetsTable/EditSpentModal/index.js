import EditSpentModal from './EditSpentModal';
import { connect } from 'react-redux';
import { getLocalizedMagicActiveTypes, getLocalizedTaskStatuses } from '../../../selectors/dictionaries';
import { getProjectSprints } from '../../../actions/Project';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  statuses: getLocalizedTaskStatuses(state),
  sprints: state.Project.project.sprints,
  magicActivitiesTypes: getLocalizedMagicActiveTypes(state)
});

const mapDispatchToProps = {
  getProjectSprints
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditSpentModal);
