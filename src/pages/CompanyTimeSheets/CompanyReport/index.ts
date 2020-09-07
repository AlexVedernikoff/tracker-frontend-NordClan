import { connect } from 'react-redux';

import CompanyReport from './CompanyReport';

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
