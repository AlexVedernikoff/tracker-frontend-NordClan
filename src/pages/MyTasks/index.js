import { connect } from 'react-redux';
import localize from './MyTasks.json';

import MyTasks from './MyTasks';

const mapStateToProps = state => ({
  localizationDictionary: localize[state.Localize.lang],
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(MyTasks);
