import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SelectDropdown from '../../components/SelectDropdown';
import { getTagsFilter } from '../../actions/Tags';

class PerformerFilter extends React.Component {

  getUsers = () => {
    return this.props.users.map(user => ({
      value: user.id,
      label: user.fullNameRu
    }));
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

PerformerFilter.propTypes = {
  onPerformerSelect: PropTypes.func.isRequired,
  selectedPerformerId: PropTypes.number,
  users: PropTypes.array
};

const mapStateToProps = state => {
  return {
    users: state.Project.project.users
  };
};

const mapDispatchToProps = {
  getTagsFilter
};

export default connect(mapStateToProps, mapDispatchToProps)(PerformerFilter);
