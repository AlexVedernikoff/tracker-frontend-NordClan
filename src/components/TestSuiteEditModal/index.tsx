import TestSuiteFormModal from './TestSuiteFormModal';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  isLoading: !!state.Loading.loading
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TestSuiteFormModal);
