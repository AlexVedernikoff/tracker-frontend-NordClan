import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import * as css from './GitLabEditor.scss';
import ValidatedInput from '../../../../components/ValidatedInput';
import Validator from '../../../../components/ValidatedInput/Validator';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck, IconClose } from '../../../../components/Icons';
import { connect } from 'react-redux';
import localize from './NewProject.json';

const validErrorCodes = {
  AlreadyLinked: 'ERROR_ALREADY_LINKED',
  NotFullPath: 'ERROR_NOT_FULL_PATH',
  EmptyValue: 'ERROR_EMPTY_VALUE'
};

class NewProject extends Component {
  static propTypes = {
    lang: PropTypes.string,
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    projectIds: PropTypes.array
  };

  static defaultProps = {
    projectIds: []
  };

  constructor(props) {
    super(props);
    this.state = {
      projectId: '',
      errorCode: null
    };
    this.validator = new Validator();
  }

  changeValue = e => {
    this.setState({ projectId: e.target.value, errorCode: null });
  };

  cancelBound = () => {
    this.props.onCancel();
  };

  submit = () => {
    const projectId = this.state.projectId;
    if (!projectId.trim()) return this.setState({ errorCode: validErrorCodes.EmptyValue });
    if (isNaN(projectId)) {
      if (!/^[a-zA-Z0-9\-]+\/[a-zA-Z0-9\-]+$/.test(projectId)) {
        // checks if projectId (as path) is in form of namespace/project-name
        return this.setState({ errorCode: validErrorCodes.NotFullPath });
      }
    } else if (_.includes(this.props.projectIds, +projectId)) {
      return this.setState({ errorCode: validErrorCodes.AlreadyLinked });
    }
    this.props.onSubmit(projectId);
  };

  render() {
    const { lang } = this.props;
    const { errorCode } = this.state;
    const invalid = !!errorCode;

    return (
      <div className={css.newProject}>
        {this.validator.validate(
          (handleBlur, shouldMarkError) => (
            <ValidatedInput
              autoFocus
              name="projectId"
              placeholder={localize[lang].PLACEHOLDER}
              onChange={this.changeValue}
              onBlur={handleBlur}
              shouldMarkError={shouldMarkError}
              errorText={localize[lang][errorCode || 'ERROR_TEXT']}
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
        <RoundButton style={{ marginLeft: '0.5rem' }} onClick={this.cancelBound} className={css.saveProject}>
          <IconClose />
        </RoundButton>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(NewProject);
