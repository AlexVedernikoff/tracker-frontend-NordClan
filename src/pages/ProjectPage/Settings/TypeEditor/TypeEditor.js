import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { changeProject } from '../../../../actions/Project';
import Select from '../../../../components/SelectDropdown';
import * as css from './TypeEditor.scss';
import checkProjectAdmin from '../../../../utils/checkProjectAdmin';
import localize from './TypeEditor.json';
import { getLocalizedProjectTypes } from '../../../../selectors/dictionaries';

class TypeEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    lang: PropTypes.string,
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
    const { projectTypes, project, user, lang } = this.props;
    const isProjectAdmin = checkProjectAdmin(user, project.id);
    const options = projectTypes.map(type => ({ value: type.id, label: type.name }));

    return (
      <div className={css.TypeEditor}>
        <h2>{localize[lang].PROJECT_TYPE}</h2>
        <div className={css.selectType}>
          <Select
            name="performer"
            disabled={!isProjectAdmin}
            placeholder={localize[lang].SELECT_PROJECT_TYPE}
            multi={false}
            noResultsText={localize[lang].NO_RESULTS}
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
    projectTypes: getLocalizedProjectTypes(state) || [],
    project: state.Project.project,
    user: state.Auth.user,
    lang: state.Localize.lang
  };
}

const mapDispatchToProps = {
  changeProject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TypeEditor);
