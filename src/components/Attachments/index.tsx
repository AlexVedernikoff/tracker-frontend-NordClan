import Attachments from './Attachments';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(Attachments);
