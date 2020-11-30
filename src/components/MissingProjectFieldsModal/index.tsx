import MissingProjectFieldsModal from './MissingProjectFieldsModal';
import { connect } from 'react-redux';
import { getProjectTypes } from '../../selectors/dictionaries';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  projectTypes: getProjectTypes(state)
});

export default connect(
  mapStateToProps,
  null
)(MissingProjectFieldsModal);
