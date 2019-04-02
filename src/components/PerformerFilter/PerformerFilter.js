import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';
import localize from './PerformerFilter.json';
import { getFullName } from '../../utils/NameLocalisation';
import { removeNumChars } from '../../utils/formatter';
import { projectPerformersSelector } from '../../selectors/Project';

class PerformerFilter extends React.Component {
  static propTypes = {
    lang: PropTypes.string,
    onPerformerSelect: PropTypes.func.isRequired,
    selectedPerformerId: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    test: PropTypes.string,
    users: PropTypes.array
  };

  getUsers = () => {
    const sourceUsers =
      this.props.devOpsUsers && this.props.devOpsUsers.length ? this.props.devOpsUsers : this.props.users;

    const users = sourceUsers.map(user => ({
      value: user.id,
      label: getFullName(user)
    }));
    users.sort((a, b) => {
      if (a.label < b.label) {
        return -1;
      } else if (a.label > b.label) {
        return 1;
      }
    });
    users.unshift({ value: '0', label: localize[this.props.lang].NOT_CHANGED });
    return users;
  };

  render() {
    const { lang } = this.props;
    return (
      <SelectDropdown
        {...this.props}
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
    users: projectPerformersSelector(state),
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
