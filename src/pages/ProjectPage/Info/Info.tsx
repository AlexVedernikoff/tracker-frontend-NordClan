import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Info.scss';
import { connect } from 'react-redux';

import Attachments from '../../../components/Attachments';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import Description from '../../../components/Description';
import {
  changeProject,
  startEditing,
  stopEditing,
  uploadAttachments,
  removeAttachment
} from '../../../actions/Project';
import { ADMIN } from '../../../constants/Roles';
import localize from './Info.json';

class Info extends Component<any, any> {
  constructor(props) {
    super(props);
  }

  uploadAttachments = files => {
    this.props.uploadAttachments(this.props.id, files);
  };

  removeAttachment = attachmentId => {
    this.props.removeAttachment(this.props.id, attachmentId);
  };

  checkIsAdminInProject = () => {
    return (
      (this.props.user.projectsRoles && this.props.user.projectsRoles.admin.indexOf(this.props.id) !== -1) ||
      this.props.user.globalRole === ADMIN
    );
  };

  render() {
    const { lang } = this.props;
    const isProjectAdmin = this.checkIsAdminInProject();

    return (
      <div className={css.info}>
        <h2>{localize[lang].TAGS}</h2>
        <Tags
          taggable="project"
          direction="right"
          taggableId={this.props.id}
          create
          maxLength={15}
          canEdit={isProjectAdmin}
        >
          {this.props.tags
            ? this.props.tags.map((element, i) => (
                <Tag
                  name={element}
                  key={`${i}-tag`}
                  taggable="project"
                  taggableId={this.props.id}
                  blocked={!isProjectAdmin}
                />
              ))
            : null}
        </Tags>
        <hr />
        <Description
          text={{
            __html: this.props.description ? this.props.description : ''
          }}
          headerType="h2"
          id={this.props.id}
          headerText={localize[lang].DESCRIPTION}
          onEditStart={this.props.startEditing}
          onEditFinish={this.props.stopEditing}
          onEditSubmit={this.props.changeProject}
          isEditing={this.props.descriptionIsEditing}
          canEdit={isProjectAdmin}
        />
        <hr />
        <h2>{localize[lang].FILES}</h2>
        <Attachments
          removeAttachment={this.removeAttachment}
          uploadAttachments={this.uploadAttachments}
          attachments={this.props.attachments}
          canEdit={isProjectAdmin}
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
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  changeProject,
  startEditing,
  stopEditing,
  uploadAttachments,
  removeAttachment
};

(Info as any).propTypes = {
  attachments: PropTypes.array,
  budget: PropTypes.number,
  changeProject: PropTypes.func,
  description: PropTypes.string,
  descriptionIsEditing: PropTypes.bool,
  id: PropTypes.number,
  lang: PropTypes.string,
  removeAttachment: PropTypes.func,
  riskBudget: PropTypes.number,
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  tags: PropTypes.array,
  uploadAttachments: PropTypes.func,
  user: PropTypes.object.isRequired
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Info);
