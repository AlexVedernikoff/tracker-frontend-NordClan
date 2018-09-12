import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';
import localize from './PerformerFilter.json';
import { getFullName } from '../../utils/NameLocalisation';

class PerformerFilter extends React.Component {
  static propTypes = {
    onPerformerSelect: PropTypes.func.isRequired,
    selectedPerformerId: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    users: PropTypes.array
  };

  getUsers = () => {
    const users = this.props.users.map(user => ({
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
        noResultsText={localize[lang].NO_RESULTS}
        options={this.getUsers()}
        backspaceToRemoveMessage={''}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.Project.project.users,
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
