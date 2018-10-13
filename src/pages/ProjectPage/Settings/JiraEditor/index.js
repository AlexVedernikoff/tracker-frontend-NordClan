import ConfirmModal from './ConfirmModal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(ConfirmModal);

// TODO: сделать норм
