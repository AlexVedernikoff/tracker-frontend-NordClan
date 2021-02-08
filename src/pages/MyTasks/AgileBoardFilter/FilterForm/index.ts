import FilterForm from './FilterForm';
import { connect } from 'react-redux';
import { isAdmin, isVisor } from '../../../../selectors/userSelectors';


const mapStateToProps = state => ({
  isAdmin: isAdmin({state}),
  isVisor: isVisor({state})
});
export default connect(
  mapStateToProps,
  {}
)(FilterForm);
