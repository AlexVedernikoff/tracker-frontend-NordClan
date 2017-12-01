import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';

class PerformerFilter extends React.Component {

  static propTypes = {
    onPerformerSelect: PropTypes.func.isRequired,
    selectedPerformerId: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    users: PropTypes.array
  };

  getUsers = () => {
    const users = [];
    users = this.props.users.map(user => ({
      value: user.id,
      label: user.fullNameRu
    }));
    users.unshift({ value: '0', label: 'Не назначено' });
    return users;
  };

  render () {
    return (
      <SelectDropdown
        name="performer"
        placeholder="Введите имя исполнителя..."
        multi={false}
        value={this.props.selectedPerformerId}
        onChange={this.props.onPerformerSelect}
        noResultsText="Нет результатов"
        options={this.getUsers()}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    users: state.Project.project.users
  };
};

const mapDispatchToProps = {
  getTagsFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformerFilter);
