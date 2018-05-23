import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as css from './GitLabEditor.scss';
import InputNumber from '../../../../components/InputNumber';
import ValidatedInput from '../../../../components/ValidatedInput';
import Validator from '../../../../components/ValidatedInput/Validator';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck } from '../../../../components/Icons';

class NewProject extends Component {
  static propTypes = {
    onSubmit: PropTypes.func,
    projectIds: PropTypes.array
  };

  static defaultProps = {
    projectIds: []
  };

  constructor(props) {
    super(props);
    this.state = {
      projectId: ''
    };
    this.validator = new Validator();
  }

  changeValue = e => {
    this.setState({ projectId: e.target.value });
  };

  submit = () => {
    this.props.onSubmit(this.state.projectId);
  };

  render() {
    const { projectIds } = this.props;
    const invalid = !Number.isInteger(+this.state.projectId) || projectIds.includes(+this.state.projectId);

    return (
      <div className={css.newProject}>
        {this.validator.validate(
          (handleBlur, shouldMarkError) => (
            <ValidatedInput
              autoFocus
              name="projectId"
              placeholder="id проекта в GitLab"
              onChange={this.changeValue}
              onBlur={handleBlur}
              shouldMarkError={shouldMarkError}
              errorText="Должен быть уникальным целым числом"
            />
          ),
          'projectId',
          invalid
        )}
        <RoundButton
          style={{ marginLeft: '0.5rem' }}
          onClick={this.submit}
          className={css.saveProject}
          disabled={invalid}
        >
          <IconCheck />
        </RoundButton>
      </div>
    );
  }
}

export default NewProject;
