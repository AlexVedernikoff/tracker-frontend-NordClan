import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';
import localize from './PerformerFilter.json';
import { getFullName } from '../../utils/NameLocalisation';
import * as _ from 'lodash';
import { removeNumChars } from '../../utils/formatter';

class PerformerFilter extends React.Component {
  static propTypes = {
    devOpsUsers: PropTypes.array,
    lang: PropTypes.string,
    onPerformerSelect: PropTypes.func.isRequired,
    selectedPerformerId: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    users: PropTypes.array
  };

  getUsers = () => {
    const { devOpsUsers } = this.props;
    const users = _.uniqWith(
      this.props.users.concat(devOpsUsers ? devOpsUsers : []),
      (val, val2) => val.id === val2.id
    ).map(user => ({
      value: user.id,
      label: getFullName(user)
    }));
    users.unshift({ value: '0', label: localize[this.props.lang].NOT_CHANGED });
    return users;
  };

  render() {
    const { lang } = this.props;
    return (
      <SelectDropdown
        name="performer"
        placeholder={localize[lang].CHANGE_PERFORMER}
        multi
        value={this.props.selectedPerformerId}
        onChange={this.props.onPerformerSelect}
        onInputChange={removeNumChars}
        noResultsText={localize[lang].NO_RESULTS}
        options={this.getUsers()}
        backspaceToRemoveMessage={''}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.Project.project.users,
    devOpsUsers: state.UserList.devOpsUsers,
    lang: state.Localize.lang
  };
};

const mapDispatchToProps = {
  getTagsFilter
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PerformerFilter);
