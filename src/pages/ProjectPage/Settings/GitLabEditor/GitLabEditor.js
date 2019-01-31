import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import get from 'lodash/get';
import remove from 'lodash/remove';

import * as css from './GitLabEditor.scss';
import { changeProject } from '../../../../actions/Project';
import { addGitlabProjectByName, getNamespaces, createGitlabProject } from '../../../../actions/Gitlab';
import ProjectList from './ProjectList';
import NewProject from './NewProject';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { ADMIN } from '../../../../constants/Roles';
import localize from './GitLabEditor.json';

import Modal from '../../../../components/Modal';
import SelectDropdown from '../../../../components/SelectDropdown';
import ConfirmModal from '../../../../components/ConfirmModal/ConfirmModal';
import { getFullName } from '../../../../utils/NameLocalisation';

class GitLabEditor extends Component {
  static propTypes = {
    addGitlabProjectByName: PropTypes.func,
    changeProject: PropTypes.func,
    createGitlabProject: PropTypes.func,
    getNamespaces: PropTypes.func,
    lang: PropTypes.string,
    namespaces: PropTypes.array,
    project: PropTypes.object,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      isModalOpenCreateGitlabProject: false,
      isNotProcessedUsersModalOpen: false,
      projectName: ''
    };
  }

  componentDidMount() {
    this.props.getNamespaces();
  }

  componentWillReceiveProps(newProps) {
    if (get(newProps, 'project.gitlabProjectIds.length') !== get(this, 'props.project.gitlabProjectIds.length')) {
      this.setState({ isAdding: false });
    }
    if (get(newProps, 'project.gitlabProjects.length') !== get(this, 'props.project.gitlabProjects.length')) {
      this.setState({ isAdding: false });
    }
    if (!get(newProps, 'project.notProcessedGitlabUsers.length')) {
      this.setState({ isNotProcessedUsersModalOpen: false });
    } else if (!get(this.props, 'project.notProcessedGitlabUsers.length')) {
      this.setState({ isNotProcessedUsersModalOpen: true });
    }
  }

  toggleCreating = () => {
    this.setState({ isAdding: !this.state.isAdding });
  };

  cancelBound = () => {
    this.setState({ isAdding: false });
  };

  handleOpenModalAddGitlabProject = () => {
    this.setState({
      isModalOpenCreateGitlabProject: true
    });
  };

  handleCloseloseNotProcessedModal = () => {
    this.setState({ isNotProcessedUsersModalOpen: false });
  };

  handleCloseModalAddGitlabProject = () => {
    this.setState({
      isModalOpenCreateGitlabProject: false,
      namespace: '',
      projectName: ''
    });
  };

  handleNamespacesSearch = name => {
    clearTimeout(this.namespacesTimeout);
    this.namespacesTimeout = setTimeout(() => {
      this.props.getNamespaces(name);
    }, 200);
  };

  saveProject = value => {
    if (isNaN(value)) {
      this.props.addGitlabProjectByName(this.props.project.id, value);
    } else {
      const { gitlabProjectIds } = this.props.project;
      this.props.changeProject({
        gitlabProjectIds: _.union(gitlabProjectIds, [+value]),
        id: this.props.project.id
      });
    }
  };

  deleteProject = value => {
    const idsWithoutRemoved = [...this.props.project.gitlabProjectIds];
    remove(idsWithoutRemoved, id => id === value);

    this.props.changeProject({
      gitlabProjectIds: idsWithoutRemoved,
      id: this.props.project.id
    });
  };

  checkIsAdminInProject = () => {
    return (
      get(this.props.user, 'projectsRoles.admin', []).includes(this.props.project.id) ||
      this.props.user.globalRole === ADMIN
    );
  };

  getNamespaces = () => {
    return this.props.namespaces.map(ns => ({
      value: ns.id,
      label: ns.name
    }));
  };

  selectNamespace = key => {
    return option => {
      this.setState({ [key]: option });
    };
  };

  selectProjectName = e => {
    const pattern = /^[A-Za-zА-Яа-я0-9 _]*$/;
    const result = pattern.test(e.target.value);
    if (result === true) {
      this.setState({
        projectName: e.target.value
      });
    }
  };

  createProject = () => {
    this.props.createGitlabProject(this.props.project.id, this.state.projectName, this.state.namespace.value);
    this.handleCloseModalAddGitlabProject();
  };

  render() {
    const { project, lang } = this.props;
    const { isAdding } = this.state;
    const isProjects = get(project, 'gitlabProjects.length', false);
    const isProjectAdmin = this.checkIsAdminInProject();
    const notProcessedGitlabUsers = project.notProcessedGitlabUsers || [];

    return (
      <div className={css.gitLabEditor}>
        <h2>GitLab</h2>
        {isProjectAdmin ? (
          <Button
            onClick={this.handleOpenModalAddGitlabProject}
            addedClassNames={{ [css.addButton]: true }}
            type="primary"
            icon="IconPlus"
            text={localize[lang].CREATE_REPO}
          />
        ) : null}
        {isAdding && isProjectAdmin ? (
          <NewProject
            className={css.addNewProject}
            projectIds={project.gitlabProjectIds}
            onSubmit={this.saveProject}
            onCancel={this.cancelBound}
            callback={this.toggleCreating}
          />
        ) : isProjectAdmin ? (
          <Button
            onClick={this.toggleCreating}
            addedClassNames={{ [css.addButton]: true }}
            type="primary"
            icon="IconPlus"
            text={localize[lang].BOUND_REPO}
          />
        ) : null}
        {this.state.isModalOpenCreateGitlabProject ? (
          <Modal isOpen contentLabel="modal" onRequestClose={this.handleCloseModalAddGitlabProject}>
            <form className={css.createGitlabProject}>
              <h3>{localize[lang].CREATE_REPO}</h3>
              <div className={css.modalContainer}>
                <SelectDropdown
                  name="member"
                  placeholder={localize[lang].NAMESPACE}
                  multi={false}
                  value={this.state.namespace}
                  onChange={this.selectNamespace('namespace')}
                  options={this.getNamespaces()}
                  onInputChange={this.handleNamespacesSearch}
                  autofocus
                />
                <div>
                  <Input
                    placeholder={localize[lang].PROJECT_NAME}
                    value={this.state.projectName}
                    onChange={this.selectProjectName}
                  />
                </div>
                <Button
                  type="green"
                  htmlType="submit"
                  text={localize[lang].CREATE}
                  onClick={this.createProject}
                  disabled={!(this.state.namespace && this.state.projectName)}
                />
              </div>
            </form>
          </Modal>
        ) : null}
        {this.state.isNotProcessedUsersModalOpen ? (
          <ConfirmModal
            isOpen
            notification
            contentLabel="modal"
            text={
              <div className={css.modalWarningContent}>
                <span>{localize[lang].GITLAB_WARNING_POPUP_CAPTION}:</span>
                <ul>
                  {notProcessedGitlabUsers.map(({ user, data: { gitlabProjectId }, error }) => {
                    const gitlabProject = project.gitlabProjects.find(({ id }) => id === gitlabProjectId);
                    return (
                      <li>
                        {getFullName(user)} ({gitlabProject && gitlabProject.name}
                        ): {error}
                      </li>
                    );
                  })}
                </ul>
              </div>
            }
            lang={lang}
            onCancel={this.handleCloseloseNotProcessedModal}
          />
        ) : null}
        {isProjects ? <ProjectList deleteProject={this.deleteProject} projects={project.gitlabProjects} /> : null}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    project: state.Project.project,
    user: state.Auth.user,
    lang: state.Localize.lang,
    namespaces: state.Gitlab.gitlabNamespaces
  };
}

const mapDispatchToProps = {
  changeProject,
  addGitlabProjectByName,
  getNamespaces,
  createGitlabProject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GitLabEditor);
