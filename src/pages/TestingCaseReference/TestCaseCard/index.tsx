import { connect } from 'react-redux';

import TestCaseCard from './TestCaseCard';

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(TestCaseCard);
