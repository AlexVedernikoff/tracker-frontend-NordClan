import FilterForm from './FilterForm';
import { connect } from 'react-redux';
import isAdmin from '../../../../utils/isAdmin';
import { isVisor } from '../../../../utils/isVisor';

const mapStateToProps = state => ({
  isAdmin: isAdmin(state.Auth.user.globalRole),
  isVisor: isVisor(state.Auth.user.globalRole),
});
export default connect(
  mapStateToProps,
  {}
)(FilterForm);
