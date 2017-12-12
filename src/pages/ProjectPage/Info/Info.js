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

class Info extends Component {
  constructor (props) {
    super(props);
  }

  uploadAttachments = (files) => {
    this.props.uploadAttachments(this.props.id, files);
  }

  removeAttachment = (attachmentId) => {
    this.props.removeAttachment(this.props.id, attachmentId);
  }

  onBudgetSubmit  = (budget) => {
    this.props.changeProject(
      {
        id: this.props.id,
        budget
      },
      'budget'
    );
  }

  onRiskBudgetSubmit = (riskBudget) => {
    this.props.changeProject(
      {
        id: this.props.id,
        riskBudget
      },
      'riskBudget'
    );
  }

  render () {
    return (
      <div className={css.info}>
        <h2>Теги проекта</h2>
        <Tags taggable='project'
              direction='right'
              taggableId={this.props.id}
              create
              maxLength={15}>
          {this.props.tags
            ? this.props.tags.map((element, i) =>
                <Tag name={element}
                     key={`${i}-tag`}
                     taggable='project'
                     taggableId={this.props.id}/>
              )
            : null}
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
        />
        <hr />
        <Budget
          onEditSubmit={this.onRiskBudgetSubmit}
          header='Бюджет с рисковым резервом'
          value={this.props.riskBudget}
        />
        <hr />
        <Budget
          onEditSubmit={this.onBudgetSubmit}
          header='Бюджет без рискового резерва'
          value={this.props.budget}
        />
        <hr />
        <h2>Файлы</h2>
        <Attachments removeAttachment={this.removeAttachment} uploadAttachments={this.uploadAttachments} attachments={this.props.attachments}/>
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
  attachments: state.Project.project.attachments
});

const mapDispatchToProps = {
  changeProject,
  startEditing,
  stopEditing,
  uploadAttachments,
  removeAttachment
};

Info.propTypes = {
  budget: PropTypes.number,
  changeProject: PropTypes.func,
  description: PropTypes.string,
  descriptionIsEditing: PropTypes.bool,
  id: PropTypes.number,
  riskBudget: PropTypes.number,
  startEditing: PropTypes.func,
  stopEditing: PropTypes.func,
  tags: PropTypes.array,
  attachments: PropTypes.array,
  uploadAttachments: PropTypes.func,
  removeAttachment: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
