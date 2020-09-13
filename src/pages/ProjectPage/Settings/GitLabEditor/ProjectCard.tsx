import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';

import * as css from './GitLabEditor.scss';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import ConfirmModal from '../../../../components/ConfirmModal';
import { IconClose, IconGitlab } from '../../../../components/Icons';
import CopyThis from '../../../../components/CopyThis';
import localize from './ProjectCard.json';

class ProjectCard extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    isNew: PropTypes.bool,
    lang: PropTypes.string,
    project: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isConfirm: false
    };
  }

  deleteProject = () => {
    this.toggleConfirm();
  };

  toggleConfirm = () => {
    this.setState({ isConfirm: !this.state.isConfirm });
  };

  render() {
    const { isNew, project, lang } = this.props;
    const gitlabError = project.error;
    const { isConfirm } = this.state;

    return (
      <div className={classnames([css.projectCard, { [css.isNew]: isNew }])}>
        <div className={css.gitlabId}>GitLab Id: {project.id}</div>
        {!gitlabError ? (
          <div className={css.cardContent}>
            <div className={css.projectName}>
              <span className={css.gitlabLogo}>
                <IconGitlab />{' '}
              </span>
              <a className="underline-link" target="_blank" href={project.web_url} title={project.name_with_namespace}>
                {project.name_with_namespace}
              </a>
            </div>
            <div className={css.repoField}>
              <Input value={project.ssh_url_to_repo} disabled />
              <CopyThis
                wrapThisInto="div"
                isCopiedBackground
                description={`${localize[lang].REPOSITORY_ADDRESS} ${project.name}`}
                textToCopy={project.ssh_url_to_repo}
              >
                <Button icon="IconCopy" data-tip={localize[lang].COPY_ADDRESS} />
              </CopyThis>
            </div>
          </div>
        ) : (
          <div className={css.error}>GitlabError: {project.error}</div>
        )}
        <div onClick={this.toggleConfirm} className={css.deleteProject}>
          <IconClose data-tip={localize[lang].CANSEL_CONNECT} />
        </div>
        {isConfirm ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={`${localize[lang].CONFIRM_CANSEL} ${project.name}?`}
            onCancel={this.toggleConfirm}
            onConfirm={() => this.props.deleteProject(project.id)}
            onRequestClose={this.toggleConfirm}
          />
        ) : null}
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
)(ProjectCard);
