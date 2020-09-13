import { NavMenu } from './NavMenu.container';
import { connect } from 'react-redux';

import { setLocalize } from '../../../actions/localize';

const mapStateToProps = state => ({
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  setLocalize
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NavMenu);
