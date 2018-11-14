import PerformerModal from './PerformerModal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localization.lang
});

export default connect(mapStateToProps)(PerformerModal);
