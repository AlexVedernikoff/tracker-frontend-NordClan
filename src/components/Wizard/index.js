import Wizard from './Wizard';
import { connect } from 'react-redux';
import { jiraAuthorize } from '../../actions/Jira';

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  jiraAuthorize
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Wizard);
