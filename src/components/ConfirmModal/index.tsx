import ConfirmModal from './ConfirmModal';
import useConfirmModal from './ConfirmModalHook';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export {
  useConfirmModal
};

export default connect(
  mapStateToProps,
  null
)(ConfirmModal);
