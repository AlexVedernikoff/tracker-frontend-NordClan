import Attachments from './Attachments';
import { connect } from 'react-redux';
import { showNotification } from '../../actions/Notifications';
import { langSelector } from '../../selectors/Localize';

const mapStateToProps = state => ({
  lang: langSelector(state)
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Attachments);
