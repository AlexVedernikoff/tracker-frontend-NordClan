import ExternalUserExpiredDate from './ExternalUserExpiredDate';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(ExternalUserExpiredDate);
