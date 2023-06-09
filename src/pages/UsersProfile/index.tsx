import { connect } from 'react-redux';
import { isEqual } from 'lodash';

import User from './User.container';
import multilingualDictionary from './User.dictionary.json';

import { userSelector, userIdSelector, dictionarySelector } from '../../selectors';
import { getUserById, purgeUser, updateUsersProfile, createUser } from '../../actions/Users';
import { getDepartments } from '../../actions/Dictionaries';
import isAdmin from '../../utils/isAdmin';
import isHR from '../../utils/isHR';

const mapStateToProps = (state, props) => ({
  canEdit: [isAdmin, isHR].some(checkPermission => checkPermission(state.Auth.user.globalRole)),
  departments: state.Dictionaries.departments,
  user: userSelector(state),
  userId: userIdSelector({
    state,
    props
  }),
  dictionary: dictionarySelector({
    state,
    multilingualDictionary
  }),
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  getUserById,
  purgeUser,
  getDepartments,
  updateUsersProfile,
  createUser
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
