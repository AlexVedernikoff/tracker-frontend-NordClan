import { connect } from 'react-redux';

import TestSuite from './TestSuite';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(TestSuite);
