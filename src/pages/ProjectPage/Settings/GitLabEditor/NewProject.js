import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as css from './GitLabEditor.scss';
import ValidatedInput from '../../../../components/ValidatedInput';
import Validator from '../../../../components/ValidatedInput/Validator';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck, IconClose } from '../../../../components/Icons';
import { connect } from 'react-redux';
import localize from './NewProject.json';

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
      projectId: ''
    };
    this.validator = new Validator();
  }

  changeValue = e => {
    this.setState({ projectId: e.target.value });
  };

  cancelBound = () => {
    this.props.onCancel();
  };

  submit = () => {
    this.props.onSubmit(this.state.projectId);
  };

  render() {
    const { lang } = this.props;
    const invalid = false;

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
              errorText={localize[lang].ERROR_TEXT}
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
        <RoundButton
          style={{ marginLeft: '0.5rem' }}
          onClick={this.cancelBound}
          className={css.saveProject}
          disabled={invalid}
        >
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
