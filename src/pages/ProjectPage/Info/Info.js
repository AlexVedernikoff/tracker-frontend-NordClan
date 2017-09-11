import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Info.scss';
import { connect } from 'react-redux';

import Attachments from '../../../components/Attachments';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import Description from '../../../components/Description';
import Budget from '../../../components/Budget';
import { DescriptionText } from '../../../mocks/descriptionText';
import {
  ChangeProject,
  StartEditing,
  StopEditing
} from '../../../actions/Project';

class Info extends Component {
  constructor (props) {
    super(props);
  }

  onBudgetSubmit (budget) {
    this.props.ChangeProject(
      {
        id: this.props.id,
        budget
      },
      'budget'
    );
  }

  onRiskBudgetSubmit (riskBudget) {
    this.props.ChangeProject(
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
          onEditStart={this.props.StartEditing}
          onEditFinish={this.props.StopEditing}
          onEditSubmit={this.props.ChangeProject}
          isEditing={this.props.DescriptionIsEditing}
        />
        <hr />
        <Budget
          onEditSubmit={this.onRiskBudgetSubmit.bind(this)}
          header='Бюджет с рисковым резервом'
          value={this.props.riskBudget}
        />
        <hr />
        <Budget
          onEditSubmit={this.onBudgetSubmit.bind(this)}
          header='Бюджет без рискового резерва'
          value={this.props.budget}
        />
        <hr />
        <h2>Файлы</h2>
        <Attachments />
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
  DescriptionIsEditing: state.Project.DescriptionIsEditing
});

const mapDispatchToProps = {
  ChangeProject,
  StartEditing,
  StopEditing
};

Info.propTypes = {
  ChangeProject: PropTypes.func,
  DescriptionIsEditing: PropTypes.bool,
  StartEditing: PropTypes.func,
  StopEditing: PropTypes.func,
  budget: PropTypes.number,
  description: PropTypes.string,
  id: PropTypes.number,
  riskBudget: PropTypes.number,
  tags: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
