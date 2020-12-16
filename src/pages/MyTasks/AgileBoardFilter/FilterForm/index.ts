import FilterForm from './FilterForm';
import { connect } from 'react-redux';
import { ADMIN, VISOR } from '../../../../constants/Roles';

const mapStateToProps = state => ({
  isAdmin: state.Auth.user.globalRole === ADMIN,
  isVisor: state.Auth.user.globalRole === VISOR,
});
export default connect(
  mapStateToProps,
  {}
)(FilterForm);
