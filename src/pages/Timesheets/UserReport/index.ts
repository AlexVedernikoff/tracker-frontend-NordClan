import { connect } from 'react-redux';

import CompanyReport from './UserReport';

import { showNotification } from '../../../actions/Notifications';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompanyReport);
