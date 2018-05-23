import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as css from './GitLabEditor.scss';
import Input from '../../../../components/Input';
import Button from '../../../../components/Button';
import { IconClose, IconGitlab } from '../../../../components/Icons';
import CopyThis from '../../../../components/CopyThis';

class ProjectCard extends Component {
  static propTypes = {
    deleteProject: PropTypes.func,
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const gitlabError = project.error;

    return (
      <div className={css.projectCard}>
        <div className={css.gitlabId}>GitLab Id: {project.id}</div>
        {!gitlabError ? (
          <div className={css.cardContent}>
            <div className={css.projectName}>
              <span className={css.gitlabLogo}>
                <IconGitlab />{' '}
              </span>
              <a className="underline-link" target="_blank" href={project.web_url}>
                {project.name_with_namespace}
              </a>
            </div>
            <div className={css.repoField}>
              <Input value={project.ssh_url_to_repo} disabled />
              <CopyThis
                wrapThisInto="div"
                isCopiedBackground
                description={`Адрес репозитория ${project.name}`}
                textToCopy={project.ssh_url_to_repo}
              >
                <Button icon="IconCopy" data-tip="Скопировать адрес (ssh)" />
              </CopyThis>
            </div>
          </div>
        ) : (
          <div className={css.error}>GitlabError: {project.error}</div>
        )}
        <div onClick={() => this.props.deleteProject(project.id)} className={css.deleteProject}>
          <IconClose data-tip="Отменить связь" />
        </div>
      </div>
    );
  }
}

export default ProjectCard;
