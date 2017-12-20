import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Info.scss';
import { connect } from 'react-redux';

import Attachments from '../../../components/Attachments';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import Description from '../../../components/Description';
import Budget from '../../../components/Budget';
import {
  changeProject,
  startEditing,
  stopEditing,
  uploadAttachments,
  removeAttachment
} from '../../../actions/Project';
import { ADMIN } from '../../../constants/Roles';

class Info extends Component {
  constructor (props) {
    super(props);
  }

  uploadAttachments = (files) => {
    this.props.uploadAttachments(this.props.id, files);
  };

  removeAttachment = (attachmentId) => {
    this.props.removeAttachment(this.props.id, attachmentId);
  };

  onBudgetSubmit = (budget) => {
    this.props.changeProject(
      {
        id: this.props.id,
        budget
      },
      'budget'
    );
  };

  onRiskBudgetSubmit = (riskBudget) => {
    this.props.changeProject(
      {
        id: this.props.id,
        riskBudget
      },
      'riskBudget'
    );
  };

  checkIsAdminInProject = () => {
    return this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.id) !== -1
      || this.props.user.globalRole === ADMIN;
  };

  render () {
    const isProjectAdmin = this.checkIsAdminInProject();

    return (
      <div className={css.info}>
        <h2>Теги проекта</h2>
        <Tags taggable='project'
          direction='right'
          taggableId={this.props.id}
          create
          maxLength={15}
          isProjectAdmin={isProjectAdmin}
        >
          {
            this.props.tags
              ? this.props.tags.map((element, i) =>
                <Tag name={element}
                  key={`${i}-tag`}
                  taggable='project'
                  taggableId={this.props.id}
                />
              )
              : null
          }
        </Tags>
        <hr />
        <Description
          text={{
            __html: this.props.description ? this.props.description : ''
          }}
          headerType='h2'
          id={this.props.id}
          headerText='Описание'
          onEditStart={this.props.startEditing}
          onEditFinish={this.props.stopEditing}
          onEditSubmit={this.props.changeProject}
          isEditing={this.props.descriptionIsEditing}
          isProjectAdmin={isProjectAdmin}
        />
        <hr />
        <Budget
          onEditSubmit={this.onRiskBudgetSubmit}
          header='Бюджет с рисковым резервом'
          value={this.props.riskBudget}
          isProjectAdmin={isProjectAdmin}
        />
        <hr />
        <Budget
          onEditSubmit={this.onBudgetSubmit}
          header='Бюджет без рискового резерва'
          value={this.props.budget}
          isProjectAdmin={isProjectAdmin}
        />
        <hr />
        <h2>Файлы</h2>
        <Attachments
          removeAttachment={this.removeAttachment}
          uploadAttachments={this.uploadAttachments}
          attachments={this.props.attachments}
          isProjectAdmin={isProjectAdmin}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  id: state.Project.project.id,
  tags: state.Project.project.tags,
  description: state.Project.project.description,
  budget: state.Project.project.budget,
  riskBudget: state.Project.project.riskBudget,
  descriptionIsEditing: state.Project.DescriptionIsEditing,
  attachments: state.Project.project.attachments,
  user: state.Auth.user
});

const mapDispatchToProps = {
  changeProject,
  startEditing,
  stopEditing,
  uploadAttachments,
  removeAttachment
};

Info.propTypes = {
  attachments: PropTypes.array,
  budget: PropTypes.number,
  changeProject: PropTypes.func,
  description: PropTypes.string,
  descriptionIsEditing: PropTypes.bool,
  id: PropTypes.number,
  removeAttachment: PropTypes.func,
  riskBudget: PropTypes.number,
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  tags: PropTypes.array,
  uploadAttachments: PropTypes.func,
  user: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
