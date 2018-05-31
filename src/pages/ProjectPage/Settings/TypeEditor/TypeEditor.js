import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changeProject } from '../../../../actions/Project';
import Select from '../../../../components/SelectDropdown';
import * as css from './TypeEditor.scss';
import checkProjectAdmin from '../../../../utils/checkProjectAdmin';

class TypeEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    project: PropTypes.object,
    projectTypes: PropTypes.array,
    user: PropTypes.object
  };

  changeType = option => {
    const value = option ? option.value : 1;
    this.props.changeProject(
      {
        id: this.props.project.id,
        typeId: value
      },
      'typeId'
    );
  };

  render() {
    const { projectTypes, project, user } = this.props;
    const isProjectAdmin = checkProjectAdmin(user, project.id);
    const options = projectTypes.map(type => ({ value: type.id, label: type.name }));

    return (
      <div className={css.TypeEditor}>
        <h2>Тип проекта</h2>
        <div className={css.selectType}>
          <Select
            name="performer"
            disabled={!isProjectAdmin}
            placeholder="Выберите тип проекта"
            multi={false}
            noResultsText="Нет результатов"
            backspaceRemoves={false}
            options={options}
            onChange={this.changeType}
            value={project.typeId}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    projectTypes: state.Dictionaries.projectTypes || [],
    project: state.Project.project,
    user: state.Auth.user
  };
}

const mapDispatchToProps = {
  changeProject
};

export default connect(mapStateToProps, mapDispatchToProps)(TypeEditor);
