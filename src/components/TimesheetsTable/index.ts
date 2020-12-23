import TimesheetsTable from './TimesheetsTable';

import { connect } from 'react-redux';
import { getAllUsers } from '~/actions/Users';

const mapStateToProps = state => ({
  unsortedUsers: state.UserList.users,
});

const mapDispatchToProps = {
  getAllUsers
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimesheetsTable);

