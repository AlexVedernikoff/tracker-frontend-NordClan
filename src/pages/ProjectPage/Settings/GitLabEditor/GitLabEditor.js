import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as css from './GitLabEditor.scss';
import Input from '../../../../components/Input';
import RoundButton from '../../../../components/RoundButton';
import { IconCheck } from '../../../../components/Icons';
import { changeProject } from '../../../../actions/Project';

class GitLabEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  changeValue = e => {
    const value = e.target.value;
    this.setState({ value });
  };

  submit = () => {
    this.props.changeProject({
      gitlabProjectIds: [this.state.value],
      id: this.props.project.id
    });
  };

  render() {
    const { value } = this.state;
    const onChange = this.changeValue;

    return (
      <div className={css.gitLabEditor}>
        <h2>GitLab</h2>
        <Input {...{ value, onChange }} />
        <RoundButton data-tip="Сохранить" onClick={this.submit}>
          <IconCheck />
        </RoundButton>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    project: state.Project.project
  };
}

const mapDispatchToProps = {
  changeProject
};

export default connect(mapStateToProps, mapDispatchToProps)(GitLabEditor);
