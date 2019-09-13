import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import User from './User.container';
import multilingualDictionary from './User.dictionary.json';
import { getDepartments } from '../../actions/Dictionaries';

import { userSelector, userIdSelector, dictionarySelector } from '../../selectors';
import { getUserById, purgeUser } from '../../actions/Users';

const mapStateToProps = (state, props) => ({
  user: userSelector(state),
  userId: userIdSelector({
    state,
    props
  }),
  dictionary: dictionarySelector({
    state,
    multilingualDictionary
  }),
  departments: state.Dictionaries.departments,
  lang: state.Localize.lang,
  isAdmin: state.Auth.user.globalRole === 'ADMIN'
});

const mapDispatchToProps = {
  getUserById,
  purgeUser,
  getDepartments
};

const options = {
  areMergedPropsEqual: isEqual
};

const mergeProps = (stateToProps, dispatchToProps, ownProps) => {
  const { getUserById: _getUserById, ..._dispatchToProps } = dispatchToProps;

  const getUser = () => _getUserById(stateToProps.userId);

  return {
    ...stateToProps,
    ..._dispatchToProps,
    ...ownProps,
    getUser
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options
)(User);
