import StatusSelectModal from './StatusSelectModal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(StatusSelectModal);
