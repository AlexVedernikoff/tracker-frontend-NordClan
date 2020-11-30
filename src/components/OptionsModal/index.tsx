import OptionsModal from './OptionsModal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(OptionsModal);
